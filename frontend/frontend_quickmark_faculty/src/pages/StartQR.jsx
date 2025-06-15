import React, { useState } from 'react';
import { QrCode, ArrowLeft, Play, Square } from 'lucide-react';

const StartQR = ({ subject, onBack, onSubmit }) => {
  const [attendanceWeight, setAttendanceWeight] = useState(2);
  const [isSessionActive, setIsSessionActive] = useState(true); // Session starts as active

  const handleSubmit = () => {
    // In a real app, this would submit the attendance data to the backend.
    alert(`Attendance submitted for ${subject.name} with weight ${attendanceWeight}.`);
    onSubmit(); // Use the new onSubmit prop to navigate
  };

  const handleToggleSession = () => {
    setIsSessionActive(!isSessionActive); // Toggle the session state
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      
      {/* Back Button -> Navigates to MarkAttendance page */}
      <div className="w-full flex mb-6">
        <button onClick={onBack} className="flex items-center text-text-secondary hover:text-text-primary">
          <ArrowLeft size={18} className="mr-2" />
          Back to Subject Selection
        </button>
      </div>

      <div className="w-full bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
        {/* Header */}
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          {subject ? subject.name : 'Loading...'}
        </h2>
        <p className="text-text-secondary mb-8">
          {isSessionActive 
            ? "Students can now scan the QR code to mark their attendance."
            : "Session is paused. Press Start to resume."
          }
        </p>

        {/* Start/Stop Toggle Button */}
        <button
          onClick={handleToggleSession}
          className={`w-full max-w-xs text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 mb-8 flex items-center justify-center ${
            isSessionActive 
            ? 'bg-danger hover:bg-danger-light' 
            : 'bg-success hover:bg-green-600'
          }`}
        >
          {isSessionActive ? <Square className="mr-2" size={20}/> : <Play className="mr-2" size={20}/>}
          {isSessionActive ? 'Stop' : 'Start'}
        </button>

        {/* This section is now conditional based on the session state */}
        {isSessionActive && (
            <>
              {/* QR Code Placeholder */}
              <div className="bg-gray-100 p-6 rounded-lg mb-8 shadow-inner animate-pulse">
                <div className="w-64 h-64 bg-white flex items-center justify-center rounded-md">
                  <QrCode size={200} className="text-gray-800" />
                </div>
              </div>

              {/* Attendance Weight Slider */}
              <div className="w-full max-w-xs mb-8">
                <label htmlFor="attendance-weight" className="block text-sm font-medium text-text-secondary mb-2">
                  Attendance Weight ({attendanceWeight})
                </label>
                <input
                  id="attendance-weight"
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={attendanceWeight}
                  onChange={(e) => setAttendanceWeight(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Submit Attendance Button */}
              <button
                onClick={handleSubmit}
                className="w-full max-w-xs bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
              >
                Submit Attendance
              </button>
            </>
        )}
      </div>
    </div>
  );
};

export default StartQR;
