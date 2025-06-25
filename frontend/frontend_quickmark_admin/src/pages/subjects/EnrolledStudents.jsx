// src/pages/subjects/EnrolledStudents.jsx
import React, { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import Calendar from "./Calendar.jsx"; // Assuming Calendar.jsx is in the pages folder

export default function EnrolledStudents({ subject, allStudents, onBack }) {
  // --- STATE for the Calendar Modal ---
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const enrolledStudents = useMemo(() => {
    if (!subject) return [];
    return allStudents.filter(
      (student) =>
        student.department === subject.department &&
        student.startYear === subject.startYear
    );
  }, [subject, allStudents]);

  // --- Handlers for the Modal ---
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
    setSelectedStudent(null);
  };

  const AttendanceBar = ({ attendance }) => {
    // Determine bar color based on attendance percentage
    const bgColor = attendance < 75 ? "bg-red-500" : "bg-blue-500";

    return (
      <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
        <div
          className={`${bgColor} h-full`}
          style={{ width: `${attendance}%` }}
        />
      </div>
    );
  };

  if (!subject) {
    return (
      <div className="text-center p-8">
        <p>No subject selected. Please go back and select a subject.</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      {/* --- FLOATING CALENDAR MODAL --- */}
      {/* This section renders the calendar as an overlay when a student is selected */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          {/* We pass the selected student and subject to the Calendar component */}
          <Calendar
            subject={subject}
            student={selectedStudent}
            onBack={handleCloseCalendar} // The 'onBack' prop in Calendar will now close the modal
          />
        </div>
      )}

      {/* --- Main Page Content --- */}
      <div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800">{subject.name}</h2>
          <p className="text-gray-500 mb-6">
            {subject.department} - Start Year: {subject.startYear}
          </p>

          <h3 className="font-bold text-lg mb-4">
            Enrolled Students (Click a student to view their calendar)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3">Name</th>
                  <th className="p-3">Roll No.</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Overall Attendance</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map((student) => (
                  // UPDATED: The entire table row is now clickable and opens the modal
                  <tr
                    key={student.id}
                    className="border-b hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleStudentClick(student)}
                  >
                    <td className="p-3 font-medium">{student.name}</td>
                    <td className="p-3">{student.rollNo}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">
                      <AttendanceBar attendance={student.attendance} />
                      {student.attendance}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {enrolledStudents.length === 0 && (
              <p className="text-center p-6 text-gray-500">
                No students are currently enrolled in this subject.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
