import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";

const RotatingQR = ({ subjectId }) => {
  const [qrData, setQrData] = useState("");

  const generateQRCode = () => {
    const timestamp = Date.now(); // current time in ms
    const rawData = `${subjectId}||${timestamp}`;

    // Hashing (optional): SHA-256
    // For demo, using raw string. Use crypto if needed.
    setQrData(rawData);

    // Optional: send to backend to log/verify
    fetch("https://your-backend.com/api/save-qr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subjectId, qrData: rawData, timestamp }),
    });
  };

  useEffect(() => {
    generateQRCode(); // generate first
    const interval = setInterval(generateQRCode, 5000); // every 5 seconds

    return () => clearInterval(interval); // cleanup
  }, [subjectId]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Live QR for Attendance</h2>
      <QRCode value={qrData} size={256} />
      <p style={{ marginTop: "20px" }}>QR changes every 5 seconds</p>
    </div>
  );
};

export default RotatingQR;
