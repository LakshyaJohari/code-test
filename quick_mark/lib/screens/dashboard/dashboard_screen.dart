import 'package:flutter/material.dart';
import '../../services/attendance_service.dart';
import '../../services/auth_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  AttendanceStats? _stats;
  List<AttendanceRecord> _recentAttendance = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final stats = await AttendanceService.getAttendanceStats();
      final attendance = await AttendanceService.getAttendanceHistory();

      setState(() {
        _stats = stats;
        _recentAttendance = attendance.take(5).toList(); // Show last 5 records
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading dashboard data: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _refreshData() async {
    await _loadDashboardData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: RefreshIndicator(
        onRefresh: _refreshData,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Welcome Section
                    _buildWelcomeSection(),
                    const SizedBox(height: 24),

                    // Statistics Cards
                    _buildStatsSection(),
                    const SizedBox(height: 24),

                    // Recent Attendance
                    _buildRecentAttendanceSection(),
                    const SizedBox(height: 24),

                    // Quick Actions
                    _buildQuickActionsSection(),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _buildWelcomeSection() {
    return FutureBuilder(
      future: AuthService.getStudent(),
      builder: (context, snapshot) {
        final student = snapshot.data;
        return Card(
          elevation: 4,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 30,
                  backgroundColor: Colors.blue,
                  child: Text(
                    student?.name.substring(0, 1).toUpperCase() ?? 'S',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome back,',
                        style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                      ),
                      Text(
                        student?.name ?? 'Student',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        student?.rollNumber ?? '',
                        style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatsSection() {
    if (_stats == null) {
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Text(
            'No attendance data available',
            style: TextStyle(color: Colors.grey[600]),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Attendance Overview',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                'Attendance Rate',
                '${_stats!.attendancePercentage.toStringAsFixed(1)}%',
                Icons.trending_up,
                _getAttendanceColor(_stats!.attendancePercentage),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildStatCard(
                'Classes Attended',
                '${_stats!.attendedClasses}/${_stats!.totalClasses}',
                Icons.school,
                Colors.blue,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                'Present Days',
                '${_stats!.presentDays}',
                Icons.check_circle,
                Colors.green,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildStatCard(
                'Absent Days',
                '${_stats!.absentDays}',
                Icons.cancel,
                Colors.red,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Card(
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              title,
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Color _getAttendanceColor(double percentage) {
    if (percentage >= 85) return Colors.green;
    if (percentage >= 75) return Colors.orange;
    return Colors.red;
  }

  Widget _buildRecentAttendanceSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Recent Attendance',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            TextButton(
              onPressed: () {
                // TODO: Navigate to full attendance history
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Full history coming soon!')),
                );
              },
              child: const Text('View All'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        if (_recentAttendance.isEmpty)
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'No recent attendance records',
                style: TextStyle(color: Colors.grey[600]),
              ),
            ),
          )
        else
          ..._recentAttendance.map((record) => _buildAttendanceRecord(record)),
      ],
    );
  }

  Widget _buildAttendanceRecord(AttendanceRecord record) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: record.status == 'present'
              ? Colors.green
              : Colors.red,
          child: Icon(
            record.status == 'present' ? Icons.check : Icons.close,
            color: Colors.white,
          ),
        ),
        title: Text(record.location),
        subtitle: Text(
          '${record.timestamp.day}/${record.timestamp.month}/${record.timestamp.year} at ${record.timestamp.hour}:${record.timestamp.minute.toString().padLeft(2, '0')}',
        ),
        trailing: record.faceVerified
            ? const Icon(Icons.face, color: Colors.blue)
            : const Icon(Icons.face_outlined, color: Colors.grey),
      ),
    );
  }

  Widget _buildQuickActionsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quick Actions',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: _buildActionCard(
                'Mark Attendance',
                'Scan QR & verify face',
                Icons.qr_code_scanner,
                Colors.blue,
                () {
                  // Navigate to attendance tab (this would need to be handled by parent)
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Switch to Attendance tab')),
                  );
                },
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildActionCard(
                'Register Face',
                'Update face data',
                Icons.face,
                Colors.orange,
                () {
                  // TODO: Navigate to face registration
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Face registration coming soon!'),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionCard(
    String title,
    String subtitle,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 4,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Icon(icon, size: 32, color: color),
              const SizedBox(height: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              Text(
                subtitle,
                style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
