import 'dart:io';
import 'dart:math' as math;
import 'dart:ui';
import 'package:google_mlkit_face_detection/google_mlkit_face_detection.dart';
import 'package:image/image.dart' as img;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class FaceRecognitionService {
  static bool _isInitialized = false;

  // Face detector configuration
  static final FaceDetector _faceDetector = FaceDetector(
    options: FaceDetectorOptions(
      enableContours: false,
      enableClassification: false,
      enableLandmarks: true,
      enableTracking: false,
      minFaceSize: 0.1,
      performanceMode: FaceDetectorMode.accurate,
    ),
  );

  // Initialize service
  static Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      _isInitialized = true;
      print('Face recognition service initialized successfully');
    } catch (e) {
      print('Error initializing face recognition service: $e');
      rethrow;
    }
  }

  // Detect faces in an image
  static Future<List<Face>> detectFaces(String imagePath) async {
    final inputImage = InputImage.fromFilePath(imagePath);
    final faces = await _faceDetector.processImage(inputImage);
    return faces;
  }

  // Extract face from image and generate a simplified face signature
  static Future<List<double>?> generateFaceEmbedding(String imagePath) async {
    if (!_isInitialized) {
      await initialize();
    }

    try {
      // Detect faces
      final faces = await detectFaces(imagePath);
      if (faces.isEmpty) {
        return null;
      }

      // Get the largest face
      Face largestFace = faces.reduce(
        (a, b) =>
            a.boundingBox.width * a.boundingBox.height >
                b.boundingBox.width * b.boundingBox.height
            ? a
            : b,
      );

      // Load and preprocess image
      final imageBytes = await File(imagePath).readAsBytes();
      img.Image? image = img.decodeImage(imageBytes);

      if (image == null) return null;

      // Crop face from image
      final faceImage = _cropFace(image, largestFace.boundingBox);

      // Generate face signature using geometric features
      final embedding = _generateFaceSignature(largestFace, faceImage);

      return embedding;
    } catch (e) {
      print('Error generating face embedding: $e');
      return null;
    }
  }

  // Crop face from image using bounding box
  static img.Image _cropFace(img.Image image, Rect boundingBox) {
    int x = boundingBox.left.toInt().clamp(0, image.width);
    int y = boundingBox.top.toInt().clamp(0, image.height);
    int width = boundingBox.width.toInt().clamp(0, image.width - x);
    int height = boundingBox.height.toInt().clamp(0, image.height - y);

    return img.copyCrop(image, x: x, y: y, width: width, height: height);
  }

  // Generate a simplified face signature using landmarks and geometric features
  static List<double> _generateFaceSignature(Face face, img.Image faceImage) {
    List<double> features = [];

    // Face dimensions
    features.add(face.boundingBox.width);
    features.add(face.boundingBox.height);
    features.add(
      face.boundingBox.width / face.boundingBox.height,
    ); // Aspect ratio

    // Add landmark-based features if available
    if (face.landmarks.isNotEmpty) {
      final leftEye = face.landmarks[FaceLandmarkType.leftEye];
      final rightEye = face.landmarks[FaceLandmarkType.rightEye];
      final nose = face.landmarks[FaceLandmarkType.noseBase];
      final leftMouth = face.landmarks[FaceLandmarkType.leftMouth];
      final rightMouth = face.landmarks[FaceLandmarkType.rightMouth];

      if (leftEye != null && rightEye != null) {
        // Eye distance
        final eyeDistance = math.sqrt(
          math.pow(leftEye.position.x - rightEye.position.x, 2) +
              math.pow(leftEye.position.y - rightEye.position.y, 2),
        );
        features.add(eyeDistance);
      }

      if (nose != null && leftMouth != null && rightMouth != null) {
        // Nose to mouth distance
        final mouthCenterX = (leftMouth.position.x + rightMouth.position.x) / 2;
        final mouthCenterY = (leftMouth.position.y + rightMouth.position.y) / 2;
        final noseToMouthDistance = math.sqrt(
          math.pow(nose.position.x - mouthCenterX, 2) +
              math.pow(nose.position.y - mouthCenterY, 2),
        );
        features.add(noseToMouthDistance);
      }
    }

    // Add color-based features from the face image
    features.addAll(_extractColorFeatures(faceImage));

    // Normalize features
    return _normalizeFeatures(features);
  }

  // Extract color-based features from face image
  static List<double> _extractColorFeatures(img.Image image) {
    List<double> colorFeatures = [];

    // Resize to small size for feature extraction
    final smallImage = img.copyResize(image, width: 8, height: 8);

    double totalR = 0, totalG = 0, totalB = 0;
    int pixelCount = 0;

    for (int y = 0; y < smallImage.height; y++) {
      for (int x = 0; x < smallImage.width; x++) {
        final pixel = smallImage.getPixel(x, y);
        totalR += pixel.r;
        totalG += pixel.g;
        totalB += pixel.b;
        pixelCount++;
      }
    }

    // Average color values
    colorFeatures.add(totalR / pixelCount);
    colorFeatures.add(totalG / pixelCount);
    colorFeatures.add(totalB / pixelCount);

    return colorFeatures;
  }

  // Normalize feature vector
  static List<double> _normalizeFeatures(List<double> features) {
    if (features.isEmpty) return features;

    double sum = 0;
    for (double feature in features) {
      sum += feature * feature;
    }

    double magnitude = math.sqrt(sum);
    if (magnitude == 0) return features;

    return features.map((f) => f / magnitude).toList();
  }

  // Compare two face embeddings
  static double compareFaces(List<double> embedding1, List<double> embedding2) {
    if (embedding1.length != embedding2.length) return 0.0;

    double dotProduct = 0;
    for (int i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
    }

    // Return similarity score (cosine similarity)
    return dotProduct.clamp(0.0, 1.0);
  }

  // Register a face with embeddings
  static Future<bool> registerFace(
    String studentId,
    List<String> imagePaths,
  ) async {
    try {
      List<List<double>> embeddings = [];

      for (String imagePath in imagePaths) {
        final embedding = await generateFaceEmbedding(imagePath);
        if (embedding != null) {
          embeddings.add(embedding);
        }
      }

      if (embeddings.isEmpty) {
        return false;
      }

      // Calculate average embedding
      List<double> avgEmbedding = List.filled(embeddings.first.length, 0.0);
      for (var embedding in embeddings) {
        for (int i = 0; i < embedding.length; i++) {
          avgEmbedding[i] += embedding[i];
        }
      }

      for (int i = 0; i < avgEmbedding.length; i++) {
        avgEmbedding[i] /= embeddings.length;
      }

      // Store embedding
      final prefs = await SharedPreferences.getInstance();
      final embeddingJson = jsonEncode(avgEmbedding);
      await prefs.setString('face_embedding_$studentId', embeddingJson);

      print('Face registered successfully for student: $studentId');
      return true;
    } catch (e) {
      print('Error registering face: $e');
      return false;
    }
  }

  // Recognize a face by comparing with stored embeddings
  static Future<String?> recognizeFace(
    String imagePath, {
    double threshold = 0.7,
  }) async {
    try {
      final targetEmbedding = await generateFaceEmbedding(imagePath);
      if (targetEmbedding == null) return null;

      final prefs = await SharedPreferences.getInstance();
      final keys = prefs.getKeys().where(
        (key) => key.startsWith('face_embedding_'),
      );

      String? bestMatch;
      double bestScore = 0.0;

      for (String key in keys) {
        final embeddingJson = prefs.getString(key);
        if (embeddingJson != null) {
          final storedEmbedding = List<double>.from(jsonDecode(embeddingJson));
          final score = compareFaces(targetEmbedding, storedEmbedding);

          if (score > bestScore && score >= threshold) {
            bestScore = score;
            bestMatch = key.replaceFirst('face_embedding_', '');
          }
        }
      }

      if (bestMatch != null) {
        print(
          'Face recognized: $bestMatch (score: ${bestScore.toStringAsFixed(3)})',
        );
      } else {
        print(
          'No matching face found (best score: ${bestScore.toStringAsFixed(3)})',
        );
      }

      return bestMatch;
    } catch (e) {
      print('Error recognizing face: $e');
      return null;
    }
  }

  // Check if a face is registered for a student
  static Future<bool> isFaceRegistered(String studentId) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey('face_embedding_$studentId');
  }

  // Remove face registration for a student
  static Future<void> removeFaceRegistration(String studentId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('face_embedding_$studentId');
  }

  // Cleanup resources
  static void dispose() async {
    await _faceDetector.close();
    _isInitialized = false;
  }
}
