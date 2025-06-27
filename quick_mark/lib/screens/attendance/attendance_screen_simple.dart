import 'package:flutter/material.dart';
import '../qr_scanner_page.dart';
import '../../services/attendance_service.dart';
import '../../services/auth_service.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  bool _isProcessing = false;
  String? _scannedQRData;
  String? _lastQRResult;

  Future<void> _openQRScanner() async {
    final qrValue = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const QRScannerPage()),
    );

    if (qrValue != null && qrValue.isNotEmpty) {
      setState(() {
        _scannedQRData = qrValue;
      });
      await _processQRCode(qrValue);
    }
  }

  Future<void> _processQRCode(String qrData) async {
    setState(() {
      _isProcessing = true;
    });

    try {
      // Get the current student
      final student = await AuthService.getStudent();
      if (student == null) {
        _showErrorDialog('Error', 'Please log in again.');
        return;
      }

      // Mark attendance using the QR data (without face verification for simplicity)
      final result = await AttendanceService.markAttendance(
        sessionCode: qrData, // Use the QR data as session code
        qrData: qrData,
        faceVerified: false, // Skip face verification for simple approach
      );

      if (result != null && result.success) {
        setState(() {
          _lastQRResult = 'Attendance marked successfully!';
        });
        _showSuccessDialog('Success', 'Attendance marked successfully!');
      } else {
        setState(() {
          _lastQRResult = 'Failed to mark attendance';
        });
        _showErrorDialog(
          'Error',
          result?.message ?? 'Failed to mark attendance',
        );
      }
    } catch (e) {
      setState(() {
        _lastQRResult = 'Error: $e';
      });
      _showErrorDialog('Error', 'Failed to mark attendance: $e');
    } finally {
      setState(() {
        _isProcessing = false;
      });
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
        title: Text(title, style: const TextStyle(color: Colors.green)),
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
      appBar: AppBar(
        title: const Text('Mark Attendance'),
        backgroundColor: const Color(0xFF007AFF),
        foregroundColor: Colors.white,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(
                Icons.qr_code_scanner,
                size: 100,
                color: Color(0xFF007AFF),
              ),
              const SizedBox(height: 32),
              const Text(
                'QuickMark Attendance',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF007AFF),
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                'Scan the QR code provided by your instructor to mark your attendance.',
                style: TextStyle(fontSize: 16, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              ElevatedButton(
                onPressed: _isProcessing ? null : _openQRScanner,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF007AFF),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: _isProcessing
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text(
                        'Scan QR Code',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
              ),
              const SizedBox(height: 32),
              if (_scannedQRData != null) ...[
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.grey[300]!),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Last Scanned QR:',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _scannedQRData!,
                        style: const TextStyle(
                          fontSize: 12,
                          fontFamily: 'monospace',
                        ),
                      ),
                      if (_lastQRResult != null) ...[
                        const SizedBox(height: 12),
                        Text(
                          _lastQRResult!,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: _lastQRResult!.contains('successfully')
                                ? Colors.green
                                : Colors.red,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
