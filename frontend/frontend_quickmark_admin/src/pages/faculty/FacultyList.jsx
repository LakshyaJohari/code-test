// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// const FacultyList = () => {
//     const [faculty, setFaculty] = useState([]);
//     const [departments, setDepartments] = useState([]); // Needed for dropdown
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     const [newFaculty, setNewFaculty] = useState({ name: '', email: '', password: '', department_id: '' });
//     const [editingFaculty, setEditingFaculty] = useState(null);
//     const [editFaculty, setEditFaculty] = useState({ faculty_id: '', name: '', email: '', department_id: '' });

//     const getAdminToken = () => localStorage.getItem('adminToken');

//     // --- Fetch Data (Faculty and Departments) ---
//     const fetchData = async () => {
//         setLoading(true);
//         setError('');
//         try {
//             const token = getAdminToken();
//             if (!token) {
//                 setError('Admin not authenticated. Please log in again.');
//                 setLoading(false);
//                 return;
//             }
//             const [facultyRes, departmentsRes] = await Promise.all([
//                 axios.get('http://localhost:3700/api/admin/faculties', { headers: { Authorization: `Bearer ${token}` } }),
//                 axios.get('http://localhost:3700/api/admin/departments', { headers: { Authorization: `Bearer ${token}` } })
//             ]);
//             setFaculty(facultyRes.data);
//             setDepartments(departmentsRes.data);
//         } catch (err) {
//             console.error('Error fetching faculty data:', err.response ? err.response.data : err.message);
//             setError('Failed to load faculty data. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     // --- Faculty CRUD Handlers ---
//     const handleCreateFaculty = async (e) => {
//         e.preventDefault();
//         setError('');
//         if (!newFaculty.name.trim() || !newFaculty.email.trim() || !newFaculty.password.trim() || !newFaculty.department_id) {
//             setError('All faculty fields are required.');
//             return;
//         }
//         try {
//             const token = getAdminToken();
//             const payload = {
//                 name: newFaculty.name,
//                 email: newFaculty.email,
//                 password: newFaculty.password,
//                 department_id: newFaculty.department_id,
//             };
//             await axios.post('http://localhost:3700/api/admin/faculties', payload, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             alert('Faculty created successfully!');
//             setNewFaculty({ name: '', email: '', password: '', department_id: '' });
//             fetchData(); // Refresh list
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to create faculty.');
//         }
//     };

//     const handleUpdateFaculty = async (e) => {
//         e.preventDefault();
//         setError('');
//         if (!editFaculty.name.trim() || !editFaculty.email.trim() || !editFaculty.department_id) {
//             setError('All faculty fields are required.');
//             return;
//         }
//         try {
//             const token = getAdminToken();
//             const payload = {
//                 name: editFaculty.name,
//                 email: editFaculty.email,
//                 department_id: editFaculty.department_id,
//             };
//             await axios.put(`http://localhost:3700/api/admin/faculties/${editingFaculty.faculty_id}`, payload, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             alert('Faculty updated successfully!');
//             setEditingFaculty(null);
//             setEditFaculty({ faculty_id: '', name: '', email: '', department_id: '' });
//             fetchData(); // Refresh list
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to update faculty.');
//         }
//     };

//     const handleDeleteFaculty = async (facultyId) => {
//         if (!window.confirm('Are you sure you want to delete this faculty? This will also delete associated records.')) return;
//         setError('');
//         try {
//             const token = getAdminToken();
//             await axios.delete(`http://localhost:3700/api/admin/faculties/${facultyId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             alert('Faculty deleted successfully!');
//             fetchData(); // Refresh list
//         } catch (err) {
//             if (err.response?.status === 409) {
//                 setError('Cannot delete faculty: It still has associated records (e.g., subjects taught, attendance).');
//             } else {
//                 setError(err.response?.data?.message || 'Failed to delete faculty.');
//             }
//         }
//     };

//     if (loading) return <div className="text-center text-xl mt-10">Loading Faculty...</div>;
//     if (error) return <div className="text-center text-red-500 text-xl mt-10">Error: {error}</div>;

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6 text-center">Manage Faculty</h1>

//             {/* Create Faculty Form */}
//             <form onSubmit={handleCreateFaculty} className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
//                 <h2 className="text-xl font-semibold mb-4">Add New Faculty</h2>
//                 {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                     <input type="text" placeholder="Full Name" value={newFaculty.name} onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <input type="email" placeholder="Email" value={newFaculty.email} onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <input type="password" placeholder="Password (min 6 chars)" value={newFaculty.password} onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <select value={newFaculty.department_id} onChange={(e) => setNewFaculty({ ...newFaculty, department_id: e.target.value })} className="px-4 py-2 border rounded-lg" required>
//                         <option value="">Select Department (Branch)</option>
//                         {departments.map((dept) => (
//                             <option key={dept.department_id} value={dept.department_id}>
//                                 {dept.name}
//                             </option>
//                         ))}
//                     </select>
//                     <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center col-span-2">
//                         <PlusCircle size={20} className="mr-2" /> Add Faculty
//                     </button>
//                 </div>
//             </form>

//             {/* Faculty List Table */}
//             <div className="p-4 border rounded-lg shadow-sm">
//                 <h2 className="text-xl font-semibold mb-4">Existing Faculty</h2>
//                 {faculty.length === 0 ? (
//                     <p className="text-center text-gray-500">No faculty found.</p>
//                 ) : (
//                     <table className="min-w-full bg-white border-collapse">
//                         <thead>
//                             <tr className="bg-gray-100 border-b">
//                                 <th className="py-2 px-4 text-left">Name</th>
//                                 <th className="py-2 px-4 text-left">Email</th>
//                                 <th className="py-2 px-4 text-left">Dept.</th>
//                                 <th className="py-2 px-4 text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {faculty.map((fac) => (
//                                 <tr key={fac.faculty_id} className="border-b last:border-b-0 hover:bg-gray-50">
//                                     <td className="py-2 px-4">{fac.name}</td>
//                                     <td className="py-2 px-4">{fac.email}</td>
//                                     <td className="py-2 px-4">{departments.find(d => d.department_id === fac.department_id)?.name || 'N/A'}</td>
//                                     <td className="py-2 px-4 flex space-x-2">
//                                         <button
//                                             onClick={() => {
//                                                 setEditingFaculty(fac);
//                                                 setEditFaculty({
//                                                     faculty_id: fac.faculty_id,
//                                                     name: fac.name,
//                                                     email: fac.email,
//                                                     department_id: fac.department_id,
//                                                 });
//                                             }}
//                                             className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
//                                             title="Edit"
//                                         >
//                                             <Edit size={18} />
//                                         </button>
//                                         <button
//                                             onClick={() => handleDeleteFaculty(fac.faculty_id)}
//                                             className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
//                                             title="Delete"
//                                         >
//                                             <Trash2 size={18} />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>

//             {/* Edit Faculty Modal */}
//             {editingFaculty && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
//                         <h2 className="text-xl font-semibold mb-4 text-center">Edit Faculty</h2>
//                         <form onSubmit={handleUpdateFaculty}>
//                             {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                 <label className="block">
//                                     <span className="text-gray-700">Full Name:</span>
//                                     <input type="text" value={editFaculty.name} onChange={(e) => setEditFaculty({ ...editFaculty, name: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                                 </label>
//                                 <label className="block">
//                                     <span className="text-gray-700">Email:</span>
//                                     <input type="email" value={editFaculty.email} onChange={(e) => setEditFaculty({ ...editFaculty, email: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                                 </label>
//                                 <label className="block col-span-full">
//                                     <span className="text-gray-700">Department (Branch):</span>
//                                     <select value={editFaculty.department_id} onChange={(e) => setEditFaculty({ ...editFaculty, department_id: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required>
//                                         <option value="">Select Department</option>
//                                         {departments.map((dept) => (
//                                             <option key={dept.department_id} value={dept.department_id}>
//                                                 {dept.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </label>
//                             </div>
//                             <div className="flex justify-end space-x-2 mt-4">
//                                 <button type="button" onClick={() => { setEditingFaculty(null); setEditFaculty({ faculty_id: '', name: '', email: '', department_id: '' }); }} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
//                                     Cancel
//                                 </button>
//                                 <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//                                     Save Changes
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacultyList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'; // Import pagination icons

const FacultyList = () => {
    const [faculty, setFaculty] = useState([]);
    const [departments, setDepartments] = useState([]); // Needed for dropdown
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [newFaculty, setNewFaculty] = useState({ name: '', email: '', password: '', department_id: '' });
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [editFaculty, setEditFaculty] = useState({ faculty_id: '', name: '', email: '', department_id: '' });

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 per page
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const getAdminToken = () => localStorage.getItem('adminToken');

    // --- Fetch Data (Faculty and Departments) ---
    const fetchData = async (page = currentPage, limit = itemsPerPage) => {
        setLoading(true);
        setError('');
        try {
            const token = getAdminToken();
            if (!token) {
                setError('Admin not authenticated. Please log in again.');
                setLoading(false);
                return;
            }
            const [facultyRes, departmentsRes] = await Promise.all([
                axios.get(`http://localhost:3700/api/admin/faculties?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } }), // Pass page/limit
                axios.get('http://localhost:3700/api/admin/departments', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            // FIX HERE: Access the 'faculty' array from the response data
            // setFaculty(facultyRes.data.faculty);
            // setTotalItems(facultyRes.data.totalItems);
            // setTotalPages(facultyRes.data.totalPages);
            // setCurrentPage(facultyRes.data.currentPage);

            setFaculty(facultyRes.data.faculty || []);
            setTotalItems(facultyRes.data.totalItems || 0);
            setTotalPages(facultyRes.data.totalPages || 1);
            setCurrentPage(facultyRes.data.currentPage || 1);

            setDepartments(departmentsRes.data.departments || []);
        } catch (err) {
            console.error('Error fetching faculty data:', err.response ? err.response.data : err.message);
            setError('Failed to load faculty data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage, itemsPerPage); // Fetch data with pagination params
    }, [currentPage, itemsPerPage]); // Refetch when page or itemsPerPage changes

    // --- Faculty CRUD Handlers ---
    const handleCreateFaculty = async (e) => {
        e.preventDefault();
        setError('');
        if (!newFaculty.name.trim() || !newFaculty.email.trim() || !newFaculty.password.trim() || !newFaculty.department_id) {
            setError('All faculty fields are required.');
            return;
        }
        try {
            const token = getAdminToken();
            const payload = {
                name: newFaculty.name,
                email: newFaculty.email,
                password: newFaculty.password,
                department_id: newFaculty.department_id,
            };
            await axios.post('http://localhost:3700/api/admin/faculties', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Faculty created successfully!');
            setNewFaculty({ name: '', email: '', password: '', department_id: '' });
            fetchData(currentPage, itemsPerPage); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create faculty.');
        }
    };

    const handleUpdateFaculty = async (e) => {
        e.preventDefault();
        setError('');
        if (!editFaculty.name.trim() || !editFaculty.email.trim() || !editFaculty.department_id) {
            setError('All faculty fields are required.');
            return;
        }
        try {
            const token = getAdminToken();
            const payload = {
                name: editFaculty.name,
                email: editFaculty.email,
                department_id: editFaculty.department_id,
            };
            await axios.put(`http://localhost:3700/api/admin/faculties/${editingFaculty.faculty_id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Faculty updated successfully!');
            setEditingFaculty(null);
            setEditFaculty({ faculty_id: '', name: '', email: '', department_id: '' });
            fetchData(currentPage, itemsPerPage); // Refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update faculty.');
        }
    };

    const handleDeleteFaculty = async (facultyId) => {
        if (!window.confirm('Are you sure you want to delete this faculty? This will also delete associated records.')) return;
        setError('');
        try {
            const token = getAdminToken();
            await axios.delete(`http://localhost:3700/api/admin/faculties/${facultyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Faculty deleted successfully!');
            if (faculty.length === 1 && currentPage > 1) { // Go to previous page if last item on current page
                setCurrentPage(currentPage - 1);
            } else {
                fetchData(currentPage, itemsPerPage); // Refresh current page
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete faculty.');
        }
    };

    // Pagination Handlers
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // getPageNumbers for pagination buttons
    const getPageNumbers = () => {
        const maxVisibleButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
        let endPage = startPage + maxVisibleButtons - 1;
        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisibleButtons + 1);
        }
        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };


    if (loading) return <div className="text-center text-xl mt-10">Loading Faculty...</div>;
    if (error) return <div className="text-center text-red-500 text-xl mt-10">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Faculty</h1>

            {/* Create Faculty Form */}
            <form onSubmit={handleCreateFaculty} className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">Add New Faculty</h2>
                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Full Name" value={newFaculty.name} onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                    <input type="email" placeholder="Email" value={newFaculty.email} onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                    <input type="password" placeholder="Password (min 6 chars)" value={newFaculty.password} onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                    <select value={newFaculty.department_id} onChange={(e) => setNewFaculty({ ...newFaculty, department_id: e.target.value })} className="px-4 py-2 border rounded-lg" required>
                        <option value="">Select Department (Branch)</option>
                        {departments.map((dept) => (
                            <option key={dept.department_id} value={dept.department_id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center col-span-2">
                        <PlusCircle size={20} className="mr-2" /> Add Faculty
                    </button>
                </div>
            </form>

            {/* Faculty List Table */}
            <div className="p-4 border rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Existing Faculty</h2>
                {faculty.length === 0 ? (
                    <p className="text-center text-gray-500">No faculty found.</p>
                ) : (
                    <table className="min-w-full bg-white border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Dept.</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculty.map((fac) => (
                                <tr key={fac.faculty_id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2 px-4">{fac.name}</td>
                                    <td className="py-2 px-4">{fac.email}</td>
                                    <td className="py-2 px-4">{departments.find(d => d.department_id === fac.department_id)?.name || 'N/A'}</td>
                                    <td className="py-2 px-4 flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingFaculty(fac);
                                                setEditFaculty({
                                                    faculty_id: fac.faculty_id,
                                                    name: fac.name,
                                                    email: fac.email,
                                                    department_id: fac.department_id,
                                                });
                                            }}
                                            className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFaculty(fac.faculty_id)}
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

            {/* Pagination Controls - Simplified and fixed limit to 10 per page */}
            <div className="flex justify-between items-center mt-4 p-2 border-t pt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center"
                >
                    <ChevronLeft size={16} className="mr-2" /> Previous
                </button>
                <div className="flex flex-wrap gap-1">
                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-lg border ${
                                page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages} (Total {totalItems} items)
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center"
                >
                    Next <ChevronRight size={16} className="ml-2" />
                </button>
            </div>
            {/* Edit Faculty Modal */}
            {editingFaculty && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-xl font-semibold mb-4 text-center">Edit Faculty</h2>
                        <form onSubmit={handleUpdateFaculty}>
                            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <label className="block">
                                    <span className="text-gray-700">Full Name:</span>
                                    <input type="text" value={editFaculty.name} onChange={(e) => setEditFaculty({ ...editFaculty, name: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Email:</span>
                                    <input type="email" value={editFaculty.email} onChange={(e) => setEditFaculty({ ...editFaculty, email: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
                                </label>
                                <label className="block col-span-full">
                                    <span className="text-gray-700">Department (Branch):</span>
                                    <select value={editFaculty.department_id} onChange={(e) => setEditFaculty({ ...editFaculty, department_id: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required>
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept.department_id} value={dept.department_id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" onClick={() => { setEditingFaculty(null); setEditFaculty({ faculty_id: '', name: '', email: '', department_id: '' }); }} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
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

export default FacultyList;