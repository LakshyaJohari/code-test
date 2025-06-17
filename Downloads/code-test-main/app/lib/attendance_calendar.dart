import 'package:flutter/material.dart';
import 'package:table_calendar/table_calendar.dart';

class AttendanceCalendarPage extends StatelessWidget {
  const AttendanceCalendarPage({super.key});

  @override
  Widget build(BuildContext context) {
    final attendedDays = {
      DateTime.utc(2024, 6, 9),
      DateTime.utc(2024, 6, 10),
      DateTime.utc(2024, 6, 11),
      DateTime.utc(2024, 6, 13),
      DateTime.utc(2024, 6, 17),
    };
    final missedDays = {
      DateTime.utc(2024, 6, 12),
      DateTime.utc(2024, 6, 14),
    };

    return Scaffold(
      appBar: AppBar(
        title: const Text('June 2024'),
        centerTitle: true,
        leading: const BackButton(),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TableCalendar(
              firstDay: DateTime.utc(2024, 6, 1),
              lastDay: DateTime.utc(2024, 6, 30),
              focusedDay: DateTime.utc(2024, 6, 10),
              calendarStyle: CalendarStyle(
                markerDecoration: BoxDecoration(
                  color: Colors.green,
                  shape: BoxShape.circle,
                ),
              ),
              calendarBuilders: CalendarBuilders(
                defaultBuilder: (context, day, focusedDay) {
                  if (attendedDays.contains(day)) {
                    return Center(
                      child: Container(
                        width: 30,
                        height: 30,
                        decoration: const BoxDecoration(
                          color: Colors.green,
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text('${day.day}',
                              style: const TextStyle(color: Colors.white)),
                        ),
                      ),
                    );
                  } else if (missedDays.contains(day)) {
                    return Center(
                      child: Container(
                        width: 30,
                        height: 30,
                        decoration: const BoxDecoration(
                          color: Colors.red,
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text('${day.day}',
                              style: const TextStyle(color: Colors.white)),
                        ),
                      ),
                    );
                  }
                  return null;
                },
              ),
            ),
            const SizedBox(height: 20),
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircleAvatar(backgroundColor: Colors.green, radius: 6),
                SizedBox(width: 8),
                Text('Class Attended'),
                SizedBox(width: 24),
                CircleAvatar(backgroundColor: Colors.red, radius: 6),
                SizedBox(width: 8),
                Text('Class Missed'),
              ],
            )
          ],
        ),
      ),
    );
  }
}
