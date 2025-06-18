import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Printer,
  Search,
  AlertTriangle,
} from "lucide-react";

const SubjectDetail = ({ subject, students, onBack, onSelectStudent }) => {
  // ✨ 1. State for search term and filter toggle
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowAttendanceOnly, setShowLowAttendanceOnly] = useState(false);

  const getAttendanceBarColor = (percentage) => {
    if (percentage < 75) return "bg-red-500"; // Made the red more vibrant
    return "bg-blue-500";
  };

  // ✨ 2. Derived state for the list that gets displayed
  // useMemo optimizes performance by only recalculating when dependencies change
  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        // Search functionality (checks name and roll no)
        const term = searchTerm.toLowerCase();
        return (
          student.name.toLowerCase().includes(term) ||
          student.rollNo.toLowerCase().includes(term)
        );
      })
      .filter((student) => {
        // Low attendance filter functionality
        return !showLowAttendanceOnly || student.attendance < 75;
      });
  }, [students, searchTerm, showLowAttendanceOnly]);

  if (!subject) {
    return (
      <div className="text-center">
        <p>No subject selected. Please go back and select a subject.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Subjects
          </button>
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold text-gray-800">{subject.name}</h2>
            
          </div>
          <p className="text-gray-500 mt-1">
            Student attendance overview for this subject.
          </p>
        </div>

        <div className="flex items-center space-x-2">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or roll no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          <button
            onClick={() => setShowLowAttendanceOnly(!showLowAttendanceOnly)}
            className={`
                        flex items-center px-4 py-2 rounded-lg font-medium shadow-sm w-full md:w-auto justify-center
                        transition-colors duration-200
                        ${
                          showLowAttendanceOnly
                            ? "bg-red-500 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                        }
                    `}
          >
            <AlertTriangle size={18} className="mr-2" />
            {showLowAttendanceOnly
              ? "Showing Low Attendance"
              : "Filter Low Attendance"}
          </button>

          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 shadow-sm">
            <Printer size={18} className="mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Students List Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance %
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* ✨ 4. Map over the new 'filteredStudents' array */}
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="cursor-pointer hover:bg-gray-50 group"
                    onClick={() => onSelectStudent(student)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {student.rollNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
                          <div
                            className={`${getAttendanceBarColor(
                              student.attendance
                            )} h-2.5 rounded-full`}
                            style={{ width: `${student.attendance}%` }}
                          ></div>
                        </div>
                        <span
                          className={`font-medium text-sm w-12 text-right ${
                            student.attendance < 75
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {student.attendance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <ChevronRight
                        size={20}
                        className="text-gray-400 group-hover:text-blue-600"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                // ✨ 5. Show a message when no students match filters
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No students found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SubjectDetail;
