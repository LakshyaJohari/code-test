import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';

class QRScannerPage extends StatelessWidget {
  const QRScannerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan QR Code'),
        backgroundColor: const Color(0xFF007AFF),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Center(
        child: Container(
          height: 300,
          width: 300,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFF007AFF), width: 2),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: MobileScanner(
              onDetect: (result) {
                final qrValue = result.barcodes.first.rawValue;
                if (qrValue != null && qrValue.isNotEmpty) {
                  Navigator.pop(context, qrValue);
                }
              },
            ),
          ),
        ),
      ),
    );
  }
}
