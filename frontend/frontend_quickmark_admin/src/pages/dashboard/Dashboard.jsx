// src/pages/dashboard/Dashboard.jsx
import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

export default function Dashboard({ allStudents, allSubjects }) {
  const [filters, setFilters] = useState({ year: "", department: "", faculty: "" });
  const [currentPage, setCurrentPage] = useState(0);

  const chartData = useMemo(() => {
    if (!allStudents || !allSubjects) return [];
    const defaultersBySubject = allSubjects.map((subject) => {
      const studentsInSubject = allStudents.filter(
        (student) =>
          student.department === subject.department &&
          student.year === subject.year
      );
      const defaulterCount = studentsInSubject.filter(
        (student) => student.attendance < 75
      ).length;
      return { ...subject, defaulters: defaulterCount };
    });

    return defaultersBySubject.filter((subject) => {
      const yearMatch = filters.year ? subject.year.toString() === filters.year : true;
      const departmentMatch = filters.department ? subject.department === filters.department : true;
      const facultyMatch = filters.faculty ? subject.faculty === filters.faculty : true;
      return yearMatch && departmentMatch && facultyMatch;
    });
  }, [allStudents, allSubjects, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = currentPage * ITEMS_PER_PAGE;
    return chartData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [chartData, currentPage]);

  const totalPages = Math.ceil(chartData.length / ITEMS_PER_PAGE);
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(0);
  };
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const uniqueYears = useMemo(() => [...new Set(allSubjects.map((s) => s.year))], [allSubjects]);
  const uniqueDepartments = useMemo(() => [...new Set(allSubjects.map((s) => s.department))], [allSubjects]);
  const uniqueFaculty = useMemo(() => [...new Set(allSubjects.map((s) => s.faculty))], [allSubjects]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Defaulters Analysis by Subject</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <select name="year" value={filters.year} onChange={handleFilterChange} className="p-2 border rounded-md bg-gray-50">
          <option value="">All Years</option>
          {/* FIX: Added a unique key using the value and index */}
          {uniqueYears.map((y, index) => (<option key={`year-${index}`} value={y}>{y}</option>))}
        </select>
        <select name="department" value={filters.department} onChange={handleFilterChange} className="p-2 border rounded-md bg-gray-50">
          <option value="">All Departments</option>
          {/* FIX: Added a unique key using the value and index */}
          {uniqueDepartments.map((d, index) => (<option key={`dept-${index}`} value={d}>{d}</option>))}
        </select>
        <select name="faculty" value={filters.faculty} onChange={handleFilterChange} className="p-2 border rounded-md bg-gray-50">
          <option value="">All Faculty</option>
          {/* FIX: Added a unique key using the value and index */}
          {uniqueFaculty.map((f, index) => (<option key={`faculty-${index}`} value={f}>{f}</option>))}
        </select>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <BarChart data={paginatedData} margin={{ top: 20, right: 30, left: 20, bottom: 75 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type="category" angle={0} textAnchor="middle" interval={0} tick={{ fontSize: 12 }} />
            <YAxis type="number" allowDecimals={false} dataKey="defaulters" />
            <Tooltip />
            <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }}/>
            <Bar dataKey="defaulters" fill="#EF4444" name="Defaulters"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-end items-center mt-4">
        <span className="text-sm text-gray-600 mr-4">Page {currentPage + 1} of {totalPages > 0 ? totalPages : 1}</span>
        <button onClick={goToPrevPage} disabled={currentPage === 0} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={20} /></button>
        <button onClick={goToNextPage} disabled={currentPage >= totalPages - 1} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={20} /></button>
      </div>
    </div>
  );
}
