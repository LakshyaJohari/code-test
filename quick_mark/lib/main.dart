import 'package:flutter/material.dart';
import 'screens/app_initializer.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';
import 'pages/onboarding/onboarding.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'QuickMark',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        primaryColor: const Color(0xFF007AFF),
        fontFamily: 'SF Pro Display',
      ),
      home: const AppInitializer(),
      routes: {
        '/onboarding': (context) => const OnboardingScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/home': (context) => const HomeScreen(),
      },
    );
  }
}
