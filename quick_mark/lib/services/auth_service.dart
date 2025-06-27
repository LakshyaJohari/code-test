import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/auth_models.dart';
import '../config/app_config.dart';

class AuthService {
  // Store and retrieve JWT token
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt_token', token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }

  static Future<void> removeToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
  }

  // Store and retrieve student data
  static Future<void> saveStudent(Student student) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('student_data', jsonEncode(student.toJson()));
  }

  static Future<Student?> getStudent() async {
    final prefs = await SharedPreferences.getInstance();
    final studentData = prefs.getString('student_data');
    if (studentData != null) {
      return Student.fromJson(jsonDecode(studentData));
    }
    return null;
  }

  static Future<void> removeStudent() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('student_data');
  }

  // Check if token is valid
  static Future<bool> isTokenValid() async {
    final token = await getToken();
    if (token == null) return false;

    // Add JWT token expiry validation here if needed
    return true;
  }

  // Login user with credentials
  static Future<AuthResponse?> login(LoginRequest loginRequest) async {
    try {
      final response = await http
          .post(
            Uri.parse(AppConfig.loginEndpoint),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(loginRequest.toJson()),
          )
          .timeout(AppConfig.requestTimeout);

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final authResponse = AuthResponse.fromJson(responseData);

        // Save token and student data
        if (authResponse.token != null) {
          await saveToken(authResponse.token!);
          await saveStudent(authResponse.student);
        }

        return authResponse;
      } else {
        print('Login failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Login error: $e');
      return null;
    }
  }

  // Register new user
  static Future<AuthResponse?> register(RegisterRequest registerRequest) async {
    try {
      final response = await http
          .post(
            Uri.parse(AppConfig.registerEndpoint),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(registerRequest.toJson()),
          )
          .timeout(AppConfig.requestTimeout);

      if (response.statusCode == 201) {
        final responseData = jsonDecode(response.body);
        final authResponse = AuthResponse.fromJson(responseData);

        // Save token and student data
        if (authResponse.token != null) {
          await saveToken(authResponse.token!);
          await saveStudent(authResponse.student);
        }

        return authResponse;
      } else {
        print('Registration failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Registration error: $e');
      return null;
    }
  }

  // Logout user
  static Future<void> logout() async {
    await removeToken();
    await removeStudent();
  }

  // Check if user is authenticated
  static Future<bool> isAuthenticated() async {
    final token = await getToken();
    return token != null && await isTokenValid();
  }
}
