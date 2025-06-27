import 'dart:convert';
import 'package:mobile_scanner/mobile_scanner.dart';

class QRScannerService {
  static MobileScannerController? _controller;

  // Initialize scanner
  static MobileScannerController getController() {
    _controller ??= MobileScannerController();
    return _controller!;
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
  static void dispose() {
    _controller?.dispose();
    _controller = null;
  }
}
