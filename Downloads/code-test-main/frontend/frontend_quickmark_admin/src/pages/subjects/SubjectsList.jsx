import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const SubjectsList = () => {
    // Departments state
    const [departments, setDepartments] = useState([]);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [departmentError, setDepartmentError] = useState('');

    // Subjects state
    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [subjectError, setSubjectError] = useState('');
    const [newSubject, setNewSubject] = useState({ subject_name: '', department_id: '', year: '', section: '', batch_name: '' });
    const [editingSubject, setEditingSubject] = useState(null);
    const [editSubject, setEditSubject] = useState({ subject_id: '', subject_name: '', department_id: '', year: '', section: '', batch_name: '' });

    const getAdminToken = () => localStorage.getItem('adminToken');

    // Fetch Departments
    const fetchDepartments = async () => {
        setLoadingDepartments(true);
        setDepartmentError('');
        try {
            const token = getAdminToken();
            const response = await axios.get('http://localhost:3700/api/admin/departments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartments(response.data);
        } catch (err) {
            setDepartmentError('Failed to load departments.');
        } finally {
            setLoadingDepartments(false);
        }
    };

    // Fetch Subjects
    const fetchSubjects = async () => {
        setLoadingSubjects(true);
        setSubjectError('');
        try {
            const token = getAdminToken();
            const response = await axios.get('http://localhost:3700/api/admin/subjects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(response.data);
        } catch (err) {
            setSubjectError('Failed to load subjects.');
        } finally {
            setLoadingSubjects(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchSubjects();
    }, []);

    // Subject CRUD
    const handleCreateSubject = async (e) => {
        e.preventDefault();
        setSubjectError('');
        if (!newSubject.subject_name.trim() || !newSubject.department_id || !newSubject.year || !newSubject.section) {
            setSubjectError('Subject name, department, year, and section are required.');
            return;
        }
        try {
            const token = getAdminToken();
            const payload = {
                subject_name: newSubject.subject_name,
                department_id: newSubject.department_id,
                year: parseInt(newSubject.year),
                section: newSubject.section,
                batch_name: newSubject.batch_name.trim() || null
            };
            await axios.post('http://localhost:3700/api/admin/subjects', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Subject created successfully!');
            setNewSubject({ subject_name: '', department_id: '', year: '', section: '', batch_name: '' });
            fetchSubjects();
        } catch (err) {
            setSubjectError(err.response?.data?.message || 'Failed to create subject.');
        }
    };

    const handleUpdateSubject = async (e) => {
        e.preventDefault();
        setSubjectError('');
        if (!editSubject.subject_name.trim() || !editSubject.department_id || !editSubject.year || !editSubject.section) {
            setSubjectError('Subject name, department, year, and section are required.');
            return;
        }
        try {
            const token = getAdminToken();
            const payload = {
                subject_name: editSubject.subject_name,
                department_id: editSubject.department_id,
                year: parseInt(editSubject.year),
                section: editSubject.section,
                batch_name: editSubject.batch_name.trim() || null
            };
            await axios.put(`http://localhost:3700/api/admin/subjects/${editingSubject.subject_id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Subject updated successfully!');
            setEditingSubject(null);
            setEditSubject({ subject_id: '', subject_name: '', department_id: '', year: '', section: '', batch_name: '' });
            fetchSubjects();
        } catch (err) {
            setSubjectError(err.response?.data?.message || 'Failed to update subject.');
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) return;
        setSubjectError('');
        try {
            const token = getAdminToken();
            await axios.delete(`http://localhost:3700/api/admin/subjects/${subjectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Subject deleted successfully!');
            fetchSubjects();
        } catch (err) {
            if (err.response?.status === 409) {
                setSubjectError('Cannot delete subject: It still has associated records (e.g., enrollments, attendance).');
            } else {
                setSubjectError(err.response?.data?.message || 'Failed to delete subject.');
            }
        }
    };

    if (loadingDepartments || loadingSubjects) return <div className="text-center text-xl mt-10">Loading Data...</div>;
    if (departmentError || subjectError) return <div className="text-center text-red-500 text-xl mt-10">Error: {departmentError || subjectError}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Subjects (Courses) & Departments (Branches)</h1>

            {/* Departments Section (Display Only) */}
            <section className="mb-10 p-4 border rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center">Departments (Branches) List</h2>
                <p className="text-gray-600 text-center mb-4">
                    For CRUD operations on Departments, please use the dedicated "Manage Departments" page.
                </p>
                {departments.length === 0 ? (
                    <p className="text-center text-gray-500">No departments found.</p>
                ) : (
                    <table className="min-w-full bg-white border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((dept) => (
                                <tr key={dept.department_id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2 px-4">{dept.name}</td>
                                    <td className="py-2 px-4 text-xs text-gray-500">{dept.department_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {/* Subjects Section (with CRUD) */}
            <section className="p-4 border rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4 text-center">Subjects (Courses) List</h2>

                {/* Create Subject Form */}
                <form onSubmit={handleCreateSubject} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-xl font-semibold mb-3">Add New Subject (Course)</h3>
                    {subjectError && <div className="text-red-500 text-sm mb-2">{subjectError}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Subject Name (e.g., Quantum Physics)"
                            value={newSubject.subject_name}
                            onChange={(e) => setNewSubject({ ...newSubject, subject_name: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                        />
                        <select
                            value={newSubject.department_id}
                            onChange={(e) => setNewSubject({ ...newSubject, department_id: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                        >
                            <option value="">Select Department (Branch)</option>
                            {departments.map((dept) => (
                                <option key={dept.department_id} value={dept.department_id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Year (e.g., 2)"
                            value={newSubject.year}
                            onChange={(e) => setNewSubject({ ...newSubject, year: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Section (e.g., C)"
                            value={newSubject.section}
                            onChange={(e) => setNewSubject({ ...newSubject, section: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Batch Name (Optional, e.g., 2nd Year C)"
                            value={newSubject.batch_name}
                            onChange={(e) => setNewSubject({ ...newSubject, batch_name: e.target.value })}
                            className="px-4 py-2 border rounded-lg col-span-1 md:col-span-2 lg:col-span-1"
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1"
                        >
                            <PlusCircle size={20} className="mr-2" /> Add Subject
                        </button>
                    </div>
                </form>

                {/* Subjects List Table */}
                {subjects.length === 0 ? (
                    <p className="text-center text-gray-500">No subjects found.</p>
                ) : (
                    <table className="min-w-full bg-white border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Dept.</th>
                                <th className="py-2 px-4 text-left">Year</th>
                                <th className="py-2 px-4 text-left">Section</th>
                                <th className="py-2 px-4 text-left">Batch</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subj) => (
                                <tr key={subj.subject_id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2 px-4">{subj.subject_name}</td>
                                    <td className="py-2 px-4">{departments.find(d => d.department_id === subj.department_id)?.name || 'N/A'}</td>
                                    <td className="py-2 px-4">{subj.year}</td>
                                    <td className="py-2 px-4">{subj.section}</td>
                                    <td className="py-2 px-4">{subj.batch_name || 'N/A'}</td>
                                    <td className="py-2 px-4 flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingSubject(subj);
                                                setEditSubject({
                                                    subject_id: subj.subject_id,
                                                    subject_name: subj.subject_name,
                                                    department_id: subj.department_id,
                                                    year: subj.year,
                                                    section: subj.section,
                                                    batch_name: subj.batch_name
                                                });
                                            }}
                                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSubject(subj.subject_id)}
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* Edit Subject Modal */}
                {editingSubject && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4 text-center">Edit Subject</h2>
                            <form onSubmit={handleUpdateSubject}>
                                {subjectError && <div className="text-red-500 text-sm mb-2">{subjectError}</div>}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                                    <input
                                        type="text"
                                        value={editSubject.subject_name}
                                        onChange={(e) => setEditSubject({ ...editSubject, subject_name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department (Branch)</label>
                                    <select
                                        value={editSubject.department_id}
                                        onChange={(e) => setEditSubject({ ...editSubject, department_id: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept.department_id} value={dept.department_id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                    <input
                                        type="number"
                                        placeholder="Year"
                                        value={editSubject.year}
                                        onChange={(e) => setEditSubject({ ...editSubject, year: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                    <input
                                        type="text"
                                        placeholder="Section"
                                        value={editSubject.section}
                                        onChange={(e) => setEditSubject({ ...editSubject, section: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Batch Name"
                                        value={editSubject.batch_name || ''}
                                        onChange={(e) => setEditSubject({ ...editSubject, batch_name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => { setEditingSubject(null); setEditSubject({ subject_id: '', subject_name: '', department_id: '', year: '', section: '', batch_name: '' }); }}
                                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default SubjectsList;