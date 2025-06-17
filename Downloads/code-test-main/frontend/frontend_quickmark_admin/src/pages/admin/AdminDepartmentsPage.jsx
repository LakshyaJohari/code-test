import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Link } from "react-router-dom";

// ...existing code...

<div className="text-center mt-4">
    <Link to="/admin/subjects-list" className="text-blue-500 hover:underline">
        Go to Subjects List
    </Link>
</div>

// ...existing code...

const AdminDepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newDepartmentName, setNewDepartmentName] = useState('');
    const [editingDepartment, setEditingDepartment] = useState(null); // Stores department being edited {id, name}
    const [editDepartmentName, setEditDepartmentName] = useState('');

    // Helper to get Admin Token from localStorage
    const getAdminToken = () => {
        return localStorage.getItem('adminToken'); // Ensure you store token as 'adminToken' on login
    };

    // --- Fetch Departments from Backend ---
    const fetchDepartments = async () => {
        setLoading(true);
        setError('');
        try {
            const token = getAdminToken();
            if (!token) {
                setError('Admin not authenticated. Please log in again.');
                setLoading(false);
                // Optional: Redirect to admin login page if token is missing
                // window.location.href = '/admin-login';
                return;
            }
            const response = await axios.get('http://localhost:3700/api/admin/departments', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDepartments(response.data);
        } catch (err) {
            console.error('Error fetching departments:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to load departments. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments(); // Fetch departments on component mount
    }, []);

    // --- Create Department ---
    const handleCreateDepartment = async (e) => {
        e.preventDefault();
        setError('');
        if (!newDepartmentName.trim()) {
            setError('Department name cannot be empty.');
            return;
        }
        try {
            const token = getAdminToken();
            const response = await axios.post('http://localhost:3700/api/admin/departments', {
                name: newDepartmentName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert(response.data.message); // Simple alert for success
            setNewDepartmentName(''); // Clear input
            fetchDepartments(); // Refresh list
        } catch (err) {
            console.error('Error creating department:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to create department.');
        }
    };

    // --- Update Department ---
    const handleUpdateDepartment = async (e) => {
        e.preventDefault();
        setError('');
        if (!editDepartmentName.trim()) {
            setError('Department name cannot be empty.');
            return;
        }
        try {
            const token = getAdminToken();
            const response = await axios.put(`http://localhost:3700/api/admin/departments/${editingDepartment.department_id}`, {
                name: editDepartmentName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert(response.data.message);
            setEditingDepartment(null);
            setEditDepartmentName('');
            fetchDepartments();
        } catch (err) {
            console.error('Error updating department:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to update department.');
        }
    };

    // --- Delete Department ---
    const handleDeleteDepartment = async (departmentId) => {
        if (!window.confirm('Are you sure you want to delete this department?')) {
            return; // User cancelled
        }
        setError('');
        try {
            const token = getAdminToken();
            const response = await axios.delete(`http://localhost:3700/api/admin/departments/${departmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert(response.data.message);
            fetchDepartments(); // Refresh list
        } catch (err) {
            console.error('Error deleting department:', err.response ? err.response.data : err.message);
            if (err.response?.status === 409) {
                setError('Cannot delete department: It still has associated records (e.g., faculties, students, subjects).');
            } else {
                setError(err.response?.data?.message || 'Failed to delete department.');
            }
        }
    };

    if (loading) return <div className="text-center text-xl mt-10">Loading Departments...</div>;
    if (error) return <div className="text-center text-red-500 text-xl mt-10">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Departments</h1>

            {/* Create Department Form */}
            <form onSubmit={handleCreateDepartment} className="mb-8 p-4 border rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Add New Department</h2>
                <div className="flex items-end space-x-2">
                    <input
                        type="text"
                        placeholder="Department Name (e.g., Physics)"
                        value={newDepartmentName}
                        onChange={(e) => setNewDepartmentName(e.target.value)}
                        className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                    >
                        <PlusCircle size={20} className="mr-2" /> Add
                    </button>
                </div>
            </form>

            {/* Departments List */}
            <div className="p-4 border rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Existing Departments</h2>
                {departments.length === 0 ? (
                    <p className="text-center text-gray-500">No departments found.</p>
                ) : (
                    <table className="min-w-full bg-white border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">ID</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((dept) => (
                                <tr key={dept.department_id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2 px-4">{dept.name}</td>
                                    <td className="py-2 px-4 text-xs text-gray-500">{dept.department_id}</td>
                                    <td className="py-2 px-4 flex space-x-2">
                                        <button
                                            onClick={() => { setEditingDepartment(dept); setEditDepartmentName(dept.name); }}
                                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDepartment(dept.department_id)}
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
            </div>

            {/* Edit Department Modal/Form */}
            {editingDepartment && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                        <h2 className="text-xl font-semibold mb-4">Edit Department</h2>
                        <form onSubmit={handleUpdateDepartment}>
                            <div className="mb-4">
                                <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Department Name
                                </label>
                                <input
                                    type="text"
                                    id="editName"
                                    value={editDepartmentName}
                                    onChange={(e) => setEditDepartmentName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => { setEditingDepartment(null); setEditDepartmentName(''); }}
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
        </div>
    );
};

export default AdminDepartmentsPage;