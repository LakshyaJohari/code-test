import 'package:flutter/material.dart';
import 'face_registration.dart';
void main() {
  runApp(const MaterialApp(
    home: QuickMarkLogin(),
    debugShowCheckedModeBanner: false,
  ));
}

class QuickMarkLogin extends StatelessWidget {
  const QuickMarkLogin({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Top row with title and help icon
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text(
                    'QuickMark',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Icon(Icons.help_outline),
                ],
              ),
              const SizedBox(height: 32),

              // Login Text
              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Login via Email & Password',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Email field
              const TextField(
                decoration: InputDecoration(
                  hintText: 'Email',
                  filled: true,
                  fillColor: Color(0xFFF1F5F9),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.all(Radius.circular(8)),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Password field
              const TextField(
                obscureText: true,
                decoration: InputDecoration(
                  hintText: 'Password',
                  filled: true,
                  fillColor: Color(0xFFF1F5F9),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.all(Radius.circular(8)),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const FaceRegistration()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF007AFF), // Blue button
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ),
                  child: const Text('Submit',style: TextStyle(
                    color: Colors.white,
                  ),),
                ),
              ),
              const SizedBox(height: 32),

              // Google Login Icon
              Image.network(
                'https://cdn-icons-png.flaticon.com/512/300/300221.png',
                width: 40,
                height: 40,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
