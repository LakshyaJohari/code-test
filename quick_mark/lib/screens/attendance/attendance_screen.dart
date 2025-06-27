import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:camera/camera.dart';
import '../../services/qr_scanner_service.dart';
import '../../services/face/face_recognition_service.dart';
import '../../services/attendance_service.dart';
import '../../services/auth_service.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  // Attendance workflow state
  int _currentStep = 0; // 0: Scan QR, 1: Verify Face, 2: Submit Attendance
  bool _isProcessing = false;

  // QR Code data
  String? _scannedQRData;
  Map<String, dynamic>? _qrDetails;

  // Face verification data
  bool _faceVerified = false;

  // Camera controller for face verification
  CameraController? _cameraController;
  List<CameraDescription>? _cameras;
  bool _isCameraInitialized = false;

  // UI controllers
  MobileScannerController? _qrController;

  @override
  void initState() {
    super.initState();
    _resetWorkflow();
  }

  @override
  void dispose() {
    _qrController?.dispose();
    _cameraController?.dispose();
    super.dispose();
  }

  void _resetWorkflow() {
    setState(() {
      _currentStep = 0;
      _isProcessing = false;
      _scannedQRData = null;
      _qrDetails = null;
      _faceVerified = false;
    });
    _qrController?.dispose();
    _qrController = null;
    _cameraController?.dispose();
    _cameraController = null;
    _isCameraInitialized = false;
  }

  // Step 1: Scan QR Code
  Future<void> _startQRScanning() async {
    setState(() {
      _currentStep = 0;
      _isProcessing = true;
    });

    // Initialize QR controller if needed
    _qrController ??= MobileScannerController();
  }

  void _onQRDetected(BarcodeCapture capture) {
    if (_isProcessing || capture.barcodes.isEmpty) return;

    final qrData = capture.barcodes.first.rawValue;
    if (qrData == null || qrData == _scannedQRData) return;

    _processQRCode(qrData);
  }

  Future<void> _processQRCode(String qrData) async {
    setState(() {
      _isProcessing = true;
    });

    final qrDetails = QRScannerService.parseQRData(qrData);

    if (qrDetails == null) {
      _showErrorDialog('Invalid QR Code', 'The QR code format is invalid.');
      setState(() {
        _isProcessing = false;
      });
      return;
    }

    if (!QRScannerService.isValidQRCode(qrDetails)) {
      _showErrorDialog(
        'Expired QR Code',
        'The QR code has expired. Please ask your faculty for a new one.',
      );
      setState(() {
        _isProcessing = false;
      });
      return;
    }

    setState(() {
      _scannedQRData = qrData;
      _qrDetails = qrDetails;
      _currentStep = 1; // Move to face verification step
      _isProcessing = false;
    });

    // Stop QR controller to prevent continuous scanning
    _qrController?.stop();
  }

  // Step 2: Face Verification
  Future<void> _startFaceVerification() async {
    setState(() {
      _isProcessing = true;
    });

    try {
      final student = await AuthService.getStudent();
      if (student == null) {
        _showErrorDialog('Error', 'Student information not found.');
        return;
      }

      // Check if face is registered
      final hasFace = await FaceRecognitionService.isFaceRegistered(student.id);
      if (!hasFace) {
        _showErrorDialog(
          'Face Not Registered',
          'Please register your face in the Profile section first.',
        );
        setState(() {
          _isProcessing = false;
        });
        return;
      }

      // Initialize camera
      await _initializeCamera();

      setState(() {
        _currentStep = 1;
        _isProcessing = false;
      });
    } catch (e) {
      _showErrorDialog('Error', 'Failed to initialize face verification: $e');
      setState(() {
        _isProcessing = false;
      });
    }
  }

  Future<void> _performFaceVerification() async {
    if (_cameraController == null || !_isCameraInitialized) {
      _showErrorDialog('Camera Error', 'Camera is not available.');
      return;
    }

    setState(() {
      _isProcessing = true;
    });

    try {
      final image = await _cameraController!.takePicture();
      final student = await AuthService.getStudent();

      if (student == null) {
        _showErrorDialog('Error', 'Student information not found.');
        return;
      }

      final recognizedStudentId = await FaceRecognitionService.recognizeFace(
        image.path,
      );
      final isVerified = recognizedStudentId == student.id;

      setState(() {
        _faceVerified = isVerified;
        _currentStep = 2; // Move to submit step
        _isProcessing = false;
      });

      if (isVerified) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Face verified successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        _showErrorDialog(
          'Face Verification Failed',
          'Face verification failed. Please try again.',
        );
        setState(() {
          _currentStep = 1; // Stay on face verification step
        });
      }
    } catch (e) {
      _showErrorDialog('Error', 'Face verification failed: $e');
      setState(() {
        _isProcessing = false;
      });
    }
  }

  // Step 3: Submit Attendance
  Future<void> _submitAttendance() async {
    if (_qrDetails == null || !_faceVerified) {
      _showErrorDialog(
        'Error',
        'Please complete all verification steps first.',
      );
      return;
    }

    setState(() {
      _isProcessing = true;
    });

    try {
      final response = await AttendanceService.markAttendance(
        sessionCode: _scannedQRData!, // Use the full QR data as session code
        qrData: _scannedQRData!,
        faceVerified: _faceVerified,
      );

      setState(() {
        _isProcessing = false;
      });

      if (response != null && response.success) {
        _showSuccessDialog(
          'Attendance Marked!',
          'Your attendance has been successfully recorded.',
        );
        _resetWorkflow(); // Reset for next attendance
      } else {
        _showErrorDialog(
          'Attendance Failed',
          response?.message ?? 'Failed to mark attendance. Please try again.',
        );
      }
    } catch (e) {
      setState(() {
        _isProcessing = false;
      });
      _showErrorDialog('Error', 'Failed to submit attendance: $e');
    }
  }

  Future<void> _initializeCamera() async {
    try {
      _cameras = await availableCameras();
      if (_cameras != null && _cameras!.isNotEmpty) {
        _cameraController = CameraController(
          _cameras!.first,
          ResolutionPreset.medium,
        );
        await _cameraController!.initialize();
        setState(() {
          _isCameraInitialized = true;
        });
      }
    } catch (e) {
      print('Error initializing camera: $e');
    }
  }

  void _showErrorDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              _buildStepIndicator(),
              const SizedBox(height: 24),
              _buildCurrentStepContent(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepIndicator() {
    return Row(
      children: [
        _buildStepCircle(0, 'Scan QR', Icons.qr_code_scanner),
        Expanded(child: _buildStepLine(0)),
        _buildStepCircle(1, 'Verify Face', Icons.face),
        Expanded(child: _buildStepLine(1)),
        _buildStepCircle(2, 'Submit', Icons.check),
      ],
    );
  }

  Widget _buildStepCircle(int step, String label, IconData icon) {
    final isActive = _currentStep == step;
    final isCompleted = _currentStep > step;

    return Column(
      children: [
        Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isCompleted
                ? Colors.green
                : isActive
                ? Colors.blue
                : Colors.grey[300],
          ),
          child: Icon(
            isCompleted ? Icons.check : icon,
            color: isCompleted || isActive ? Colors.white : Colors.grey[600],
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
            color: isActive ? Colors.blue : Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildStepLine(int step) {
    final isCompleted = _currentStep > step;
    return Container(
      height: 2,
      color: isCompleted ? Colors.green : Colors.grey[300],
    );
  }

  Widget _buildCurrentStepContent() {
    switch (_currentStep) {
      case 0:
        return _buildQRScanStep();
      case 1:
        return _buildFaceVerificationStep();
      case 2:
        return _buildSubmitStep();
      default:
        return _buildQRScanStep();
    }
  }

  Widget _buildQRScanStep() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Icon(Icons.qr_code_scanner, size: 64, color: Colors.blue),
            const SizedBox(height: 16),
            const Text(
              'Step 1: Scan QR Code',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Scan the QR code provided by your faculty to begin attendance marking.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 24),
            if (_qrDetails != null) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.green),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.check_circle, color: Colors.green),
                    const SizedBox(height: 8),
                    const Text(
                      'QR Code Scanned Successfully!',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.green,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text('Session: ${_qrDetails!['session_id']}'),
                    if (_qrDetails!.containsKey('subject_id'))
                      Text('Subject: ${_qrDetails!['subject_id']}')
                    else if (_qrDetails!.containsKey('location'))
                      Text('Location: ${_qrDetails!['location']}'),
                    if (_qrDetails!.containsKey('faculty_id'))
                      Text('Faculty: ${_qrDetails!['faculty_id']}'),
                    if (_qrDetails!.containsKey('session_date'))
                      Text('Date: ${_qrDetails!['session_date']}'),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _startFaceVerification,
                child: const Text('Proceed to Face Verification'),
              ),
            ] else ...[
              if (_isProcessing && _currentStep == 0) ...[
                SizedBox(
                  height: 300,
                  child: _qrController != null
                      ? MobileScanner(
                          controller: _qrController!,
                          onDetect: _onQRDetected,
                        )
                      : const Center(child: CircularProgressIndicator()),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () {
                    _qrController?.stop();
                    setState(() {
                      _isProcessing = false;
                    });
                  },
                  child: const Text('Stop Scanning'),
                ),
              ] else ...[
                ElevatedButton.icon(
                  onPressed: _startQRScanning,
                  icon: const Icon(Icons.qr_code_scanner),
                  label: const Text('Start QR Scanning'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 32,
                      vertical: 16,
                    ),
                  ),
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildFaceVerificationStep() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const Icon(Icons.face, size: 64, color: Colors.orange),
            const SizedBox(height: 16),
            const Text(
              'Step 2: Verify Face',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Look at the camera and tap "Verify Face" to confirm your identity.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 24),
            if (_isCameraInitialized && _cameraController != null) ...[
              SizedBox(
                height: 300,
                width: double.infinity,
                child: CameraPreview(_cameraController!),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _isProcessing ? null : _performFaceVerification,
                icon: _isProcessing
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : const Icon(Icons.camera_alt),
                label: Text(_isProcessing ? 'Verifying...' : 'Verify Face'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.orange,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 16,
                  ),
                ),
              ),
            ] else ...[
              const CircularProgressIndicator(),
              const SizedBox(height: 16),
              const Text('Initializing camera...'),
            ],
            const SizedBox(height: 16),
            TextButton(
              onPressed: () => setState(() => _currentStep = 0),
              child: const Text('Back to QR Scan'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmitStep() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Icon(
              _faceVerified ? Icons.check_circle : Icons.error,
              size: 64,
              color: _faceVerified ? Colors.green : Colors.red,
            ),
            const SizedBox(height: 16),
            const Text(
              'Step 3: Submit Attendance',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(
              _faceVerified
                  ? 'All verifications completed. Ready to submit attendance.'
                  : 'Face verification failed. Please try again.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: _faceVerified ? Colors.green : Colors.red,
              ),
            ),
            const SizedBox(height: 24),
            if (_qrDetails != null) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.blue),
                ),
                child: Column(
                  children: [
                    const Text(
                      'Attendance Summary',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text('Session: ${_qrDetails!['session_id']}'),
                    if (_qrDetails!.containsKey('subject_id'))
                      Text('Subject: ${_qrDetails!['subject_id']}')
                    else if (_qrDetails!.containsKey('location'))
                      Text('Location: ${_qrDetails!['location']}'),
                    if (_qrDetails!.containsKey('faculty_id'))
                      Text('Faculty: ${_qrDetails!['faculty_id']}'),
                    Text('QR Verified: ✓'),
                    Text('Face Verified: ${_faceVerified ? '✓' : '✗'}'),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                OutlinedButton(
                  onPressed: () => setState(() => _currentStep = 1),
                  child: const Text('Back to Face Verification'),
                ),
                ElevatedButton.icon(
                  onPressed: _faceVerified && !_isProcessing
                      ? _submitAttendance
                      : null,
                  icon: _isProcessing
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.send),
                  label: Text(
                    _isProcessing ? 'Submitting...' : 'Submit Attendance',
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 32,
                      vertical: 16,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: _resetWorkflow,
              child: const Text('Start Over'),
            ),
          ],
        ),
      ),
    );
  }
}
