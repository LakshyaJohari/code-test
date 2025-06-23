import 'package:flutter/material.dart';
import 'package:introduction_screen/introduction_screen.dart';
import '../../services/onboarding_service.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  void _onDone() async {
    await OnboardingService.setOnboardingCompleted();
    if (mounted) {
      Navigator.of(context).pushReplacementNamed('/register');
    }
  }

  List<PageViewModel> get pages => [
    PageViewModel(
      title: "Welcome to QuickMark",
      body: "QuickMark helps you mark your attendance efficiently.",
      image: const Center(
        child: Icon(
          Icons.check_circle_outline_outlined,
          size: 120,
          color: Colors.blue,
        ),
      ),
    ),
    PageViewModel(
      title: "Dashboard Overview",
      body:
          "Easily view your attendance records and statistics on the dashboard.",
      image: const Center(
        child: Icon(
          Icons.calendar_month_rounded,
          size: 120,
          color: Colors.blue,
        ),
      ),
    ),
    PageViewModel(
      title: "Face Recognition",
      body: "Mark your attendance securely using face recognition technology.",
      image: const Center(
        child: Icon(Icons.face, size: 120, color: Colors.blue),
      ),
    ),
    PageViewModel(
      title: "QR Code Scanning",
      body: "Quickly scan QR codes to mark your attendance in seconds.",
      image: const Center(
        child: Icon(Icons.qr_code, size: 120, color: Colors.blue),
      ),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return IntroductionScreen(
      pages: pages,
      onDone: () => _onDone(),
      dotsDecorator: const DotsDecorator(
        size: Size(10.0, 10.0),
        color: Color(0xFFBDBDBD),
        activeSize: Size(22.0, 10.0),
        activeColor: Colors.blue,
        activeShape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(25.0)),
        ),
      ),
      dotsContainerDecorator: const ShapeDecoration(
        color: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(8.0)),
        ),
      ),
    );
  }
}
