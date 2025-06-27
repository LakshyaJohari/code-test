import 'dart:convert';
import 'dart:math';

/// Utility class for generating test QR codes in JSON format (matches backend)
class QRTestGenerator {
  static String generateTestQRCode({
    String? sessionId,
    String? subjectId,
    String? facultyId,
    DateTime? timestamp,
  }) {
    final now = timestamp ?? DateTime.now();

    final testSessionId = sessionId ?? 'session-${_generateRandomId()}';
    final testSubjectId = subjectId ?? 'subject-${_generateRandomId()}';
    final testFacultyId = facultyId ?? 'faculty-${_generateRandomId()}';

    final qrPayload = {
      'session_id': testSessionId,
      'subject_id': testSubjectId,
      'faculty_id': testFacultyId,
      'session_date': now.toIso8601String().split('T')[0], // 'YYYY-MM-DD'
      'start_time': now.toIso8601String(), // Full ISO timestamp
    };

    return jsonEncode(qrPayload);
  }

  static String generateExpiredQRCode() {
    // Generate QR code that expired 30 seconds ago (backend allows 10 seconds)
    final expiredTime = DateTime.now().subtract(const Duration(seconds: 30));
    return generateTestQRCode(timestamp: expiredTime);
  }

  static String generateValidQRCode() {
    // Generate QR code that is current (valid for 10 seconds as per backend)
    return generateTestQRCode();
  }

  static String generateLegacyQRCode() {
    // Generate old colon-separated format for backward compatibility testing
    final now = DateTime.now();
    final timestampSeconds = now.millisecondsSinceEpoch ~/ 1000;

    return 'S${_generateRandomId()}:F${_generateRandomId()}:$timestampSeconds:Room${_generateRandomRoom()}';
  }

  static String _generateRandomId() {
    final random = Random();
    return random.nextInt(99999).toString().padLeft(5, '0');
  }

  static int _generateRandomRoom() {
    final random = Random();
    return random.nextInt(999) + 100; // Room numbers 100-999
  }

  /// Generate sample QR codes for different test scenarios
  static Map<String, String> getSampleQRCodes() {
    return {
      'new_format_valid': generateValidQRCode(),
      'new_format_expired': generateExpiredQRCode(),
      'legacy_format': generateLegacyQRCode(),
      'math_class': generateTestQRCode(
        sessionId: 'MATH101-2024-JUNE',
        subjectId: 'MATHEMATICS-101',
        facultyId: 'DR-SMITH',
      ),
      'cs_lab': generateTestQRCode(
        sessionId: 'CS-LAB-SESSION-01',
        subjectId: 'COMPUTER-SCIENCE-LAB',
        facultyId: 'PROF-JOHNSON',
      ),
    };
  }
}

/// Example usage and test scenarios
void main() {
  print('=== QR Code Test Generator (Backend Compatible) ===');
  print('');

  // Generate sample QR codes
  final samples = QRTestGenerator.getSampleQRCodes();

  samples.forEach((name, qrCode) {
    print('$name:');
    print(qrCode);
    print('');
  });

  print('=== Usage Instructions ===');
  print('1. Copy any of the above QR code strings (JSON format)');
  print('2. Use an online QR code generator (e.g., qr-code-generator.com)');
  print('3. Paste the JSON string as the QR code content');
  print('4. Generate and download the QR code image');
  print('5. Use the QR code image to test the app');
  print('');
  print('=== QR Code Formats ===');
  print('- new_format_valid: JSON format, valid for 10 seconds');
  print(
    '- new_format_expired: JSON format, expired (for testing error handling)',
  );
  print('- legacy_format: Old colon-separated format (backward compatibility)');
  print('- math_class/cs_lab: Custom subject examples');
  print('');
  print(
    'Note: The backend validates QR codes for only 10 seconds from generation time.',
  );
  print('Generate a fresh "new_format_valid" QR code for testing.');
}
