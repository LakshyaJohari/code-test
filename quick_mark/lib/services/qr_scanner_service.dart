import 'dart:convert';
import 'package:mobile_scanner/mobile_scanner.dart';

class QRScannerService {
  static MobileScannerController? _controller;
  static bool _isInitialized = false;

  // Initialize scanner with optimized configuration
  static MobileScannerController getController() {
    if (_controller == null || !_isInitialized) {
      _controller?.dispose(); // Dispose old controller if exists

      _controller = MobileScannerController(
        detectionSpeed: DetectionSpeed.normal,
        facing: CameraFacing.back,
        torchEnabled: false,
        returnImage: false, // Reduce memory usage and conflicts
        formats: [
          BarcodeFormat.qrCode,
        ], // Only scan QR codes to reduce processing
        detectionTimeoutMs:
            1000, // Reduce detection frequency to prevent conflicts
      );
      _isInitialized = true;
    }
    return _controller!;
  }

  // Properly dispose controller to prevent camera conflicts
  static Future<void> disposeController() async {
    if (_controller != null) {
      try {
        await _controller!.dispose();
      } catch (e) {
        print('Error disposing QR controller: $e');
      }
      _controller = null;
      _isInitialized = false;
    }
  }

  // Stop scanning without disposing
  static Future<void> stopScanning() async {
    if (_controller != null) {
      try {
        await _controller!.stop();
      } catch (e) {
        print('Error stopping QR scanner: $e');
      }
    }
  }

  // Start scanning
  static Future<void> startScanning() async {
    if (_controller != null) {
      try {
        await _controller!.start();
      } catch (e) {
        print('Error starting QR scanner: $e');
      }
    }
  }

  // Parse QR code data (JSON format from backend)
  static Map<String, dynamic>? parseQRData(String qrData) {
    try {
      // Try parsing as JSON first (new format)
      final Map<String, dynamic> data = jsonDecode(qrData);

      // Validate required fields
      if (data.containsKey('session_id') &&
          data.containsKey('subject_id') &&
          data.containsKey('faculty_id') &&
          data.containsKey('session_date') &&
          data.containsKey('start_time')) {
        return {
          'session_id': data['session_id'],
          'subject_id': data['subject_id'],
          'faculty_id': data['faculty_id'],
          'session_date': data['session_date'],
          'start_time': data['start_time'],
          'raw_data': qrData,
        };
      }

      return null;
    } catch (e) {
      // Fallback: try parsing old colon-separated format for backward compatibility
      try {
        final parts = qrData.split(':');
        if (parts.length >= 4) {
          return {
            'session_id': parts[0],
            'faculty_id': parts[1],
            'timestamp': int.tryParse(parts[2]) ?? 0,
            'location': parts[3],
            'raw_data': qrData,
            'legacy_format': true,
          };
        }
      } catch (legacyError) {
        print('Error parsing QR data (both formats): $e, $legacyError');
      }

      return null;
    }
  }

  // Validate QR code (check if it's recent and valid)
  static bool isValidQRCode(Map<String, dynamic> qrData) {
    // Handle legacy format
    if (qrData.containsKey('legacy_format') &&
        qrData['legacy_format'] == true) {
      final timestamp = qrData['timestamp'] as int;
      final currentTime = DateTime.now().millisecondsSinceEpoch ~/ 1000;
      const validityPeriod = 300; // 5 minutes
      return (currentTime - timestamp) <= validityPeriod;
    }

    // Handle new JSON format
    if (qrData.containsKey('start_time')) {
      try {
        final startTime = DateTime.parse(qrData['start_time']);
        final now = DateTime.now();
        final diffSeconds = now.difference(startTime).inSeconds;

        // QR code valid for 10 seconds as per backend logic
        return diffSeconds >= 0 && diffSeconds <= 10;
      } catch (e) {
        print('Error parsing start_time: $e');
        return false;
      }
    }

    return false;
  }

  // Dispose controller
  static Future<void> dispose() async {
    await disposeController();
  }
}
