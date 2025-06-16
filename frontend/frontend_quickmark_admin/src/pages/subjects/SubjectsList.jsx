// src/pages/subjects/SubjectsList.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { List, LayoutGrid, Filter } from 'lucide-react';
import AddEditSubjectModal from './AddEditSubjectModal.jsx';

// CORRECTED: Added `onAddSubject` and `onUpdateSubject` to the props being received.
export default function SubjectsList({ subjects, onViewDetails, onAddSubject, onUpdateSubject }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editingData, setEditingData] = useState({});

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterYear, setFilterYear] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterFaculty, setFilterFaculty] = useState('');

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

  const uniqueYears = useMemo(() => [...new Set(subjects.map(s => s.year))], [subjects]);
  const uniqueDepartments = useMemo(() => [...new Set(subjects.map(s => s.department))], [subjects]);
  const uniqueSubjects = useMemo(() => [...new Set(subjects.map(s => s.name))], [subjects]);
  const uniqueFaculty = useMemo(() => [...new Set(subjects.map(s => s.faculty))], [subjects]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(subject => {
      const searchMatch =
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.faculty.toLowerCase().includes(searchTerm.toLowerCase());
      
      const yearMatch = filterYear ? subject.year.toString() === filterYear : true;
      const departmentMatch = filterDepartment ? subject.department === filterDepartment : true;
      const subjectMatch = filterSubject ? subject.name === filterSubject : true;
      const facultyMatch = filterFaculty ? subject.faculty === filterFaculty : true;

      return searchMatch && yearMatch && departmentMatch && subjectMatch && facultyMatch;
    });
  }, [subjects, searchTerm, filterYear, filterDepartment, filterSubject, filterFaculty]);
  
  const clearFilters = () => {
    setFilterYear(''); setFilterDepartment(''); setFilterSubject(''); setFilterFaculty('');
    setIsFilterOpen(false);
  };

  const handleAddSubject = (newSubjectData) => {
    onAddSubject(newSubjectData); // This now correctly calls the function from App.jsx
    setIsModalOpen(false);
  };
  
  const handleEditClick = (subject) => {
    setEditingSubjectId(subject.id);
    setEditingData({ ...subject });
  };

  const handleCancelEdit = () => {
    setEditingSubjectId(null);
    setEditingData({});
  };

  const handleSaveEdit = () => {
    onUpdateSubject(editingSubjectId, editingData); // This now correctly calls the function from App.jsx
    setEditingSubjectId(null);
    setEditingData({});
  };

  const handleInlineChange = (e) => {
    const { name, value } = e.target;
    setEditingData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {isModalOpen && <AddEditSubjectModal onClose={() => setIsModalOpen(false)} onSave={handleAddSubject} />}

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        {/* Header section with controls on the right */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-gray-800 self-start md:self-center">Subjects</h3>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-grow">
               <span className="absolute inset-y-0 left-0 flex items-center pl-3"><svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg></span>
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="relative" ref={filterMenuRef}>
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter size={20} className="text-gray-600"/></button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl p-4 z-20 border">
                  <div className="flex justify-between items-center mb-2"><h4 className="font-semibold">Filter Options</h4><button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">Clear All</button></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Year</label><select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full p-2 border rounded-md text-sm"><option value="">All</option>{uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="w-full p-2 border rounded-md text-sm"><option value="">All</option>{uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject</label><select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="w-full p-2 border rounded-md text-sm"><option value="">All</option>{uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label><select value={filterFaculty} onChange={e => setFilterFaculty(e.target.value)} className="w-full p-2 border rounded-md text-sm"><option value="">All</option>{uniqueFaculty.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm">Add Subject</button>
          </div>
        </div>

        {/* --- List View with Inline Editing --- */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b"><th className="py-2 px-4">Subject Name</th><th className="py-2 px-4">Year</th><th className="py-2 px-4">Department</th><th className="py-2 px-4">Faculty</th><th></th></tr></thead>
            <tbody>
              {filteredSubjects.map(subject => (
                <tr key={subject.id} className="border-b hover:bg-gray-50 text-sm">
                  {editingSubjectId === subject.id ? (
                    <>
                      <td className="p-1"><select name="name" value={editingData.name} onChange={handleInlineChange} className="p-2 border rounded-md w-full text-sm"><option value={subject.name}>{subject.name}</option>{uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}</select></td>
                      <td className="p-1"><select name="year" value={editingData.year} onChange={handleInlineChange} className="p-2 border rounded-md w-full text-sm"><option value={subject.year}>{subject.year}</option>{uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}</select></td>
                      <td className="p-1"><select name="department" value={editingData.department} onChange={handleInlineChange} className="p-2 border rounded-md w-full text-sm"><option value={subject.department}>{subject.department}</option>{uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}</select></td>
                      <td className="p-1"><select name="faculty" value={editingData.faculty} onChange={handleInlineChange} className="p-2 border rounded-md w-full text-sm"><option value={subject.faculty}>{subject.faculty}</option>{uniqueFaculty.map(f => <option key={f} value={f}>{f}</option>)}</select></td>
                      <td className="flex items-center space-x-2 py-2 p-1">
                        <button onClick={handleSaveEdit} className="text-green-600 font-semibold hover:underline">Save</button>
                        <button onClick={handleCancelEdit} className="text-red-600 font-semibold hover:underline">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-4">{subject.name}</td><td className="py-3 px-4">{subject.year}</td><td className="py-3 px-4">{subject.department}</td><td className="py-3 px-4">{subject.faculty}</td>
                      <td className="px-4"><button onClick={() => handleEditClick(subject)} className="text-blue-500 hover:underline font-semibold">Edit</button></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSubjects.length === 0 && <div className="text-center py-10"><p className="text-gray-500">No subjects found.</p></div>}
      </div>
    </>
  );
}
