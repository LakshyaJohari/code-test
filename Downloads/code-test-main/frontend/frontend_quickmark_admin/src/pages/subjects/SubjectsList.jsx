// src/pages/subjects/SubjectsList.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Assuming you use Font Awesome icons

export default function SubjectsList() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [departments, setDepartments] = useState([]); // To fetch departments for dropdowns

    // Form states for Create/Edit
    const [formSubjectName, setFormSubjectName] = useState('');
    const [formDepartmentId, setFormDepartmentId] = useState('');
    const [formYear, setFormYear] = useState('');
    const [formSection, setFormSection] = useState('');
    const [formSemester, setFormSemester] = useState(''); // NEW: Semester field

    const getAdminToken = () => localStorage.getItem('adminToken');

    // Fetch subjects from backend
    const fetchSubjects = async () => {
        setLoading(true);
        setError('');
        try {
            const token = getAdminToken();
            if (!token) {
                setError('Admin not authenticated. Please log in again.');
                setLoading(false);
                return;
            }
            const res = await axios.get('http://localhost:3700/api/admin/subjects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(res.data);
        } catch (err) {
            console.error('Error fetching subjects:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to load subjects.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch departments for dropdowns
    const fetchDepartments = async () => {
        try {
            const token = getAdminToken();
            if (!token) return; // Should be handled by main App.jsx redirect if not authenticated
            const res = await axios.get('http://localhost:3700/api/admin/departments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartments(res.data);
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    useEffect(() => {
        fetchSubjects();
        fetchDepartments();
    }, []);

    // Handle Create Subject
    const handleCreateSubject = async (e) => {
        e.preventDefault();
        try {
            const token = getAdminToken();
            await axios.post('http://localhost:3700/api/admin/subjects', {
                subject_name: formSubjectName,
                department_id: formDepartmentId,
                year: parseInt(formYear),
                section: formSection,
                semester: parseInt(formSemester) // NEW: Send semester
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowCreateModal(false);
            resetForm();
            fetchSubjects(); // Refresh the list
        } catch (err) {
            console.error('Error creating subject:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to create subject.');
        }
    };

    // Handle Edit Subject (modal open)
    const handleEditClick = (subject) => {
        setSelectedSubject(subject);
        setFormSubjectName(subject.subject_name);
        setFormDepartmentId(subject.department_id);
        setFormYear(subject.year);
        setFormSection(subject.section);
        setFormSemester(subject.semester); // NEW: Set semester for editing
        setShowEditModal(true);
    };

    // Handle Update Subject (modal submit)
    const handleUpdateSubject = async (e) => {
        e.preventDefault();
        try {
            const token = getAdminToken();
            await axios.put(`http://localhost:3700/api/admin/subjects/${selectedSubject.subject_id}`, {
                subject_name: formSubjectName,
                department_id: formDepartmentId,
                year: parseInt(formYear),
                section: formSection,
                semester: parseInt(formSemester) // NEW: Send semester
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowEditModal(false);
            resetForm();
            fetchSubjects(); // Refresh the list
        } catch (err) {
            console.error('Error updating subject:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to update subject.');
        }
    };

    // Handle Delete Subject
    const handleDeleteSubject = async (subjectId) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            try {
                const token = getAdminToken();
                await axios.delete(`http://localhost:3700/api/admin/subjects/${subjectId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchSubjects(); // Refresh the list
            } catch (err) {
                console.error('Error deleting subject:', err.response ? err.response.data : err.message);
                setError(err.response?.data?.message || 'Failed to delete subject.');
            }
        }
    };

    const resetForm = () => {
        setFormSubjectName('');
        setFormDepartmentId('');
        setFormYear('');
        setFormSection('');
        setFormSemester(''); // NEW: Reset semester
        setSelectedSubject(null);
    };

    if (loading) return <div className="text-center text-xl mt-10">Loading Subjects...</div>;
    if (error) return <div className="text-center text-red-500 text-xl mt-10">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Subjects</h1>

            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <FaPlus className="mr-2" /> Add Subject
                </button>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                {subjects.length === 0 ? (
                    <p className="text-center text-gray-500 p-6">No subjects found.</p>
                ) : (
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 border-b-2 border-gray-200">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject Name</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Section</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Semester</th> {/* NEW HEADER */}
                                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.subject_id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-5 py-5 text-sm">{subject.subject_name}</td>
                                    <td className="px-5 py-5 text-sm">{subject.department_name}</td>
                                    <td className="px-5 py-5 text-sm">{subject.year}</td>
                                    <td className="px-5 py-5 text-sm">{subject.section}</td>
                                    <td className="px-5 py-5 text-sm">{subject.semester || 'N/A'}</td> {/* NEW DATA DISPLAY */}
                                    <td className="px-5 py-5 text-sm text-center">
                                        <button
                                            onClick={() => handleEditClick(subject)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                            title="Edit Subject"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSubject(subject.subject_id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Delete Subject"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create Subject Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
                    <div className="relative p-8 bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Add New Subject</h3>
                        <form onSubmit={handleCreateSubject}>
                            {/* Subject Name */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Subject Name</label>
                                <input
                                    type="text"
                                    value={formSubjectName}
                                    onChange={(e) => setFormSubjectName(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {/* Department */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                                <select
                                    value={formDepartmentId}
                                    onChange={(e) => setFormDepartmentId(e.target.value)}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.department_id} value={dept.department_id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Year */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                                <input
                                    type="number"
                                    value={formYear}
                                    onChange={(e) => setFormYear(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {/* Section */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Section</label>
                                <input
                                    type="text"
                                    value={formSection}
                                    onChange={(e) => setFormSection(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {/* Semester */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Semester</label>
                                <input
                                    type="number" // Input type number for semester
                                    value={formSemester}
                                    onChange={(e) => setFormSemester(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="e.g., 1 or 2"
                                    min="1"
                                    max="2"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowCreateModal(false); resetForm(); }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Add Subject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Subject Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
                    <div className="relative p-8 bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Edit Subject</h3>
                        <form onSubmit={handleUpdateSubject}>
                            {/* Subject Name */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Subject Name</label>
                                <input
                                    type="text"
                                    value={formSubjectName}
                                    onChange={(e) => setFormSubjectName(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {/* Department */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                                <select
                                    value={formDepartmentId}
                                    onChange={(e) => setFormDepartmentId(e.target.value)}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.department_id} value={dept.department_id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Year */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                                <input
                                    type="number"
                                    value={formYear}
                                    onChange={(e) => setFormYear(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {/* Section */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Section</label>
                                <input
                                    type="text"
                                    value={formSection}
                                    onChange={(e) => setFormSection(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            {/* Semester */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Semester</label>
                                <input
                                    type="number" // Input type number for semester
                                    value={formSemester}
                                    onChange={(e) => setFormSemester(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="e.g., 1 or 2"
                                    min="1"
                                    max="2"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); resetForm(); }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Update Subject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
