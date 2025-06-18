import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Filter, PlusCircle, Edit, Trash2 } from 'lucide-react';

const StudentsList = () => { // This component is now AdminStudentsPage
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]); // Needed for dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterYear, setFilterYear] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    // useRef for filter menu is typically not needed for a component that will take full page

    const [newStudent, setNewStudent] = useState({ roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '', password: '' });
    const [editingStudent, setEditingStudent] = useState(null);
    const [editStudent, setEditStudent] = useState({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' });

    const getAdminToken = () => localStorage.getItem('adminToken');

    // --- Fetch Data (Students and Departments) ---
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const token = getAdminToken();
            if (!token) {
                setError('Admin not authenticated. Please log in again.');
                setLoading(false);
                return;
            }
            const [studentsRes, departmentsRes] = await Promise.all([
                axios.get('http://localhost:3700/api/admin/students', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:3700/api/admin/departments', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setStudents(studentsRes.data);
            setDepartments(departmentsRes.data);
        } catch (err) {
            console.error('Error fetching student data:', err.response?.data?.message || err.message);
            setError('Failed to load student data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter logic
    const uniqueYears = useMemo(() => [...new Set(students.map(s => s.current_year))], [students]); // Use current_year
    const uniqueDepartments = useMemo(() => [...new Set(departments.map(d => d.name))], [departments]); // Use department name from departments list

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const searchMatch =
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.roll_number.toLowerCase().includes(searchTerm.toLowerCase());

            const yearMatch = filterYear ? student.current_year.toString() === filterYear : true;
            const departmentMatch = filterDepartment ? (departments.find(d => d.department_id === student.department_id)?.name === filterDepartment) : true;

            return searchMatch && yearMatch && departmentMatch;
        });
    }, [students, searchTerm, filterYear, filterDepartment, departments]);

    const clearFilters = () => {
        setFilterYear('');
        setFilterDepartment('');
        setIsFilterOpen(false);
    };

    // --- Student CRUD Handlers ---
    const handleCreateStudent = async (e) => {
        e.preventDefault();
        setError('');
        if (!newStudent.roll_number.trim() || !newStudent.name.trim() || !newStudent.email.trim() || !newStudent.password.trim() || !newStudent.department_id || !newStudent.current_year || !newStudent.section) {
            setError('All student fields are required.');
            return;
        }
        try {
            const token = getAdminToken();
            const payload = {
                roll_number: newStudent.roll_number,
                name: newStudent.name,
                email: newStudent.email,
                password: newStudent.password,
                department_id: newStudent.department_id,
                current_year: parseInt(newStudent.current_year),
                section: newStudent.section,
            };
            await axios.post('http://localhost:3700/api/admin/students', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Student created successfully!');
            setNewStudent({ roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '', password: '' });
            fetchData(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create student.');
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        setError('');
        if (!editStudent.roll_number.trim() || !editStudent.name.trim() || !editStudent.email.trim() || !editStudent.department_id || !editStudent.current_year || !editStudent.section) {
            setError('All student fields are required.');
            return;
        }
        try {
            const token = getAdminToken();
            const payload = {
                roll_number: editStudent.roll_number,
                name: editStudent.name,
                email: editStudent.email,
                department_id: editStudent.department_id,
                current_year: parseInt(editStudent.current_year),
                section: editStudent.section,
            };
            await axios.put(`http://localhost:3700/api/admin/students/${editingStudent.student_id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Student updated successfully!');
            setEditingStudent(null);
            setEditStudent({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' });
            fetchData(); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update student.');
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student? This will also delete their enrollments and attendance records.')) return;
        setError('');
        try {
            const token = getAdminToken();
            await axios.delete(`http://localhost:3700/api/admin/students/${studentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Student deleted successfully!');
            fetchData(); // Refresh list
        } catch (err) {
            if (err.response?.status === 409) {
                setError('Cannot delete student: It still has associated records (e.g., enrollments, attendance).');
            } else {
                setError(err.response?.data?.message || 'Failed to delete student.');
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Students</h1>

            {/* Create Student Form */}
            <form onSubmit={handleCreateStudent} className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <input type="text" placeholder="Roll Number" value={newStudent.roll_number} onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                    <input type="text" placeholder="Full Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                    <input type="email" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                    <input type="password" placeholder="Password" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                    <select value={newStudent.department_id} onChange={(e) => setNewStudent({ ...newStudent, department_id: e.target.value })} className="px-4 py-2 border rounded-lg" required>
                        <option value="">Select Department (Branch)</option>
                        {departments.map((dept) => (
                            <option key={dept.department_id} value={dept.department_id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                    <input type="number" placeholder="Current Year" value={newStudent.current_year} onChange={(e) => setNewStudent({ ...newStudent, current_year: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                    <input type="text" placeholder="Section" value={newStudent.section} onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
                        <PlusCircle size={20} className="mr-2" /> Add Student
                    </button>
                </div>
            </form>

            {/* Students List Table */}
            <div className="p-4 border rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Existing Students</h2>
                {students.length === 0 ? (
                    <p className="text-center text-gray-500">No students found.</p>
                ) : (
                    <table className="min-w-full bg-white border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-2 px-4 text-left">Roll No.</th>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Dept.</th>
                                <th className="py-2 px-4 text-left">Year</th>
                                <th className="py-2 px-4 text-left">Section</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.student_id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2 px-4">{student.roll_number}</td>
                                    <td className="py-2 px-4">{student.name}</td>
                                    <td className="py-2 px-4">{student.email}</td>
                                    <td className="py-2 px-4">
                                        {departments.find(d => d.department_id === student.department_id)?.name || 'N/A'}
                                    </td>
                                    <td className="py-2 px-4">{student.current_year}</td>
                                    <td className="py-2 px-4">{student.section}</td>
                                    <td className="py-2 px-4 flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingStudent(student);
                                                setEditStudent({
                                                    student_id: student.student_id,
                                                    roll_number: student.roll_number,
                                                    name: student.name,
                                                    email: student.email,
                                                    department_id: student.department_id,
                                                    current_year: student.current_year,
                                                    section: student.section,
                                                });
                                            }}
                                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteStudent(student.student_id)}
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

            {/* Edit Student Modal */}
            {editingStudent && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                            <h2 className="text-xl font-semibold mb-4 text-center">Edit Student</h2>
                            <form onSubmit={handleUpdateStudent}>
                                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <label className="block">
                                        <span className="text-gray-700">Roll Number:</span>
                                        <input type="text" value={editStudent.roll_number} onChange={(e) => setEditStudent({ ...editStudent, roll_number: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">Full Name:</span>
                                        <input type="text" value={editStudent.name} onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">Email:</span>
                                        <input type="email" value={editStudent.email} onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">Department (Branch):</span>
                                        <select value={editStudent.department_id} onChange={(e) => setEditStudent({ ...editStudent, department_id: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required>
                                            <option value="">Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept.department_id} value={dept.department_id}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">Current Year:</span>
                                        <input type="number" value={editStudent.current_year} onChange={(e) => setEditStudent({ ...editStudent, current_year: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
                                    </label>
                                    <label className="block">
                                        <span className="text-gray-700">Section:</span>
                                        <input type="text" value={editStudent.section} onChange={(e) => setEditStudent({ ...editStudent, section: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
                                    </label>
                                </div>
                                <div className="flex justify-end space-x-2 mt-4">
                                    <button type="button" onClick={() => { setEditingStudent(null); setNewStudent({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' }); }} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
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

    export default StudentsList;
