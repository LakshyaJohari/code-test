// src/pages/students/StudentsList.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';

export default function StudentsList({ students, onAdd, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterYear, setFilterYear] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const filterMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterMenuRef]);

  const uniqueYears = useMemo(() => [...new Set(students.map(s => s.year))], [students]);
  const uniqueDepartments = useMemo(() => [...new Set(students.map(s => s.department))], [students]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const searchMatch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const yearMatch = filterYear ? student.year.toString() === filterYear : true;
      const departmentMatch = filterDepartment ? student.department === filterDepartment : true;
      
      return searchMatch && yearMatch && departmentMatch;
    });
  }, [students, searchTerm, filterYear, filterDepartment]);
  
  const clearFilters = () => {
    setFilterYear('');
    setFilterDepartment('');
    setIsFilterOpen(false);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">Student List</h3>
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg></span>
            <input type="text" placeholder="Search by name or roll no..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div className="relative" ref={filterMenuRef}>
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter size={20} className="text-gray-600"/></button>
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl p-4 z-20 border">
                <div className="flex justify-between items-center mb-2"><h4 className="font-semibold">Filter Options</h4><button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">Clear</button></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="w-full p-2 border rounded-md"><option value="">All</option>{uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
              </div>
            )}
          </div>
          <button onClick={onAdd} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm">Add Student</button>
        </div>
      </div>
      
      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Roll No.</th>
              <th className="py-2 px-4">Department</th>
              <th className="py-2 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{student.name}</td>
                <td className="py-3 px-4">{student.rollNo}</td>
                <td className="py-3 px-4">{student.department}</td>
                <td className="py-3 px-4 text-right">
                   <button onClick={() => onEdit(student)} className="text-blue-500 hover:underline font-semibold text-sm mr-4">Edit</button>
                   <button onClick={() => onDelete(student.id)} className="text-red-500 hover:underline font-semibold text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         {filteredStudents.length === 0 && <div className="text-center py-10"><p className="text-gray-500">No students found.</p></div>}
      </div>
    </div>
  )
}
