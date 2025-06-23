import 'package:flutter/material.dart';

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
        fontFamily:
            'SF Pro Display', // You can change this to your preferred font
      ),
      home: Placeholder(),
    );
  }
}
