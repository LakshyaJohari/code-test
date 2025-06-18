import React, { useState, useEffect } from "react";
import { ArrowLeft, Play, Square } from "lucide-react";
import QRCode from "react-qr-code";

const StartQR = ({ subject, onBack, onSubmit }) => {
  const [attendanceWeight, setAttendanceWeight] = useState(null); // Initially null
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    if (!subject) return;

    const updateQR = () => {
      const timestamp = Date.now();
      setQrData(`${subject.id}-${timestamp}`);
    };

    if (isSessionActive) {
      updateQR();
      const interval = setInterval(updateQR, 5000);
      return () => clearInterval(interval);
    }
  }, [subject, isSessionActive]);

  const handleToggle = () => {
    setIsSessionActive(!isSessionActive);
  };

  const handleSubmit = () => {
    if (!attendanceWeight) {
      alert("Please select an attendance weight before submitting.");
      return;
    }
    alert(
      `Attendance submitted for ${subject.name} with weight ${attendanceWeight}`
    );
    onSubmit();
  };

  if (!subject) return <div>Loading subject...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button onClick={onBack} className="mb-4 flex items-center text-blue-600">
        <ArrowLeft className="mr-2" size={18} />
        Back
      </button>

      <h2 className="text-xl font-bold mb-2">{subject.name}</h2>
      <p className="mb-4">
        {isSessionActive
          ? "QR is rotating every 5 seconds."
          : "QR is paused. Set attendance weight and submit."}
      </p>

      <button
        onClick={handleToggle}
        className={`mb-6 px-4 py-2 rounded-lg text-white font-bold ${
          isSessionActive ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {isSessionActive ? (
          <Square size={16} className="inline mr-1" />
        ) : (
          <Play size={16} className="inline mr-1" />
        )}
        {isSessionActive ? "Stop QR" : "Start QR"}
      </button>

      {isSessionActive && (
        <div className="p-3 rounded-lg mb-4 w-50 h-100">
          <QRCode value={qrData} size={350} />
        </div>
      )}

      {!isSessionActive && (
        <>
          <label className="block mb-2 text-sm">
            Attendance Weight: {attendanceWeight ?? "Not Selected"}
          </label>
          <input
            type="range"
            min="1"
            max="4"
            value={attendanceWeight || ""}
            onChange={(e) => setAttendanceWeight(Number(e.target.value))}
            className="w-full mb-6"
          />

          <button
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-lg text-white font-bold ${
              attendanceWeight
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!attendanceWeight}
          >
            Submit Attendance
          </button>
        </>
      )}
    </div>
  );
};

export default StartQR;
