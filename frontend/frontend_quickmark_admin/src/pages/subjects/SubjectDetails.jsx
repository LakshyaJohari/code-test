// src/pages/subjects/SubjectDetails.jsx
import React, { useState, useMemo } from "react";
import { ArrowLeft, Search, ArrowUp, ArrowDown } from "lucide-react";
import Calendar from "./Calendar.jsx"; // Assuming Calendar.jsx is in the same folder

export default function SubjectDetails({ subject, allStudents, onBack }) {
  // --- STATE MANAGEMENT ---
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search bar
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting ('asc' or 'desc')

  // --- DATA PROCESSING (FILTERING AND SORTING) ---
  const enrolledStudents = useMemo(() => {
    if (!subject || !allStudents) return [];

    // 1. Find all students enrolled in the subject
    let students = allStudents.filter(
      (student) =>
        student.department === subject.department &&
        student.startYear === subject.startYear
    );

    // 2. Apply the search term filter
    if (searchTerm) {
      students = students.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 3. Sort the filtered list by Roll Number
    students.sort((a, b) => {
      const rollA = a.rollNo;
      const rollB = b.rollNo;
      if (rollA < rollB) return sortOrder === "asc" ? -1 : 1;
      if (rollA > rollB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return students;
  }, [subject, allStudents, searchTerm, sortOrder]);

  // --- EVENT HANDLERS ---
  const handleStudentClick = (student) => {
    setSelectedStudent(student);
    setIsCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
    setSelectedStudent(null);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };


  if (!subject) {
    return (
      <div className="text-center p-8">
        <p>No subject selected. Please go back.</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <>
      {/* --- FLOATING CALENDAR MODAL --- */}
      {isCalendarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <Calendar
            subject={subject}
            student={selectedStudent}
            onBack={handleCloseCalendar}
          />
        </div>
      )}

      {/* --- Main Page Content --- */}
      <div>
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-6 font-semibold">
          <ArrowLeft size={18} className="mr-2" />
          Back to Subjects List
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{subject.name}</h2>
                <p className="text-gray-500">{subject.department} - Start Year: {subject.startYear}</p>
            </div>
            {/* --- NEW: SEARCH BAR --- */}
            <div className="relative w-full md:w-72">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Search size={20} className="text-gray-400" /></span>
                <input
                    type="text"
                    placeholder="Search by name or roll no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-3">Name</th>
                  {/* --- NEW: SORTABLE ROLL NO. HEADER --- */}
                  <th className="p-3">
                    <button onClick={toggleSortOrder} className="flex items-center gap-2 font-semibold text-gray-600">
                        Roll No.
                        {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    </button>
                  </th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Overall Attendance</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => handleStudentClick(student)}>
                    <td className="p-3 font-medium">{student.name}</td>
                    <td className="p-3">{student.rollNo}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4"><div className={`h-2.5 rounded-full ${student.attendance < 75 ? "bg-red-500" : "bg-blue-500"}`} style={{ width: `${student.attendance}%` }}></div></div>
                        <span className={`font-medium text-sm w-12 text-right ${student.attendance < 75 ? "text-red-600" : "text-gray-600"}`}>{student.attendance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {enrolledStudents.length === 0 && (<p className="text-center p-6 text-gray-500">No students found.</p>)}
          </div>
        </div>
      </div>
    </>
  );
}
