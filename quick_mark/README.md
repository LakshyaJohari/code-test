# QuickMark - Attendance Management System

A Flutter-based attendance management system for university students that combines QR code scanning with face recognition for secure and accurate attendance marking.

## Features

### 🎯 Core Functionality
- **QR Code Scanning**: Students scan faculty-generated QR codes to initiate attendance
- **Face Recognition**: Biometric verification using MobileFaceNet TensorFlow Lite model
- **Secure Authentication**: JWT-based login/registration system
- **Real-time Verification**: Instant attendance marking with dual verification

### 📱 User Interface
- **Onboarding Flow**: First-time user introduction to app features
- **Three-Tab Navigation**:
  - **Mark Attendance**: QR scanning + face verification
  - **Dashboard**: Attendance statistics and recent records
  - **Profile**: Account management and face registration

### 🔐 Security Features
- Face registration with multiple image capture for accuracy
- JWT token management with automatic expiry handling
- Secure local storage of face embeddings
- QR code time-based validation

## Prerequisites

### Backend Requirements
- Backend server deployed at `https://backend-attendance-flutter-service.onrender.com`
- Endpoints required:
  - `POST /api/student/auth/login`
  - `POST /api/student/auth/register`
  - `POST /api/student/attendance/mark`
  - `GET /api/student/attendance/history/:id`
  - `GET /api/student/attendance/stats/:id`

### Mobile App Requirements
- Flutter SDK 3.8.0+
- Android Studio / Xcode for device testing
- Physical device recommended for camera features

## Installation

### 1. Clone and Setup
```bash
git clone <repository-url>
cd quick_mark
flutter pub get
```

### 2. Backend Configuration
The app is configured to use the production backend:
```
Backend URL: https://backend-attendance-flutter-service.onrender.com
```

Configuration is managed in `lib/config/app_config.dart` with the following endpoints:
- **Login**: `/api/student/auth/login`
- **Register**: `/api/student/auth/register`
- **Mark Attendance**: `/api/student/attendance/mark`
- **Attendance History**: `/api/student/attendance/history`
- **Attendance Stats**: `/api/student/attendance/stats`

### 3. Android Permissions
The app automatically includes required permissions for:
- Camera access
- Internet connectivity
- Local storage

## Usage Workflow

### 1. First Time Setup
1. **Onboarding**: New users see 4-page introduction
2. **Registration**: Students register with academic details
3. **Face Registration**: Capture multiple face images for ML model

### 2. Daily Attendance
1. **QR Scan**: Student scans faculty-generated QR code
2. **Face Verification**: App captures and verifies student's face
3. **Attendance Marked**: Success confirmation with backend sync

### 3. Monitoring
- **Dashboard**: View attendance percentage and recent records
- **Profile**: Manage face data and account settings

## Technical Architecture

### 📁 Project Structure
```
lib/
├── main.dart                      # App entry point
├── models/
│   └── auth_models.dart          # Data models
├── services/
│   ├── auth_service.dart         # Authentication logic
│   ├── attendance_service.dart   # Attendance API calls
│   ├── qr_scanner_service.dart   # QR code processing
│   └── face/
│       └── face_recognition_service.dart  # ML face processing
├── screens/
│   ├── attendance/
│   │   └── attendance_screen.dart    # Main attendance UI
│   ├── dashboard/
│   │   └── dashboard_screen.dart     # Statistics display
│   ├── profile/
│   │   └── profile_screen.dart       # Account management
│   ├── face/
│   │   └── face_registration_screen.dart  # Face setup
│   ├── login_screen.dart         # Authentication
│   ├── register_screen.dart      # User registration
│   └── home_screen_new.dart      # Tab navigation
└── pages/onboarding/             # First-time user flow
```

### 🔧 Key Dependencies
```yaml
dependencies:
  mobile_scanner: ^5.0.0           # QR code scanning
  google_mlkit_face_detection: ^0.10.0  # Face detection
  tflite_flutter: ^0.10.1          # TensorFlow Lite inference
  camera: ^0.10.5                  # Camera access
  http: ^1.2.0                     # API communication
  shared_preferences: ^2.5.3       # Local storage
```

## Face Recognition Details

### Model: MobileFaceNet
- **Input**: 112x112x3 RGB images
- **Output**: 192-dimensional face embeddings
- **Similarity Threshold**: 0.8 (80% confidence)

### Registration Process
1. Capture 3 face images from different angles
2. Generate embeddings for each image
3. Calculate average embedding for robustness
4. Store encrypted embedding locally

### Verification Process
1. Capture single face image during attendance
2. Generate real-time embedding
3. Compare with stored embedding using cosine similarity
4. Accept if similarity > threshold

## API Integration

### Authentication Flow
```javascript
// Login
POST /api/student/auth/login
{
  "roll_number": "IEC2023021",
  "password": "studentpass"
}

// Response
{
  "message": "Logged in successfully!",
  "student": { ... },
  "token": "JWT_TOKEN"
}
```

### Attendance Marking
```javascript
// Mark Attendance
POST /api/student/attendance/mark
{
  "session_id": "session_123",
  "student_id": "student_456",
  "qr_data": "session_123:faculty_789:1640995200:Room_101",
  "face_verified": true,
  "location": "Room_101",
  "timestamp": "2023-12-27T10:30:00Z"
}
```

## QR Code Format

Faculty-generated QR codes should follow this format:
```
session_id:faculty_id:timestamp:location
```

Example: `session_123:faculty_789:1640995200:Room_101`

- **session_id**: Unique class session identifier
- **faculty_id**: Faculty member identifier
- **timestamp**: Unix timestamp (for expiry validation)
- **location**: Classroom/venue identifier

## Deployment Notes

### Backend Configuration
- Production backend is deployed at: `https://backend-attendance-flutter-service.onrender.com`
- All API endpoints are centralized in `lib/config/app_config.dart`
- The app is configured to use the production backend by default

### For Development
- To use local development backend, update `AppConfig.baseUrl` in `lib/config/app_config.dart`
- Use `10.0.2.2:3700` for Android emulator with local backend
- Use `localhost:3700` for iOS simulator with local backend
- Use your machine's IP for physical devices with local backend
- Update base URLs in service files
- Enable HTTPS for secure communication
- Implement proper error handling and retry logic

## Troubleshooting

### Common Issues

1. **Camera not working**
   - Ensure device has camera permissions
   - Test on physical device (not emulator)

2. **Face recognition failing**
   - Ensure good lighting conditions
   - Make sure only one face is visible
   - Re-register face data if needed

3. **QR codes not scanning**
   - Check QR code format matches expected pattern
   - Ensure QR codes haven't expired (5-minute validity)

4. **Backend connection issues**
   - Verify backend is running and accessible
   - Check network connectivity
   - Validate API endpoints and request formats

### Debug Mode
Enable debug prints in services by uncommenting `print()` statements for detailed logging.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For technical support or feature requests, please open an issue in the repository or contact the development team.

---

**QuickMark** - Making attendance management simple, secure, and smart! 🎓
