import 'package:flutter/material.dart';
import 'qr_attendance.dart';

class FaceRegistration extends StatelessWidget {
  const FaceRegistration({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        leading: BackButton(color: Colors.black),
        title: const Text(
          'Face Registration',
          style: TextStyle(color: Colors.black),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          children: [
            const SizedBox(height: 20),

            // Face illustration container
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: const Color(0xFFF5E4D5),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  // You can replace this with an actual image
                  SizedBox(
                    height: 160,
                    child: Image.network(
                      'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Position your face within the frame',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Ensure your face is fully visible and well-lit\nfor accurate registration.',
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.white,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Icon Buttons Row
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _roundedIconButton(Icons.image),
                const SizedBox(width: 20),
                _roundedIconButton(Icons.camera_alt, isPrimary: true),
                const SizedBox(width: 20),
                _roundedIconButton(Icons.face),
              ],
            ),

            const Spacer(),

            // Register Face Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const QRAttendancePage()),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF007AFF),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('Register Face',
                  style: TextStyle(
                  color: Colors.white,
                ),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _roundedIconButton(IconData icon, {bool isPrimary = false}) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: isPrimary ? Colors.white : const Color(0xFFF1F5F9),
        boxShadow: isPrimary
            ? [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 6,
            offset: Offset(0, 2),
          )
        ]
            : [],
      ),
      child: Icon(icon, size: 24, color: Colors.black),
    );
  }
}
