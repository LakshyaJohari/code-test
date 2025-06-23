import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/onboarding_service.dart';

class AppInitializer extends StatefulWidget {
  const AppInitializer({super.key});

  @override
  State<AppInitializer> createState() => _AppInitializerState();
}

class _AppInitializerState extends State<AppInitializer> {
  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    // Check authentication status
    final isAuthenticated = await AuthService.isAuthenticated();

    if (isAuthenticated) {
      // User is logged in, go to home
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
      return;
    }

    // Check if onboarding was completed
    final onboardingCompleted = await OnboardingService.isOnboardingCompleted();

    if (mounted) {
      if (onboardingCompleted) {
        // Onboarding completed, go to login
        Navigator.of(context).pushReplacementNamed('/login');
      } else {
        // First time user, show onboarding
        Navigator.of(context).pushReplacementNamed('/onboarding');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(body: Center(child: CircularProgressIndicator()));
  }
}
