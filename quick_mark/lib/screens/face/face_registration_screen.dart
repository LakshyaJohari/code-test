import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'dart:io';
import '../../services/face/face_recognition_service.dart';
import '../../services/auth_service.dart';

class FaceRegistrationScreen extends StatefulWidget {
  const FaceRegistrationScreen({super.key});

  @override
  State<FaceRegistrationScreen> createState() => _FaceRegistrationScreenState();
}

class _FaceRegistrationScreenState extends State<FaceRegistrationScreen> {
  CameraController? _cameraController;
  bool _isCameraInitialized = false;
  bool _isProcessing = false;
  final List<String> _capturedImages = [];
  final int _requiredImages = 3;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    try {
      final cameras = await availableCameras();
      if (cameras.isNotEmpty) {
        // Use front camera if available
        final frontCamera = cameras.firstWhere(
          (camera) => camera.lensDirection == CameraLensDirection.front,
          orElse: () => cameras.first,
        );

        _cameraController = CameraController(
          frontCamera,
          ResolutionPreset.medium,
        );

        await _cameraController!.initialize();
        setState(() {
          _isCameraInitialized = true;
        });
      }
    } catch (e) {
      print('Error initializing camera: $e');
      _showErrorDialog('Camera Error', 'Failed to initialize camera: $e');
    }
  }

  Future<void> _captureImage() async {
    if (_cameraController == null || !_isCameraInitialized || _isProcessing) {
      return;
    }

    setState(() {
      _isProcessing = true;
    });

    try {
      final image = await _cameraController!.takePicture();

      // Verify that face is detected in the image
      final faces = await FaceRecognitionService.detectFaces(image.path);

      if (faces.isEmpty) {
        _showErrorDialog(
          'No Face Detected',
          'Please ensure your face is clearly visible in the camera.',
        );
        await File(image.path).delete(); // Clean up
      } else if (faces.length > 1) {
        _showErrorDialog(
          'Multiple Faces Detected',
          'Please ensure only one face is visible in the camera.',
        );
        await File(image.path).delete(); // Clean up
      } else {
        setState(() {
          _capturedImages.add(image.path);
        });

        if (_capturedImages.length >= _requiredImages) {
          await _registerFace();
        } else {
          if (!mounted) return;
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Image ${_capturedImages.length}/$_requiredImages captured. Take ${_requiredImages - _capturedImages.length} more.',
              ),
              backgroundColor: Colors.green,
            ),
          );
        }
      }
    } catch (e) {
      _showErrorDialog('Capture Error', 'Failed to capture image: $e');
    } finally {
      setState(() {
        _isProcessing = false;
      });
    }
  }

  Future<void> _registerFace() async {
    setState(() {
      _isProcessing = true;
    });

    try {
      final student = await AuthService.getStudent();
      if (student == null) {
        _showErrorDialog('Error', 'Student information not found.');
        return;
      }

      // Register face using the new method
      final success = await FaceRecognitionService.registerFace(
        student.id,
        _capturedImages,
      );

      if (!success) {
        _showErrorDialog(
          'Registration Failed',
          'Could not register your face. Please try again.',
        );
        return;
      }

      // Clean up captured images
      for (String imagePath in _capturedImages) {
        await File(imagePath).delete();
      }

      _showSuccessDialog(
        'Face Registered!',
        'Your face has been successfully registered for attendance verification.',
      );
    } catch (e) {
      _showErrorDialog('Registration Error', 'Failed to register face: $e');
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
        title: Text(title),
        content: Text(message),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              Navigator.of(context).pop(); // Go back to previous screen
            },
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }

  void _resetCapture() {
    setState(() {
      _capturedImages.clear();
    });
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Register Face'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Stack(
        children: [
          Column(
            children: [
              // Instructions
              Container(
                padding: const EdgeInsets.all(16),
                color: Colors.blue.shade50,
                child: Column(
                  children: [
                    const Icon(Icons.face, size: 48, color: Colors.blue),
                    const SizedBox(height: 8),
                    Text(
                      'Face Registration (${_capturedImages.length}/$_requiredImages)',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Position your face in the camera and take multiple photos for better accuracy.',
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 14),
                    ),
                  ],
                ),
              ),

              // Camera Preview
              Expanded(
                child: _isCameraInitialized
                    ? CameraPreview(_cameraController!)
                    : const Center(child: CircularProgressIndicator()),
              ),

              // Controls
              Container(
                padding: const EdgeInsets.all(20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    if (_capturedImages.isNotEmpty)
                      ElevatedButton(
                        onPressed: _resetCapture,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.grey,
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('Reset'),
                      ),
                    ElevatedButton(
                      onPressed: _captureImage,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 16,
                        ),
                      ),
                      child: const Text(
                        'Capture',
                        style: TextStyle(fontSize: 18),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Processing overlay
          if (_isProcessing)
            Container(
              color: Colors.black54,
              child: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(color: Colors.white),
                    SizedBox(height: 16),
                    Text(
                      'Processing...',
                      style: TextStyle(color: Colors.white, fontSize: 18),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
