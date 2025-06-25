// src/pages/subjects/SubjectsList.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { List, LayoutGrid, Filter, X } from "lucide-react";
// import AddEditSubjectModal from "./AddEditSubjectModal.jsx";

// The AddEditSubjectModal component remains unchanged
const AddEditSubjectModal = ({ subject, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: subject?.name || "",
    department: subject?.department || "",
    faculty: subject?.faculty || "",
    startYear: subject?.startYear || new Date().getFullYear(),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.department || !formData.faculty) {
      alert("Please fill out all fields.");
      return;
    }
    onSave(formData);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {subject ? "Edit Subject" : "Add New Subject"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Faculty
              </label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// The main component now accepts `initialDepartmentFilter`
export default function SubjectsList({
  subjects,
  allDepartments, // <-- NEW PROP
  allFaculty,
  onViewDetails,
  onAddSubject,
  onUpdateSubject,
  initialDepartmentFilter = "", // Default to empty
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterYear, setFilterYear] = useState("");
  // UPDATED: The department filter is initialized with the value from the prop
  const [filterDepartment, setFilterDepartment] = useState(
    initialDepartmentFilter
  );
  const [filterSubject, setFilterSubject] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("");
  const filterMenuRef = useRef(null);

  // UPDATED: This effect syncs the internal state if the prop changes.
  // This is crucial for when the user navigates from the Departments page.
  useEffect(() => {
    setFilterDepartment(initialDepartmentFilter || "");
  }, [initialDepartmentFilter]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterMenuRef]);

  // ... (the rest of the component logic is unchanged)
  const uniqueYears = useMemo(
    () => [...new Set(subjects.map((s) => s.startYear).sort())],
    [subjects]
  );
  const uniqueDepartments = useMemo(
    () => [...new Set(subjects.map((s) => s.department).sort())],
    [subjects]
  );
  const uniqueSubjects = useMemo(
    () => [...new Set(subjects.map((s) => s.name).sort())],
    [subjects]
  );
  const uniqueFaculty = useMemo(
    () => [...new Set(subjects.map((s) => s.faculty).sort())],
    [subjects]
  );

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const searchMatch =
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.faculty.toLowerCase().includes(searchTerm.toLowerCase());
      const yearMatch = filterYear
        ? subject.startYear.toString() === filterYear
        : true;
      const departmentMatch = filterDepartment
        ? subject.department === filterDepartment
        : true;
      const subjectMatch = filterSubject
        ? subject.name === filterSubject
        : true;
      const facultyMatch = filterFaculty
        ? subject.faculty === filterFaculty
        : true;
      return (
        searchMatch &&
        yearMatch &&
        departmentMatch &&
        subjectMatch &&
        facultyMatch
      );
    });
  }, [
    subjects,
    searchTerm,
    filterYear,
    filterDepartment,
    filterSubject,
    filterFaculty,
  ]);
  const clearFilters = () => {
    setFilterYear("");
    setFilterDepartment("");
    setFilterSubject("");
    setFilterFaculty("");
    setIsFilterOpen(false);
  };
  const handleAddClick = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };
  const handleEditClick = (subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };
  const handleSave = (data) => {
    if (editingSubject) {
      onUpdateSubject(editingSubject.id, data);
    } else {
      onAddSubject(data);
    }
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  return (
    <>
      {isModalOpen && (
        <AddEditSubjectModal
          subject={editingSubject}
          allDepartments={allDepartments}
          allFaculty={allFaculty}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-gray-800">Subjects</h3>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative" ref={filterMenuRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={20} className="text-gray-600" />
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl p-4 z-20 border">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Filter Options</h4>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Year
                      </label>
                      <select
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="">All</option>
                        {uniqueYears.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="">All</option>
                        {uniqueDepartments.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="">All</option>
                        {uniqueSubjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Faculty
                      </label>
                      <select
                        value={filterFaculty}
                        onChange={(e) => setFilterFaculty(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                      >
                        <option value="">All</option>
                        {uniqueFaculty.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleAddClick}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-semibold"
            >
              Add Subject
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-2 px-4">Subject Name</th>
                <th className="py-2 px-4">Department</th>
                <th className="py-2 px-4">Faculty</th>
                <th className="py-2 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr
                  key={subject.id}
                  className="border-b text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => onViewDetails(subject)}
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {subject.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {subject.department}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{subject.faculty}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(subject);
                      }}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSubjects.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No subjects found.</p>
          </div>
        )}
      </div>
    </>
  );
}
