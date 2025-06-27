// src/pages/subjects/SubjectDetails.jsx
import React from 'react';

export default function SubjectDetails({ subject, students }) {
  if (!subject) return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p>Please select a subject to see details.</p>
      </div>
    );

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
       <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-xl font-semibold">{subject.name}</h3>
        <button className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v3a2 2 0 002 2h6a2 2 0 002-2v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7V9h6v3z" clipRule="evenodd" /></svg>
            <span>Print</span>
        </button>
       </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4 hidden sm:table-cell">Roll No.</th>
              <th className="py-2 px-4 hidden md:table-cell">Email</th>
              <th className="py-2 px-4">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{student.name}</td>
                <td className="py-3 px-4 hidden sm:table-cell">{student.rollNo}</td>
                <td className="py-3 px-4 hidden md:table-cell">{student.email}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${student.attendance}%` }}></div>
                    </div>
                    <span className="text-sm font-semibold">{student.attendance}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
