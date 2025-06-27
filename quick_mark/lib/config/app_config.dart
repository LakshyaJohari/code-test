class AppConfig {
  // Backend Configuration
  static const String baseUrl =
      'https://backend-attendance-flutter-service.onrender.com';
  // API Endpoints
  static const String authBaseUrl = '$baseUrl/api/student/auth';
  static const String studentBaseUrl = '$baseUrl/api/student';

  // Authentication endpoints
  static const String loginEndpoint = '$authBaseUrl/login';
  static const String registerEndpoint = '$authBaseUrl/register';

  // Student endpoints
  static const String profileEndpoint = '$studentBaseUrl/me';
  static const String markAttendanceEndpoint =
      '$studentBaseUrl/attendance/mark';
  static const String attendanceCalendarEndpoint =
      '$studentBaseUrl/attendance/calendar';

  // Legacy endpoints (kept for backward compatibility)
  static const String attendanceHistoryEndpoint =
      '$baseUrl/api/student/attendance/history';
  static const String attendanceStatsEndpoint =
      '$baseUrl/api/student/attendance/stats';

  // App Configuration
  static const String appName = 'QuickMark';
  static const String appVersion = '1.0.0';

  // Request Timeouts
  static const Duration requestTimeout = Duration(seconds: 30);
  static const Duration connectTimeout = Duration(seconds: 10);

  // Face Recognition Configuration
  static const double faceRecognitionThreshold = 0.7;
  static const int requiredFaceImages = 3;

  // QR Code Configuration
  static const Duration qrCodeValidityDuration = Duration(minutes: 5);

  // Network Configuration
  static const Map<String, String> defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Network retry configuration
  static const int maxRetries = 3;
  static const Duration retryDelay = Duration(seconds: 2);

  // Debug mode
  static const bool isDebugMode = true; // Set to false for production

  // API Status endpoints
  static const String healthCheckEndpoint = '$baseUrl/health';
  static const String versionEndpoint = '$baseUrl/version';
}
