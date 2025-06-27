// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { Filter, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'; // Import pagination icons

// const StudentsList = () => { // This component is now AdminStudentsPage
//     const [students, setStudents] = useState([]);
//     const [departments, setDepartments] = useState([]); // Needed for dropdown
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     const [searchTerm, setSearchTerm] = useState('');
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [filterYear, setFilterYear] = useState('');
//     const [filterDepartment, setFilterDepartment] = useState('');

//     const [newStudent, setNewStudent] = useState({ roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '', password: '' });
//     const [editingStudent, setEditingStudent] = useState(null);
//     const [editStudent, setEditStudent] = useState({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' });

//     // --- PAGINATION STATE ---
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page
//     const [totalItems, setTotalItems] = useState(0);
//     const [totalPages, setTotalPages] = useState(1);

//     const getAdminToken = () => localStorage.getItem('adminToken');

//     // --- Fetch Data (Students and Departments) ---
//     const fetchData = async (page = currentPage, limit = itemsPerPage) => { // Added page/limit params
//         setLoading(true);
//         setError('');
//         try {
//             const token = getAdminToken();
//             if (!token) {
//                 setError('Admin not authenticated. Please log in again.');
//                 setLoading(false);
//                 return;
//             }
//             const [studentsRes, departmentsRes] = await Promise.all([
//                 axios.get(`http://localhost:3700/api/admin/students?page=<span class="math-inline">\{page\}&limit\=</span>{limit}`, { headers: { Authorization: `Bearer ${token}` } }), // Pass page/limit
//                 axios.get('http://localhost:3700/api/admin/departments', { headers: { Authorization: `Bearer ${token}` } })
//             ]);
//             // FIX HERE: Access the 'students' array from the response data
//             setStudents(studentsRes.data.students); 
//             setTotalItems(studentsRes.data.totalItems);
//             setTotalPages(studentsRes.data.totalPages);
//             setCurrentPage(studentsRes.data.currentPage);

//             setDepartments(departmentsRes.data); // Departments list
//         } catch (err) {
//             console.error('Error fetching student data:', err.response?.data?.message || err.message);
//             setError('Failed to load student data. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData(currentPage, itemsPerPage); // Fetch data with pagination params
//     }, [currentPage, itemsPerPage]); // Refetch when page or itemsPerPage changes

//     // Filter logic (adjusted for uniqueYears/Departments from fetched data)
//     const uniqueYears = useMemo(() => [...new Set(students.map(s => s.current_year))].filter(Boolean), [students]);
//     const uniqueDepartments = useMemo(() => [...new Set(departments.map(d => d.name))].filter(Boolean), [departments]);

//     const filteredStudents = useMemo(() => {
//         return students.filter(student => {
//             const searchMatch =
//                 student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 student.roll_number.toLowerCase().includes(searchTerm.toLowerCase());

//             const yearMatch = filterYear ? student.current_year?.toString() === filterYear : true;
//             const departmentMatch = filterDepartment ? (departments.find(d => d.department_id === student.department_id)?.name === filterDepartment) : true;

//             return searchMatch && yearMatch && departmentMatch;
//         });
//     }, [students, searchTerm, filterYear, filterDepartment, departments]);

//     const clearFilters = () => {
//         setFilterYear('');
//         setFilterDepartment('');
//         setIsFilterOpen(false);
//     };

//     // Student CRUD Handlers (call fetchData after changes)
//     const handleCreateStudent = async (e) => {
//         e.preventDefault();
//         setError('');
//         if (!newStudent.roll_number.trim() || !newStudent.name.trim() || !newStudent.email.trim() || !newStudent.password.trim() || !newStudent.department_id || !newStudent.current_year || !newStudent.section) {
//             setError('All student fields are required.');
//             return;
//         }
//         try {
//             const token = getAdminToken();
//             const payload = {
//                 roll_number: newStudent.roll_number,
//                 name: newStudent.name,
//                 email: newStudent.email,
//                 password: newStudent.password,
//                 department_id: newStudent.department_id,
//                 current_year: parseInt(newStudent.current_year),
//                 section: newStudent.section,
//             };
//             await axios.post('http://localhost:3700/api/admin/students', payload, {
//                 headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
//             });
//             alert('Student created successfully!');
//             setNewStudent({ roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '', password: '' });
//             fetchData(currentPage, itemsPerPage); // Refresh list
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to create student.');
//         }
//     };

//     const handleUpdateStudent = async (e) => {
//         e.preventDefault();
//         setError('');
//         if (!editStudent.roll_number.trim() || !editStudent.name.trim() || !editStudent.email.trim() || !editStudent.department_id || !editStudent.current_year || !editStudent.section) {
//             setError('All student fields are required.');
//             return;
//         }
//         try {
//             const token = getAdminToken();
//             const payload = {
//                 roll_number: editStudent.roll_number,
//                 name: editStudent.name,
//                 email: editStudent.email,
//                 department_id: editStudent.department_id,
//                 current_year: parseInt(editStudent.current_year),
//                 section: editStudent.section,
//             };
//             await axios.put(`http://localhost:3700/api/admin/students/${editingStudent.student_id}`, payload, {
//                 headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
//             });
//             alert('Student updated successfully!');
//             setEditingStudent(null);
//             setEditStudent({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' });
//             fetchData(currentPage, itemsPerPage); // Refresh list
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to update student.');
//         }
//     };

//     const handleDeleteStudent = async (studentId) => {
//         if (!window.confirm('Are you sure you want to delete this student? This will also delete their enrollments and attendance records.')) return;
//         setError('');
//         try {
//             const token = getAdminToken();
//             await axios.delete(`http://localhost:3700/api/admin/students/${studentId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             alert('Student deleted successfully!');
//             if (students.length === 1 && currentPage > 1) { // Go to previous page if last item on current page
//                 setCurrentPage(currentPage - 1);
//             } else {
//                 fetchData(currentPage, itemsPerPage); // Refresh current page
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to delete student.');
//         }
//     };

//     // Pagination Handlers
//     const handlePageChange = (newPage) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     const handleLimitChange = (e) => {
//         setItemsPerPage(parseInt(e.target.value));
//         setCurrentPage(1); // Reset to first page when limit changes
//     };

//     // Enhanced pagination with page numbers (same as SubjectsList)
//     const getPageNumbers = () => {
//         const maxVisibleButtons = 5;
//         let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
//         let endPage = startPage + maxVisibleButtons - 1;
//         if (endPage > totalPages) {
//             endPage = totalPages;
//             startPage = Math.max(1, endPage - maxVisibleButtons + 1);
//         }
//         const pages = [];
//         for (let i = startPage; i <= endPage; i++) {
//             pages.push(i);
//         }
//         return pages;
//     };


//     if (loading) return <div className="text-center text-xl mt-10">Loading Students...</div>;
//     if (error) return <div className="text-center text-red-500 text-xl mt-10">Error: {error}</div>;

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6 text-center">Manage Students</h1>

//             {/* Header Section with Search Bar and View Toggle */}
//             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//                 <h3 className="text-xl font-semibold text-gray-800">Student List</h3>
//                 <div className="flex items-center space-x-2 w-full md:w-auto">
//                     <div className="relative flex-grow">
//                         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                             <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
//                         </span>
//                         <input type="text" placeholder="Search by name or roll no..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//                     </div>
//                     <div className="relative">
//                         <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter size={20} className="text-gray-600"/></button>
//                         {isFilterOpen && (
//                             <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl p-4 z-20 border">
//                                 <div className="flex justify-between items-center mb-2"><h4 className="font-semibold">Filter Options</h4><button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">Clear</button></div>
//                                 <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Year</label><select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full p-2 border rounded-md"><option value="">All</option>{uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
//                                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="w-full p-2 border rounded-md"><option value="">All</option>{uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
//                             </div>
//                         )}
//                     </div>
//                     <button onClick={handleCreateStudent} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm">Add Student</button>
//                 </div>
//             </div>

//             {/* Create Student Form */}
//             <form onSubmit={handleCreateStudent} className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
//                 <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
//                 {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//                     <input type="text" placeholder="Roll Number" value={newStudent.roll_number} onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <input type="text" placeholder="Full Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <input type="email" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <input type="password" placeholder="Password" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <select value={newStudent.department_id} onChange={(e) => setNewStudent({ ...newStudent, department_id: e.target.value })} className="px-4 py-2 border rounded-lg" required>
//                         <option value="">Select Department</option>
//                         {departments.map((dept) => (
//                             <option key={dept.department_id} value={dept.department_id}>
//                                 {dept.name}
//                             </option>
//                         ))}
//                     </select>
//                     <input type="number" placeholder="Current Year" value={newStudent.current_year} onChange={(e) => setNewStudent({ ...newStudent, current_year: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <input type="text" placeholder="Section" value={newStudent.section} onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
//                         <PlusCircle size={20} className="mr-2" /> Add Student
//                     </button>
//                 </div>
//             </form>

//             {/* Students List Table */}
//             <div className="p-4 border rounded-lg shadow-sm">
//                 <h2 className="text-xl font-semibold mb-4">Existing Students</h2>
//                 {loading ? ( // Use the overall loading state
//                     <div>Loading Students...</div>
//                 ) : students.length === 0 ? (
//                     <p className="text-center text-gray-500">No students found.</p>
//                 ) : (
//                     <table className="min-w-full bg-white border-collapse">
//                         <thead>
//                             <tr className="bg-gray-100 border-b">
//                                 <th className="py-2 px-4 text-left">Roll No.</th>
//                                 <th className="py-2 px-4 text-left">Name</th>
//                                 <th className="py-2 px-4 text-left">Email</th>
//                                 <th className="py-2 px-4 text-left">Dept.</th>
//                                 <th className="py-2 px-4 text-left">Year</th>
//                                 <th className="py-2 px-4 text-left">Section</th>
//                                 <th className="py-2 px-4 text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredStudents.map((student) => (
//                                 <tr key={student.student_id} className="border-b last:border-b-0 hover:bg-gray-50">
//                                     <td className="py-2 px-4">{student.roll_number}</td>
//                                     <td className="py-2 px-4">{student.name}</td>
//                                     <td className="py-2 px-4">{student.email}</td>
//                                     <td className="py-2 px-4">
//                                         {departments.find(d => d.department_id === student.department_id)?.name || 'N/A'}
//                                     </td>
//                                     <td className="py-2 px-4">{student.current_year}</td>
//                                     <td className="py-2 px-4">{student.section}</td>
//                                     <td className="py-2 px-4 flex space-x-2">
//                                         <button
//                                             onClick={() => {
//                                                 setEditingStudent(student);
//                                                 setEditStudent({
//                                                     student_id: student.student_id,
//                                                     roll_number: student.roll_number,
//                                                     name: student.name,
//                                                     email: student.email,
//                                                     department_id: student.department_id,
//                                                     current_year: student.current_year,
//                                                     section: student.section,
//                                                 });
//                                             }}
//                                             className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
//                                             title="Edit"
//                                         >
//                                             <Edit size={18} />
//                                         </button>
//                                         <button
//                                             onClick={() => handleDeleteStudent(student.student_id)}
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

//             {/* Edit Student Modal */}
//             {editingStudent && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
//                         <h2 className="text-xl font-semibold mb-4 text-center">Edit Student</h2>
//                         <form onSubmit={handleUpdateStudent}>
//                             {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                 <label className="block">
//                                     <span className="text-gray-700">Roll Number:</span>
//                                     <input type="text" value={editStudent.roll_number} onChange={(e) => setEditStudent({ ...editStudent, roll_number: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                                 </label>
//                                 <label className="block">
//                                     <span className="text-gray-700">Full Name:</span>
//                                     <input type="text" value={editStudent.name} onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                                 </label>
//                                 <label className="block">
//                                     <span className="text-gray-700">Email:</span>
//                                     <input type="email" value={editStudent.email} onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                                 </label>
//                                 <label className="block">
//                                     <span className="text-gray-700">Department (Branch):</span>
//                                     <select value={editStudent.department_id} onChange={(e) => setEditStudent({ ...editStudent, department_id: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required>
//                                         <option value="">Select Department</option>
//                                         {departments.map((dept) => (
//                                             <option key={dept.department_id} value={dept.department_id}>
//                                                 {dept.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </label>
//                                 <label className="block">
//                                     <span className="text-gray-700">Current Year:</span>
//                                     <input type="number" value={editStudent.current_year} onChange={(e) => setEditStudent({ ...editStudent, current_year: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                                 </label>
//                                 <label className="block">
//                                     <span className="text-gray-700">Section:</span>
//                                     <input type="text" value={editStudent.section} onChange={(e) => setEditStudent({ ...editStudent, section: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                                 </label>
//                             </div>
//                             <div className="flex justify-end space-x-2 mt-4">
//                                 <button type="button" onClick={() => { setEditingStudent(null); setNewStudent({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' }); }} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
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

// export default StudentsList;

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import axios from 'axios';
// import { Filter, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react'; // Import icons

// const StudentsList = () => {
//     const [students, setStudents] = useState([]);
//     const [departments, setDepartments] = useState([]); // Needed for dropdown
//     const [loading, setLoading] = useState(true);
//     const [pageError, setPageError] = useState(''); // Page-level error

//     const [searchTerm, setSearchTerm] = useState('');
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [filterYear, setFilterYear] = useState('');
//     const [filterDepartment, setFilterDepartment] = useState('');
//     const filterMenuRef = useRef(null);

//     const [newStudent, setNewStudent] = useState({ roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '', password: '' });
//     const [editingStudent, setEditingStudent] = useState(null);
//     const [editStudent, setEditStudent] = useState({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' });
//     const [formError, setFormError] = useState(''); // Form-level error

//     // --- PAGINATION STATE ---
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10); // Fixed to 10 per page
//     const [totalItems, setTotalItems] = useState(0);
//     const [totalPages, setTotalPages] = useState(1);

//     const getAdminToken = () => localStorage.getItem('adminToken');

//     // --- Fetch Data (Students and Departments) ---
//     const fetchData = async (page = currentPage, limit = itemsPerPage) => {
//         setLoading(true);
//         setPageError(''); // Clear page-level error
//         try {
//             const token = getAdminToken();
//             if (!token) {
//                 setPageError('Admin not authenticated. Please log in again.');
//                 setLoading(false);
//                 return;
//             }
//             const [studentsRes, departmentsRes] = await Promise.all([
//                 axios.get(`http://localhost:3700/api/admin/students?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } }), // Pass page/limit
//                 axios.get('http://localhost:3700/api/admin/departments', { headers: { Authorization: `Bearer ${token}` } }) // Departments for dropdown
//             ]);

//             // FIX HERE: Correctly access the 'students' array from the pagination response
//             setStudents(studentsRes.data.students); 
//             setTotalItems(studentsRes.data.totalItems);
//             setTotalPages(studentsRes.data.totalPages);
//             setCurrentPage(studentsRes.data.currentPage);

//             // FIX HERE: Correctly access the 'departments' array from the response data
//             // Assumes departmentsRes.data either IS the array OR it's a pagination object like studentsRes.data
//             setDepartments(departmentsRes.data.departments || departmentsRes.data); 

//         } catch (err) {
//             console.error('Error fetching student data:', err.response?.data?.message || err.message);
//             setPageError('Failed to load student data. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData(currentPage, itemsPerPage); // Fetch data with pagination params
//     }, [currentPage, itemsPerPage]); // Refetch when page or itemsPerPage changes

//     // Handle click outside for filter menu
//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
//                 setIsFilterOpen(false);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, [filterMenuRef]);

//     // Filter logic
//     const uniqueYears = useMemo(() => [...new Set(students.map(s => s.current_year))].filter(Boolean), [students]);
//     const uniqueDepartments = useMemo(() => [...new Set(departments.map(d => d.name))].filter(Boolean), [departments]);

//     const filteredStudents = useMemo(() => {
//         return students.filter(student => {
//             const searchMatch =
//                 student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 student.roll_number.toLowerCase().includes(searchTerm.toLowerCase());

//             const yearMatch = filterYear ? student.current_year?.toString() === filterYear : true;
//             const departmentMatch = filterDepartment ? (departments.find(d => d.department_id === student.department_id)?.name === filterDepartment) : true;

//             return searchMatch && yearMatch && departmentMatch;
//         });
//     }, [students, searchTerm, filterYear, filterDepartment, departments]);

//     const clearFilters = () => {
//         setFilterYear('');
//         setFilterDepartment('');
//         setIsFilterOpen(false);
//         setSearchTerm(''); // Clear search term too
//     };

//     // Student CRUD Handlers
//     const handleCreateStudent = async (e) => {
//         e.preventDefault();
//         setFormError(''); // Clear form-level error
//         if (!newStudent.roll_number.trim() || !newStudent.name.trim() || !newStudent.email.trim() || !newStudent.password.trim() || !newStudent.department_id || !newStudent.current_year || !newStudent.section) {
//             setFormError('All student fields are required.');
//             return;
//         }
//         try {
//             const token = getAdminToken();
//             const payload = {
//                 roll_number: newStudent.roll_number,
//                 name: newStudent.name,
//                 email: newStudent.email,
//                 password: newStudent.password,
//                 department_id: newStudent.department_id,
//                 current_year: parseInt(newStudent.current_year),
//                 section: newStudent.section,
//             };
//             await axios.post('http://localhost:3700/api/admin/students', payload, {
//                 headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
//             });
//             alert('Student created successfully!');
//             setNewStudent({ roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '', password: '' });
//             fetchData(currentPage, itemsPerPage); // Refresh list
//         } catch (err) {
//             setFormError(err.response?.data?.message || 'Failed to create student.');
//         }
//     };

//     const handleUpdateStudent = async (e) => {
//         e.preventDefault();
//         setFormError(''); // Clear form-level error
//         if (!editStudent.roll_number.trim() || !editStudent.name.trim() || !editStudent.email.trim() || !editStudent.department_id || !editStudent.current_year || !editStudent.section) {
//             setFormError('All student fields are required.');
//             return;
//         }
//         try {
//             const token = getAdminToken();
//             const payload = {
//                 roll_number: editStudent.roll_number,
//                 name: editStudent.name,
//                 email: editStudent.email,
//                 department_id: editStudent.department_id,
//                 current_year: parseInt(editStudent.current_year),
//                 section: editStudent.section,
//             };
//             await axios.put(`http://localhost:3700/api/admin/students/${editingStudent.student_id}`, payload, {
//                 headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
//             });
//             alert('Student updated successfully!');
//             setEditingStudent(null);
//             setEditStudent({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' });
//             fetchData(currentPage, itemsPerPage); // Refresh list
//         } catch (err) {
//             setFormError(err.response?.data?.message || 'Failed to update student.');
//         }
//     };

//     const handleDeleteStudent = async (studentId) => {
//         setPageError(''); // Clear page-level error before delete
//         if (!window.confirm('Are you sure you want to delete this student? This will also delete their enrollments and attendance records.')) return;
//         try {
//             const token = getAdminToken();
//             await axios.delete(`http://localhost:3700/api/admin/students/${studentId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             alert('Student deleted successfully!');
//             if (students.length === 1 && currentPage > 1) {
//                 setCurrentPage(currentPage - 1);
//             } else {
//                 fetchData(currentPage, itemsPerPage); // Refresh current page
//             }
//         } catch (err) {
//             if (err.response?.status === 409) {
//                 setPageError('Cannot delete student: It still has associated records (e.g., enrollments, attendance).');
//             } else {
//                 setPageError(err.response?.data?.message || 'Failed to delete student.');
//             }
//         }
//     };

//     // Pagination Handlers
//     const handlePageChange = (newPage) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     // getPageNumbers for pagination buttons (same as SubjectsList)
//     const getPageNumbers = () => {
//         const maxVisibleButtons = 5;
//         let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
//         let endPage = startPage + maxVisibleButtons - 1;
//         if (endPage > totalPages) {
//             endPage = totalPages;
//             startPage = Math.max(1, endPage - maxVisibleButtons + 1);
//         }
//         const pages = [];
//         for (let i = startPage; i <= endPage; i++) {
//             pages.push(i);
//         }
//         return pages;
//     };


//     if (loading) return <div className="text-center text-xl mt-10">Loading Students...</div>;
//     if (pageError) return <div className="text-center text-red-500 text-xl mt-10">Error: {pageError}</div>; // Display page-level error

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6 text-center">Manage Students</h1>

//             {/* Header Section with Search Bar and View Toggle */}
//             <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//                 <h3 className="text-xl font-semibold text-gray-800">Student List</h3>
//                 <div className="flex items-center space-x-2 w-full md:w-auto">
//                     <div className="relative flex-grow">
//                         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
//                             <Search size={20} className="text-gray-400" />
//                         </span>
//                         <input type="text" placeholder="Search by name or roll no..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
//                     </div>
//                     <div className="relative">
//                         <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter size={20} className="text-gray-600"/></button>
//                         {isFilterOpen && (
//                             <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl p-4 z-20 border">
//                                 <div className="flex justify-between items-center mb-2"><h4 className="font-semibold">Filter Options</h4><button onClick={clearFilters} className="text-sm text-blue-600 hover:underline">Clear</button></div>
//                                 <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Year</label><select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full p-2 border rounded-md"><option value="">All</option>{uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
//                                 <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="w-full p-2 border rounded-md"><option value="">All</option>{uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
//                             </div>
//                         )}
//                     </div>
//                     <button onClick={handleCreateStudent} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm">Add Student</button>
//                 </div>
//             </div>

//             {/* Create Student Form */}
//             <form onSubmit={handleCreateStudent} className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
//                 <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
//                 {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>} {/* Display form-level error */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//                     <input type="text" placeholder="Roll Number" value={newStudent.roll_number} onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <input type="text" placeholder="Full Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <input type="email" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <input type="password" placeholder="Password" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <select value={newStudent.department_id} onChange={(e) => setNewStudent({ ...newStudent, department_id: e.target.value })} className="px-4 py-2 border rounded-lg" required>
//                         <option value="">Select Department</option>
//                         {departments.map((dept) => (
//                             <option key={dept.department_id} value={dept.department_id}>
//                                 {dept.name}
//                             </option>
//                         ))}
//                     </select>
//                     <input type="number" placeholder="Current Year" value={newStudent.current_year} onChange={(e) => setNewStudent({ ...newStudent, current_year: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <input type="text" placeholder="Section" value={newStudent.section} onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })} className="px-4 py-2 border rounded-lg" required />
//                     <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1">
//                     <PlusCircle size={20} className="mr-2" /> Add Student
//                 </button>
//             </div>
//         </form>

//         {/* Students List Table */}
//         <div className="p-4 border rounded-lg shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">Existing Students</h2>
//             {loading ? ( // Use the overall loading state
//                 <div>Loading Students...</div>
//             ) : students.length === 0 ? (
//                 <p className="text-center text-gray-500">No students found.</p>
//             ) : (
//                 <table className="min-w-full bg-white border-collapse">
//                     <thead>
//                         <tr className="bg-gray-100 border-b">
//                             <th className="py-2 px-4 text-left">Roll No.</th>
//                             <th className="py-2 px-4 text-left">Name</th>
//                             <th className="py-2 px-4 text-left">Email</th>
//                             <th className="py-2 px-4 text-left">Dept.</th>
//                             <th className="py-2 px-4 text-left">Year</th>
//                             <th className="py-2 px-4 text-left">Section</th>
//                             <th className="py-2 px-4 text-left">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredStudents.map((student) => (
//                             <tr key={student.student_id} className="border-b last:border-b-0 hover:bg-gray-50">
//                                 <td className="py-2 px-4">{student.roll_number}</td>
//                                 <td className="py-2 px-4">{student.name}</td>
//                                 <td className="py-2 px-4">{student.email}</td>
//                                 <td className="py-2 px-4">
//                                     {departments.find(d => d.department_id === student.department_id)?.name || 'N/A'}
//                                 </td>
//                                 <td className="py-2 px-4">{student.current_year}</td>
//                                 <td className="py-2 px-4">{student.section}</td>
//                                 <td className="py-2 px-4 flex space-x-2">
//                                     <button
//                                         onClick={() => {
//                                             setEditingStudent(student);
//                                             setEditStudent({
//                                                 student_id: student.student_id,
//                                                 roll_number: student.roll_number,
//                                                 name: student.name,
//                                                 email: student.email,
//                                                 department_id: student.department_id,
//                                                 current_year: student.current_year,
//                                                 section: student.section,
//                                             });
//                                         }}
//                                         className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
//                                         title="Edit"
//                                     >
//                                         <Edit size={18} />
//                                     </button>
//                                     <button
//                                         onClick={() => handleDeleteStudent(student.student_id)}
//                                         className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
//                                         title="Delete"
//                                     >
//                                         <Trash2 size={18} />
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>

//         {/* Pagination Controls - Simplified and fixed limit to 10 per page */}
//         <div className="flex justify-between items-center mt-4 p-2 border-t pt-4">
//             <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center"
//             >
//                 <ChevronLeft size={16} className="mr-2" /> Previous
//             </button>
//             <div className="flex flex-wrap gap-1">
//                 {getPageNumbers().map((page) => (
//                     <button
//                         key={page}
//                         onClick={() => handlePageChange(page)}
//                         className={`px-3 py-1 rounded-lg border ${
//                             page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
//                         }`}
//                     >
//                         {page}
//                     </button>
//                 ))}
//             </div>
//             <span className="text-sm text-gray-700">
//                 Page {currentPage} of {totalPages} (Total {totalItems} items)
//             </span>
//             <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center"
//             >
//                 Next <ChevronRight size={16} className="ml-2" />
//             </button>
//         </div>
//         {/* Edit Student Modal */}
//         {editingStudent && (
//             <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
//                 <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
//                     <h2 className="text-xl font-semibold mb-4 text-center">Edit Student</h2>
//                     <form onSubmit={handleUpdateStudent}>
//                         {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>} {/* Display form-level error */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                             <label className="block">
//                                 <span className="text-gray-700">Roll Number:</span>
//                                 <input type="text" value={editStudent.roll_number} onChange={(e) => setEditStudent({ ...editStudent, roll_number: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                             </label>
//                             <label className="block">
//                                 <span className="text-gray-700">Full Name:</span>
//                                 <input type="text" value={editStudent.name} onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                             </label>
//                             <label className="block">
//                                 <span className="text-gray-700">Email:</span>
//                                 <input type="email" value={editStudent.email} onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                             </label>
//                             <label className="block">
//                                 <span className="text-gray-700">Department (Branch):</span>
//                                 <select value={editStudent.department_id} onChange={(e) => setEditStudent({ ...editStudent, department_id: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required>
//                                     <option value="">Select Department</option>
//                                     {departments.map((dept) => (
//                                         <option key={dept.department_id} value={dept.department_id}>
//                                             {dept.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </label>
//                             <label className="block">
//                                 <span className="text-gray-700">Current Year:</span>
//                                 <input type="number" value={editStudent.current_year} onChange={(e) => setEditStudent({ ...editStudent, current_year: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                             </label>
//                             <label className="block">
//                                 <span className="text-gray-700">Section:</span>
//                                 <input type="text" value={editStudent.section} onChange={(e) => setEditStudent({ ...editStudent, section: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-lg" required />
//                             </label>
//                         </div>
//                         <div className="flex justify-end space-x-2 mt-4">
//                             <button type="button" onClick={() => { setEditingStudent(null); setNewStudent({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' }); }} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
//                                 Cancel
//                             </button>
//                             <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
//                                 Save Changes
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         )}
//     </div>
// );
// }
// export default StudentsList;

import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { Filter, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, Search, Calendar } from 'lucide-react';
import StudentAttendanceCalendarModel from '../../components/models/StudentAttendanceCalendarModel'; // Import the new modal component

const StudentsList = () => {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterYear, setFilterYear] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const filterMenuRef = useRef(null);

    const [newStudent, setNewStudent] = useState({ roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '', password: '' });
    const [editingStudent, setEditingStudent] = useState(null);
    const [editStudent, setEditStudent] = useState({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' });
    const [formError, setFormError] = useState('');

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Fixed to 10 per page
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // --- CALENDAR MODAL STATE ---
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [selectedStudentForCalendar, setSelectedStudentForCalendar] = useState(null);


    const getAdminToken = () => localStorage.getItem('adminToken');

    // --- Fetch Data (Students and Departments) ---
    const fetchData = async (page = currentPage, limit = itemsPerPage) => {
        setLoading(true);
        setPageError('');
        try {
            const token = getAdminToken();
            if (!token) {
                setPageError('Admin not authenticated. Please log in again.');
                setLoading(false);
                return;
            }
            const [studentsRes, departmentsRes] = await Promise.all([
                axios.get(`http://localhost:3700/api/admin/students?page=${page}&limit=${limit}&searchTerm=${searchTerm}&filterYear=${filterYear}&filterDepartmentId=${filterDepartment}`, { headers: { Authorization: `Bearer ${token}` } }), // Pass search/filter
                axios.get('http://localhost:3700/api/admin/departments', { headers: { Authorization: `Bearer ${token}` } }) // Departments for dropdown
            ]);
            
            // FIX HERE: Access the 'students' array from the response data
            setStudents(studentsRes.data.students); 
            setTotalItems(studentsRes.data.totalItems);
            setTotalPages(studentsRes.data.totalPages);
            setCurrentPage(studentsRes.data.currentPage);

            // FIX HERE: Access the 'departments' array from the response data
            // Assuming departments API is also paginated, or simply the array.
            setDepartments(departmentsRes.data.departments || departmentsRes.data); 

        } catch (err) {
            console.error('Error fetching student data:', err.response?.data?.message || err.message);
            setPageError('Failed to load student data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage, itemsPerPage); // Fetch data with pagination params
    }, [currentPage, itemsPerPage, searchTerm, filterYear, filterDepartment]); // Refetch on filter/search changes

    // Handle click outside for filter menu
    useEffect(() => {
        function handleClickOutside(event) {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [filterMenuRef]);

    // Filter logic is mostly handled by backend now, this is for UI display of unique options
    const uniqueYears = useMemo(() => [...new Set(students.map(s => s.current_year))].filter(Boolean), [students]);
    const uniqueDepartments = useMemo(() => [...new Set(departments.map(d => d.name))].filter(Boolean), [departments]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterYear('');
        setFilterDepartment('');
        setIsFilterOpen(false);
        setCurrentPage(1); // Reset to first page
    };

    // Student CRUD Handlers
    const handleCreateStudent = async (e) => {
        e.preventDefault();
        setFormError(''); // Clear form-level error
        if (!newStudent.roll_number.trim() || !newStudent.name.trim() || !newStudent.email.trim() || !newStudent.password.trim() || !newStudent.department_id || !newStudent.current_year || !newStudent.section) {
            setFormError('All student fields are required.');
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
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            alert('Student created successfully!');
            setNewStudent({ roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '', password: '' });
            fetchData(currentPage, itemsPerPage); // Refresh list
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to create student.');
        }
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        setFormError(''); // Clear form-level error
        if (!editStudent.roll_number.trim() || !editStudent.name.trim() || !editStudent.email.trim() || !editStudent.department_id || !editStudent.current_year || !editStudent.section) {
                setFormError('All student fields are required.');
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
                    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                });
                alert('Student updated successfully!');
                setEditingStudent(null);
                setEditStudent({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' });
                fetchData(currentPage, itemsPerPage); // Refresh list
            } catch (err) {
                setFormError(err.response?.data?.message || 'Failed to update student.');
            }
        };

        const handleDeleteStudent = async (studentId) => {
            setPageError(''); // Clear page-level error before delete
            if (!window.confirm('Are you sure you want to delete this student? This will also delete their enrollments and attendance records.')) return;
            try {
                const token = getAdminToken();
                await axios.delete(`http://localhost:3700/api/admin/students/${studentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Student deleted successfully!');
                if (students.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else {
                    fetchData(currentPage, itemsPerPage); // Refresh current page
                }
            } catch (err) {
                if (err.response?.status === 409) {
                    setPageError('Cannot delete student: It still has associated records (e.g., enrollments, attendance).');
                } else {
                    setPageError(err.response?.data?.message || 'Failed to delete student.');
                }
            }
        };

        // Pagination Handlers
        const handlePageChange = (newPage) => {
            if (newPage > 0 && newPage <= totalPages) {
                setCurrentPage(newPage);
            }
        };

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

        // Handle opening calendar modal
        const handleViewCalendar = (student) => {
            setSelectedStudentForCalendar(student);
            setShowCalendarModal(true);
        };

        // Handle closing calendar modal
        const handleCloseCalendarModal = () => {
            setShowCalendarModal(false);
            setSelectedStudentForCalendar(null);
        };


        if (loading) return <div className="text-center text-xl mt-10">Loading Students...</div>;
        if (pageError) return <div className="text-center text-red-500 text-xl mt-10">Error: {pageError}</div>;

        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6 text-center">Manage Students</h1>

                {/* Header Section with Search Bar and View Toggle */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-xl font-semibold text-gray-800">Student List</h3>
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <div className="relative flex-grow">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search size={20} className="text-gray-400" />
                            </span>
                            <input type="text" placeholder="Search by name or roll no..." value={searchTerm} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div className="relative" ref={filterMenuRef}>
                            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"><Filter size={20} className="text-gray-600"/></button>
                            {isFilterOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl p-4 z-20 border">
                                    <div className="flex justify-between items-center mb-2"><h4 className="font-semibold">Filter Options</h4><button onClick={handleClearFilters} className="text-sm text-blue-600 hover:underline">Clear</button></div>
                                    <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Year</label><select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full p-2 border rounded-md"><option value="">All</option>{uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label><select value={filterDepartment} onChange={e => setFilterDepartment(e.target.value)} className="w-full p-2 border rounded-md"><option value="">All</option>{uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                                </div>
                            )}
                        </div>
                        <button onClick={handleCreateStudent} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm">Add Student</button>
                    </div>
                </div>

                {/* Create Student Form */}
                <form onSubmit={handleCreateStudent} className="mb-8 p-4 border rounded-lg shadow-sm bg-gray-50">
                    <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
                    {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <input type="text" placeholder="Roll Number" value={newStudent.roll_number} onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                        <input type="text" placeholder="Full Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                        <input type="email" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                        <input type="password" placeholder="Password" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} className="px-4 py-2 border rounded-lg" required />
                        <select value={newStudent.department_id} onChange={(e) => setNewStudent({ ...newStudent, department_id: e.target.value })} className="px-4 py-2 border rounded-lg" required>
                            <option value="">Select Department</option>
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
                {loading ? ( // Use the overall loading state
                    <div>Loading Students...</div>
                ) : students.length === 0 ? (
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
                            {/* Filtered Students - Now handled by backend search, so map directly over students */}
                            {students.map((student) => (
                                <tr key={student.student_id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2 px-4">{student.roll_number}</td>
                                    <td className="py-2 px-4">{student.name}</td>
                                    <td className="py-2 px-4">{student.email}</td>
                                    <td className="py-2 px-4">
                                        {/* Display Department Name using departments list lookup */}
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
                                        <button
                                            onClick={() => handleViewCalendar(student)} // New button for calendar
                                            className="text-purple-500 hover:text-purple-700 p-1 rounded-full hover:bg-purple-100"
                                            title="View Calendar"
                                        >
                                            <Calendar size={18} />
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
            {/* Edit Student Modal */}
            {editingStudent && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-xl font-semibold mb-4 text-center">Edit Student</h2>
                        <form onSubmit={handleUpdateStudent}>
                            {formError && <div className="text-red-500 text-sm mb-2">{formError}</div>}
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
                                <button type="button" onClick={() => { setEditingStudent(null); setEditStudent({ student_id: '', roll_number: '', name: '', email: '', department_id: '', current_year: '', section: '' }); }} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
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
            {/* Student Attendance Calendar Modal */}
            {showCalendarModal && selectedStudentForCalendar && (
                <StudentAttendanceCalendarModel
                    studentId={selectedStudentForCalendar.student_id}
                    studentName={selectedStudentForCalendar.name}
                    onClose={handleCloseCalendarModal}
                />
            )}
        </div>
    );
};
export default StudentsList;