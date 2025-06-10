// lib/qr_attendance.dart
import 'package:flutter/material.dart';
import 'face_capture.dart';
import 'profile.dart';
import 'enrolled_subjects.dart';

class QRAttendancePage extends StatelessWidget {
  const QRAttendancePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 16),
            const Text(
              'QuickMark',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Image.network(
              'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QuickMark',
              height: 200,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const FaceCapturePage()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF007AFF),
                padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text('Mark Attendance',style: TextStyle(
                color: Colors.white,
              ),),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 0,
        onTap: (int index) {
          if (index == 1) {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const SubjectsPage()));
          } else if (index == 2) {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfilePage()));
          }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.book), label: 'Subjects'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
      ),
    );
  }
}
