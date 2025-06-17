// src/pages/defaulters/LowAttendance.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Filter, Search, Bell } from 'lucide-react';

export default function LowAttendance({ allStudents }) {
  // We first get the list of defaulters
  const defaulters = useMemo(() => allStudents.filter(s => s.attendance < 75), [allStudents]);
  
  // State for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterMenuRef = useRef(null);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterMenuRef]);

  // Get unique values for filters from the defaulters list
  const uniqueYears = useMemo(() => [...new Set(defaulters.map(s => s.year))], [defaulters]);
  const uniqueDepartments = useMemo(() => [...new Set(defaulters.map(s => s.department))], [defaulters]);

  // Apply search and filters to the defaulters list
  const filteredList = useMemo(() => {
    return defaulters.filter(student => {
      const searchMatch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const yearMatch = filterYear ? student.year.toString() === filterYear : true;
      const departmentMatch = filterDepartment ? student.department === filterDepartment : true;
      
      return searchMatch && yearMatch && departmentMatch;
    });
  }, [defaulters, searchTerm, filterYear, filterDepartment]);

  // Handle selecting/deselecting a single student
  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  // Handle selecting/deselecting all visible students
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudents(filteredList.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSendAlerts = () => {
    if (selectedStudents.length === 0) return;
    // In a real app, you would trigger an API call here.
    console.log("Sending alerts to student IDs:", selectedStudents);
    alert(`Alerts sent to ${selectedStudents.length} student(s).`);
    setSelectedStudents([]); // Clear selection after sending
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      {/* Header section with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">Low Attendance Students</h3>
        <div className="flex items-center space-x-2">
          {/* Common Send Alert Button */}
          <button
            onClick={handleSendAlerts}
            disabled={selectedStudents.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-sm hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Bell size={18} />
            Send Alert to Selected ({selectedStudents.length})
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300">
            Print
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Search size={20} className="text-gray-400" /></span>
          <input
            type="text"
            placeholder="Search by name or roll no..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative" ref={filterMenuRef}>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={18} className="text-gray-600"/>
            <span className="font-medium text-gray-700">Filter</span>
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl p-4 z-20 border">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full p-2 border rounded-md"><option value="">All Years</option>{uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}</select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="w-full p-2 border rounded-md"><option value="">All Departments</option>{uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}</select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Defaulters Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedStudents.length === filteredList.length && filteredList.length > 0}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
              </th>
              <th className="py-2 px-4">Student Name</th>
              <th className="py-2 px-4">Roll no.</th>
              <th className="py-2 px-4">Year</th>
              <th className="py-2 px-4">Department</th>
              <th className="py-2 px-4">Attendance Rate</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((student) => (
              <tr key={student.id} className={`border-b hover:bg-gray-50 ${selectedStudents.includes(student.id) ? 'bg-blue-50' : ''}`}>
                <td className="py-3 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                  />
                </td>
                <td className="py-3 px-4 font-medium">{student.name}</td>
                <td className="py-3 px-4">{student.rollNo}</td>
                <td className="py-3 px-4">{student.year}</td>
                <td className="py-3 px-4">{student.department}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${student.attendance}%` }}></div>
                    </div>
                    <span className="font-semibold">{student.attendance}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredList.length === 0 && <div className="text-center py-10"><p className="text-gray-500">No defaulters found matching your criteria.</p></div>}
      </div>
    </div>
  );
}
