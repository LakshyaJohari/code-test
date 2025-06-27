import 'dart:convert';
import 'package:http/http.dart' as http;
import 'auth_service.dart';
import '../config/app_config.dart';

class AttendanceService {
  // Mark attendance with QR code (matches backend API)
  static Future<AttendanceResponse?> markAttendance({
    required String sessionCode, // Changed from sessionId to sessionCode
    required String qrData,
    required bool faceVerified,
  }) async {
    try {
      final token = await AuthService.getToken();

      if (token == null) {
        return null;
      }

      final response = await http
          .post(
            Uri.parse(AppConfig.markAttendanceEndpoint),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
            body: jsonEncode({
              'session_code': sessionCode, // Backend expects session_code
            }),
          )
          .timeout(AppConfig.requestTimeout);

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        return AttendanceResponse(
          success: true,
          message: responseData['message'] ?? 'Attendance marked successfully',
          attendanceId: responseData['record']?['session_id'],
        );
      } else {
        final errorData = jsonDecode(response.body);
        return AttendanceResponse(
          success: false,
          message: errorData['message'] ?? 'Failed to mark attendance',
        );
      }
    } catch (e) {
      print('Error marking attendance: $e');
      return AttendanceResponse(success: false, message: 'Network error: $e');
    }
  }

  // Get attendance history
  static Future<List<AttendanceRecord>> getAttendanceHistory() async {
    try {
      final token = await AuthService.getToken();
      final student = await AuthService.getStudent();

      if (token == null || student == null) {
        return [];
      }

      final response = await http
          .get(
            Uri.parse('${AppConfig.attendanceHistoryEndpoint}/${student.id}'),
            headers: {'Authorization': 'Bearer $token'},
          )
          .timeout(AppConfig.requestTimeout);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> records = data['attendance_records'] ?? [];

        return records
            .map((record) => AttendanceRecord.fromJson(record))
            .toList();
      } else {
        print('Failed to get attendance history: ${response.body}');
        return [];
      }
    } catch (e) {
      print('Error getting attendance history: $e');
      return [];
    }
  }

  // Get attendance statistics
  static Future<AttendanceStats?> getAttendanceStats() async {
    try {
      final token = await AuthService.getToken();
      final student = await AuthService.getStudent();

      if (token == null || student == null) {
        return null;
      }

      final response = await http
          .get(
            Uri.parse('${AppConfig.attendanceStatsEndpoint}/${student.id}'),
            headers: {'Authorization': 'Bearer $token'},
          )
          .timeout(AppConfig.requestTimeout);

      if (response.statusCode == 200) {
        return AttendanceStats.fromJson(jsonDecode(response.body));
      } else {
        print('Failed to get attendance stats: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error getting attendance stats: $e');
      return null;
    }
  }

  // Get attendance calendar for a specific subject and month
  static Future<Map<String, String>?> getAttendanceCalendar({
    required String subjectId,
    required int month,
    required int year,
  }) async {
    try {
      final token = await AuthService.getToken();

      if (token == null) {
        return null;
      }

      final uri = Uri.parse(AppConfig.attendanceCalendarEndpoint).replace(
        queryParameters: {
          'subject_id': subjectId,
          'month': month.toString(),
          'year': year.toString(),
        },
      );

      final response = await http
          .get(
            uri,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
          )
          .timeout(AppConfig.requestTimeout);

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = jsonDecode(response.body);
        // Convert dynamic values to String
        return responseData.map(
          (key, value) => MapEntry(key, value.toString()),
        );
      } else {
        print('Failed to get attendance calendar: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error getting attendance calendar: $e');
      return null;
    }
  }

  // Get student profile
  static Future<Map<String, dynamic>?> getStudentProfile() async {
    try {
      final token = await AuthService.getToken();

      if (token == null) {
        return null;
      }

      final response = await http
          .get(
            Uri.parse(AppConfig.profileEndpoint),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer $token',
            },
          )
          .timeout(AppConfig.requestTimeout);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Failed to get student profile: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error getting student profile: $e');
      return null;
    }
  }
}

// Attendance models
class AttendanceResponse {
  final String message;
  final bool success;
  final String? attendanceId;

  AttendanceResponse({
    required this.message,
    required this.success,
    this.attendanceId,
  });

  factory AttendanceResponse.fromJson(Map<String, dynamic> json) {
    return AttendanceResponse(
      message: json['message'],
      success: json['success'] ?? false,
      attendanceId: json['attendance_id'],
    );
  }
}

class AttendanceRecord {
  final String id;
  final String sessionId;
  final String studentId;
  final DateTime timestamp;
  final String location;
  final bool faceVerified;
  final String status;

  AttendanceRecord({
    required this.id,
    required this.sessionId,
    required this.studentId,
    required this.timestamp,
    required this.location,
    required this.faceVerified,
    required this.status,
  });

  factory AttendanceRecord.fromJson(Map<String, dynamic> json) {
    return AttendanceRecord(
      id: json['id'],
      sessionId: json['session_id'],
      studentId: json['student_id'],
      timestamp: DateTime.parse(json['timestamp']),
      location: json['location'],
      faceVerified: json['face_verified'] ?? false,
      status: json['status'] ?? 'present',
    );
  }
}

class AttendanceStats {
  final int totalClasses;
  final int attendedClasses;
  final double attendancePercentage;
  final int presentDays;
  final int absentDays;

  AttendanceStats({
    required this.totalClasses,
    required this.attendedClasses,
    required this.attendancePercentage,
    required this.presentDays,
    required this.absentDays,
  });

  factory AttendanceStats.fromJson(Map<String, dynamic> json) {
    return AttendanceStats(
      totalClasses: json['total_classes'] ?? 0,
      attendedClasses: json['attended_classes'] ?? 0,
      attendancePercentage: (json['attendance_percentage'] ?? 0).toDouble(),
      presentDays: json['present_days'] ?? 0,
      absentDays: json['absent_days'] ?? 0,
    );
  }
}
