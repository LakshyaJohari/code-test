// src/pages/faculty/FacultyList.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';
import AddEditFacultyModal from './AddEditFacultyModal.jsx';

// It now receives `onDeleteFaculty` as a prop
export default function FacultyList({ faculty, onAddFaculty, onDeleteFaculty }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterDesignation, setFilterDesignation] = useState('');

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

    const uniqueDepartments = useMemo(() => [...new Set(faculty.map(f => f.department))], [faculty]);
    const uniqueDesignations = useMemo(() => [...new Set(faculty.map(f => f.designation))], [faculty]);

    const filteredFaculty = useMemo(() => {
        return faculty.filter(f => {
            const searchMatch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
            const departmentMatch = filterDepartment ? f.department === filterDepartment : true;
            const designationMatch = filterDesignation ? f.designation === filterDesignation : true;
            return searchMatch && departmentMatch && designationMatch;
        });
    }, [faculty, searchTerm, filterDepartment, filterDesignation]);
    
    const handleSave = (newFacultyData) => {
        onAddFaculty(newFacultyData);
        setIsModalOpen(false);
    };

    return (
        <>
            {isModalOpen && <AddEditFacultyModal onClose={() => setIsModalOpen(false)} onSave={handleSave} />}

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800">Faculty</h3>
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3"><svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg></span>
                            <input type="text" placeholder="Search by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="relative" ref={filterMenuRef}>
                            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter size={20} className="text-gray-600"/></button>
                            {isFilterOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl p-4 z-20 border">
                                    <h4 className="font-semibold mb-2">Filter Options</h4>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="w-full p-2 border rounded-md text-sm"><option value="">All</option>{uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}</select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                        <select value={filterDesignation} onChange={e => setFilterDesignation(e.target.value)} className="w-full p-2 border rounded-md text-sm"><option value="">All</option>{uniqueDesignations.map(d => <option key={d} value={d}>{d}</option>)}</select>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm">Add Faculty</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2 px-4">Name</th>
                                <th className="py-2 px-4">Department</th>
                                <th className="py-2 px-4">Designation</th>
                                <th className="py-2 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFaculty.map((f) => (
                                <tr key={f.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 font-medium">{f.name}</td>
                                    <td className="py-3 px-4">{f.department}</td>
                                    <td className="py-3 px-4">{f.designation}</td>
                                    <td className="py-3 px-4 text-right">
                                        {/* NEW: Delete button that calls onDeleteFaculty */}
                                        <button onClick={() => onDeleteFaculty(f.id)} className="text-red-500 hover:underline font-semibold text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredFaculty.length === 0 && <div className="text-center py-10"><p className="text-gray-500">No faculty found.</p></div>}
                </div>
            </div>
        </>
    );
}
