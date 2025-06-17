import 'package:flutter/material.dart';
import 'qr_attendance.dart';
import 'enrolled_subjects.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        centerTitle: true,
        leading: const BackButton(),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 50,
              backgroundImage: NetworkImage('https://i.imgur.com/BoN9kdC.png'),
            ),
            const SizedBox(height: 12),
            const Text('Ethan Carter',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const Text('Enrollment No: 2021CS001'),
            const Text('Department: Computer Science'),
            const SizedBox(height: 20),
            buildSectionTitle('Account'),
            buildOption(Icons.edit, 'Edit Profile'),
            buildOption(Icons.settings, 'Settings'),
            buildOption(Icons.notifications, 'Notifications'),
            buildOption(Icons.privacy_tip, 'Privacy'),
            const SizedBox(height: 12),
            buildSectionTitle('Support'),
            buildOption(Icons.help_outline, 'Help & Support'),
            buildOption(Icons.info_outline, 'About'),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 2,
        onTap: (int index) {
          if (index == 1) {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const SubjectsPage()));
          } else if (index == 0) {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const QRAttendancePage()));
          }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.book), label: 'Subjects'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }

  Widget buildOption(IconData icon, String label) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: Colors.blue,
        child: Icon(icon, color: Colors.white),
      ),
      title: Text(label),
      onTap: () {},
    );
  }

  Widget buildSectionTitle(String title) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Text(title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
    );
  }
}
