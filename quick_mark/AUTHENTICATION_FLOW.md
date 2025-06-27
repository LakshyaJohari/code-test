# QuickMark Authentication Flow Documentation

## Overview
This document explains the authentication flow implemented in the QuickMark Flutter app, including token management, navigation logic, and API integration.

## App Flow Logic

### 1. App Initialization (`AppInitializer`)
When the app starts, it follows this logic:

1. **Check Authentication Status**: 
   - Checks if user has a valid JWT token stored locally
   - Validates token (you can extend this with actual JWT validation)
   - If authenticated → Navigate to Home Screen

2. **Check Onboarding Status**:
   - If not authenticated, check if onboarding was completed
   - If onboarding completed → Navigate to Login Screen
   - If first-time user → Navigate to Onboarding Screen

### 2. Onboarding Flow
- Shows 4 introduction pages explaining app features
- After completion, sets onboarding flag and navigates to Register Screen
- Uses `OnboardingService` to manage onboarding state

### 3. Authentication Flow

#### Registration
- User fills registration form with:
  - Name, Roll Number, Email, Password
  - Academic details (Year, Section)
  - Department ID (currently hardcoded)
- Calls API: `POST /api/student/auth/register`
- On success, navigates to Login Screen

#### Login
- User enters Roll Number and Password
- Calls API: `POST /api/student/auth/login`
- On success:
  - Stores JWT token locally
  - Stores student data locally
  - Navigates to Home Screen

### 4. Token Management (`AuthService`)
- **Token Storage**: Uses SharedPreferences to store JWT token
- **Student Data**: Stores complete student profile locally
- **Token Validation**: Currently checks existence, can be extended for expiry validation
- **Logout**: Clears token and student data, redirects to login

## Project Structure

```
lib/
├── main.dart                           # App entry point with routing
├── models/
│   └── auth_models.dart               # Data models for auth
├── services/
│   ├── auth_service.dart              # Authentication & token management
│   └── onboarding_service.dart        # Onboarding state management
├── screens/
│   ├── app_initializer.dart           # App startup logic
│   ├── login_screen.dart              # Login UI and logic
│   ├── register_screen.dart           # Registration UI and logic
│   ├── home_screen_new.dart           # Main app dashboard with tabs
│   ├── attendance/
│   │   └── attendance_screen.dart     # Attendance tracking
│   ├── dashboard/
│   │   └── dashboard_screen.dart      # Analytics dashboard
│   ├── face/
│   │   └── face_registration_screen.dart # Face registration
│   └── profile/
│       └── profile_screen.dart        # User profile
└── pages/
    └── onboarding/
        └── onboarding.dart            # Onboarding flow
```

## API Endpoints

### Login
- **URL**: `POST https://backend-attendance-flutter-service.onrender.com/api/student/auth/login`
- **Request**:
  ```json
  {
    "roll_number": "IEC2023021",
    "password": "studentpass"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Logged in successfully!",
    "student": {
      "id": "...",
      "roll_number": "IEC2023021",
      "name": "Student One",
      "email": "student.one@example.com"
    },
    "token": "JWT_TOKEN"
  }
  ```

### Register
- **URL**: `POST https://backend-attendance-flutter-service.onrender.com/api/student/auth/register`
- **Request**:
  ```json
  {
    "name": "Student Two",
    "roll_number": "IEC2023022",
    "email": "student.two@example.com",
    "password": "studentpass",
    "department_id": "2c994d29-fb5d-4f1e-983f-0cca13a49fd2",
    "current_year": 3,
    "section": "A"
  }
  ```

## Token Expiry Handling

### Current Implementation
- Basic token existence check
- Token stored in SharedPreferences

### Recommended Extensions
1. **JWT Decoding**: Add `dart_jsonwebtoken` package to decode and validate tokens
2. **Expiry Check**: Parse token expiry and auto-logout when expired
3. **Refresh Token**: Implement refresh token mechanism
4. **Automatic Retry**: Retry failed requests with token refresh

### Example Token Validation Extension
```dart
static Future<bool> isTokenValid() async {
  final token = await getToken();
  if (token == null) return false;
  
  try {
    // Decode JWT and check expiry
    final jwt = JWT.verify(token, SecretKey('your-secret'));
    final expiry = jwt.payload['exp'] as int;
    final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
    
    return expiry > now;
  } catch (e) {
    return false;
  }
}
```

## Navigation Routes
- `/onboarding` - Introduction screens
- `/login` - Login form
- `/register` - Registration form  
- `/home` - Main dashboard

## Dependencies Added
```yaml
dependencies:
  shared_preferences: ^2.5.3    # Local storage
  http: ^1.2.0                  # API calls
  introduction_screen: ^3.1.17  # Onboarding UI
```

## Security Considerations
1. **HTTPS**: Ensure API calls use HTTPS in production
2. **Token Storage**: Consider more secure storage options for sensitive data
3. **Validation**: Add client-side and server-side input validation
4. **Error Handling**: Implement proper error handling for network failures

## Testing the Flow
1. **First Run**: Should show onboarding → register
2. **Subsequent Runs**: Should go directly to login
3. **After Login**: Should remember authentication and go to home
4. **After Logout**: Should go back to login

This implementation provides a solid foundation for authentication in your QuickMark app with proper separation of concerns and clean architecture.
