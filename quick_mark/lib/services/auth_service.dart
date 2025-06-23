import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/auth_models.dart';

class AuthService {
  static const String baseUrl = 'http://10.0.2.2:3700/api/student/auth';

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

  // Check if token is valid (you might want to add actual token validation)
  static Future<bool> isTokenValid() async {
    final token = await getToken();
    if (token == null) return false;

    // You can add JWT token expiry validation here
    // For now, we'll just check if token exists
    // In a real app, you might want to decode JWT and check expiry
    return true;
  }

  // Login method
  static Future<AuthResponse?> login(LoginRequest loginRequest) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(loginRequest.toJson()),
      );

      if (response.statusCode == 200) {
        final authResponse = AuthResponse.fromJson(jsonDecode(response.body));

        // Save token and student data
        if (authResponse.token != null) {
          await saveToken(authResponse.token!);
          await saveStudent(authResponse.student);
        }

        return authResponse;
      } else {
        // Handle error
        print('Login failed: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Login error: $e');
      return null;
    }
  }

  // Register method
  static Future<AuthResponse?> register(RegisterRequest registerRequest) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(registerRequest.toJson()),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final authResponse = AuthResponse.fromJson(jsonDecode(response.body));

        // Save student data (register might not return token)
        await saveStudent(authResponse.student);

        return authResponse;
      } else {
        // Handle error
        print('Registration failed: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Registration error: $e');
      return null;
    }
  }

  // Logout method
  static Future<void> logout() async {
    await removeToken();
    await removeStudent();
  }

  // Check authentication status
  static Future<bool> isAuthenticated() async {
    final token = await getToken();
    final student = await getStudent();
    return token != null && student != null && await isTokenValid();
  }
}
