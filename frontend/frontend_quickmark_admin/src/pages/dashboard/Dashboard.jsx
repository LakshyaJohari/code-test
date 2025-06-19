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
  const [filters, setFilters] = useState({
    year: "",
    department: "",
    faculty: "",
  });
  const [currentPage, setCurrentPage] = useState(0);

  const chartData = useMemo(() => {
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
      const yearMatch = filters.year
        ? subject.year.toString() === filters.year
        : true;
      const departmentMatch = filters.department
        ? subject.department === filters.department
        : true;
      const facultyMatch = filters.faculty
        ? subject.faculty === filters.faculty
        : true;
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

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0));

  const uniqueYears = useMemo(
    () => [...new Set(allSubjects.map((s) => s.year))],
    [allSubjects]
  );
  const uniqueDepartments = useMemo(
    () => [...new Set(allSubjects.map((s) => s.department))],
    [allSubjects]
  );
  const uniqueFaculty = useMemo(
    () => [...new Set(allSubjects.map((s) => s.faculty))],
    [allSubjects]
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Defaulters Analysis by Subject
      </h2>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <select
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All Years</option>
          {uniqueYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All Departments</option>
          {uniqueDepartments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          name="faculty"
          value={filters.faculty}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All Faculty</option>
          {uniqueFaculty.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={paginatedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tick={{ fontSize: 13, fill: "#374151" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderColor: "#e5e7eb",
                }}
                labelStyle={{ color: "#111827", fontWeight: "500" }}
                itemStyle={{ color: "#1D4ED8" }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="defaulters"
                fill="#1D4ED8"
                radius={[4, 4, 0, 0]}
                name="Defaulters"
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center mt-4">
        <span className="text-sm text-gray-600 mr-4">
          Page {currentPage + 1} of {totalPages > 0 ? totalPages : 1}
        </span>
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className={`px-3 py-1 border text-sm rounded-md mr-2 ${
            currentPage === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100 border-gray-300"
          }`}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1}
          className={`px-3 py-1 border text-sm rounded-md ${
            currentPage >= totalPages - 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100 border-gray-300"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
