class Student {
  final String id;
  final String rollNumber;
  final String name;
  final String email;
  final String? departmentId;
  final int? currentYear;
  final String? section;

  Student({
    required this.id,
    required this.rollNumber,
    required this.name,
    required this.email,
    this.departmentId,
    this.currentYear,
    this.section,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['id'],
      rollNumber: json['roll_number'],
      name: json['name'],
      email: json['email'],
      departmentId: json['department_id'],
      currentYear: json['current_year'],
      section: json['section'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'roll_number': rollNumber,
      'name': name,
      'email': email,
      'department_id': departmentId,
      'current_year': currentYear,
      'section': section,
    };
  }
}

class AuthResponse {
  final String message;
  final Student student;
  final String? token;

  AuthResponse({required this.message, required this.student, this.token});

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      message: json['message'],
      student: Student.fromJson(json['student']),
      token: json['token'],
    );
  }
}

class LoginRequest {
  final String rollNumber;
  final String password;

  LoginRequest({required this.rollNumber, required this.password});

  Map<String, dynamic> toJson() {
    return {'roll_number': rollNumber, 'password': password};
  }
}

class RegisterRequest {
  final String name;
  final String rollNumber;
  final String email;
  final String password;
  final String departmentId;
  final int currentYear;
  final String section;

  RegisterRequest({
    required this.name,
    required this.rollNumber,
    required this.email,
    required this.password,
    required this.departmentId,
    required this.currentYear,
    required this.section,
  });

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'roll_number': rollNumber,
      'email': email,
      'password': password,
      'department_id': departmentId,
      'current_year': currentYear,
      'section': section,
    };
  }
}
