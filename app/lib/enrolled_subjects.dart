import 'package:flutter/material.dart';
import 'qr_attendance.dart';
import 'profile.dart';
import 'attendance_calendar.dart';

class SubjectsPage extends StatelessWidget {
  const SubjectsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final subjects = [
      {'name': 'Calculus I', 'attendance': 85},
      {'name': 'Linear Algebra', 'attendance': 92},
      {'name': 'Discrete Mathematics', 'attendance': 78},
      {'name': 'Probability Theory', 'attendance': 65},
      {'name': 'Statistics', 'attendance': 72},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Enrolled Subjects'),
        centerTitle: true,
        leading: const BackButton(),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
        body: ListView.builder(
          itemCount: subjects.length,
          itemBuilder: (context, index) {
            final subject = subjects[index];
            final int attendance = subject['attendance'] as int;
            final Color statusColor = attendance >= 75 ? Colors.green : Colors.red;

            return ListTile(
              leading: const Icon(Icons.book_outlined),
              title: Text(subject['name'].toString()),
              subtitle: Text('Attendance: $attendance%'),
              trailing: Icon(Icons.circle, color: statusColor, size: 12),

              // ✅ Navigate on tap
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const AttendanceCalendarPage(),
                  ),
                );
              },
            );
          },
        ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: 1,
        onTap: (int index) {
          if (index == 0) {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const QRAttendancePage()));
          } else if (index == 2) {
            Navigator.push(context, MaterialPageRoute(builder: (_) => const ProfilePage()));
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
}
