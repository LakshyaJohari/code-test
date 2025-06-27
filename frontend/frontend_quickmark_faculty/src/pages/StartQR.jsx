import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play, Square } from "lucide-react";
import QRCode from "react-qr-code";

// Props:
// - subject: The subject object with { id, name }
// - onBack: A function to call when the back button is clicked
// - onSubmit: A function to call when the form is submitted
const StartQR = ({ subject, onBack, onSubmit }) => {
  const [attendanceWeight, setAttendanceWeight] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false); // Single state to control the session
  const [qrData, setQrData] = useState("");
  const [timeLeft, setTimeLeft] = useState(5);

  const intervalRef = useRef(null); // useRef to hold the interval ID

  // This single useEffect handles all timer and QR code logic
  useEffect(() => {
    // We only run the timer if the session is active
    if (isSessionActive) {
      // Create an interval that runs every second
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          // When the countdown reaches 1 (just before 0)...
          if (prevTime <= 1) {
            // ...update the QR code data...
            updateQR();
            // ...and reset the timer to 5.
            return 5;
          }
          // Otherwise, just decrement the time.
          return prevTime - 1;
        });
      }, 1000);
    }

    // This is the cleanup function. It runs when isSessionActive becomes false
    // or when the component unmounts. It's crucial to stop the timer.
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isSessionActive]); // This effect depends only on the session's active state

  // Helper function to generate a new QR code value
  const updateQR = () => {
    if (!subject) return;
    const timestamp = Date.now();
    setQrData(`${subject.id}-${timestamp}`);
  };

  // Toggles the session on and off
  const handleToggleSession = () => {
    const newSessionState = !isSessionActive;
    setIsSessionActive(newSessionState);

    // If we are starting a new session...
    if (newSessionState) {
      // ...generate the first QR code immediately...
      updateQR();
      // ...and reset the timer.
      setTimeLeft(5);
    }
  };

  const handleSubmit = () => {
    if (!attendanceWeight) {
      alert("Please select an attendance weight before submitting.");
      return;
    }
    // In a real app, you would likely pass the data to the onSubmit function.
    alert(
      `Attendance submitted for ${subject.name} with weight ${attendanceWeight}`
    );
    onSubmit();
  };

  if (!subject) return <div>Loading subject...</div>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white-200 text-black min-h-screen font-sans">
      <button onClick={onBack} className="mb-4 flex items-center text-Black-800 hover:text-blue-500">
        <ArrowLeft className="mr-2" size={18} />
        Back to Subjects
      </button>

      <div className="bg-white-700 rounded-xl p-6 shadow-2xl  w-full max-w-lg mx-auto">
        <h2 className="text-2xl font-bold mb-2 text-black">{subject.name}</h2>
        <p className="mb-4 text-black-200">
          {isSessionActive
            ? "Session is active. QR code regenerates with the timer."
            : "Session paused. Set weight and submit."}
        </p>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleToggleSession}
            className={`flex items-center justify-center w-40 px-4 py-2 rounded-lg text-white font-bold transition-all transform hover:scale-105 ${
              isSessionActive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSessionActive ? (
              <Square size={16} className="inline mr-2" />
            ) : (
              <Play size={16} className="inline mr-2" />
            )}
            {isSessionActive ? "Stop Session" : "Start Session"}
          </button>
        </div>

        {/* This section is shown when the session is ACTIVE */}
        {isSessionActive && (
          <div className="flex flex-col items-center bg-white p-6 rounded-lg">
             <p className="text-5xl font-mono text-gray-900 mb-4 animate-pulse">
                {timeLeft}
             </p>
            <QRCode value={qrData} size={256} />
          </div>
        )}

        {/* This section is shown when the session is PAUSED */}
        {!isSessionActive && (
          <div className="mt-6">
            <label className="block mb-2 font-bold">
              Attendance Weight: {attendanceWeight ?? "Not Selected"}
            </label>
            <input
              type="range"
              min="1"
              max="4"
              value={attendanceWeight || 1}
              onChange={(e) => setAttendanceWeight(Number(e.target.value))}
              className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-cyan-500 mb-6"
            />

            <button
              onClick={handleSubmit}
              className={`w-full px-6 py-3 rounded-lg text-white font-bold transition-all ${
                attendanceWeight
                  ? "bg-primary hover:bg-cyan-700"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              disabled={!attendanceWeight}
            >
              Submit Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartQR;
