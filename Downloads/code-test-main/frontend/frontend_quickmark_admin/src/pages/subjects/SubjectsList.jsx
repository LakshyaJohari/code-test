// // // src/pages/subjects/SubjectsList.jsx

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Assuming you use Font Awesome icons

// // export default function SubjectsList() {
// //     const [subjects, setSubjects] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState('');
// //     const [showCreateModal, setShowCreateModal] = useState(false);
// //     const [showEditModal, setShowEditModal] = useState(false);
// //     const [selectedSubject, setSelectedSubject] = useState(null);
// //     const [departments, setDepartments] = useState([]); // To fetch departments for dropdowns

// //     // Form states for Create/Edit
// //     const [formSubjectName, setFormSubjectName] = useState('');
// //     const [formDepartmentId, setFormDepartmentId] = useState('');
// //     const [formYear, setFormYear] = useState('');
// //     const [formSection, setFormSection] = useState('');
// //     const [formSemester, setFormSemester] = useState(''); // NEW: Semester field

// //     const getAdminToken = () => localStorage.getItem('adminToken');

// //     // Fetch subjects from backend
// //     const fetchSubjects = async () => {
// //         setLoading(true);
// //         setError('');
// //         try {
// //             const token = getAdminToken();
// //             if (!token) {
// //                 setError('Admin not authenticated. Please log in again.');
// //                 setLoading(false);
// //                 return;
// //             }
// //             const res = await axios.get('http://localhost:3700/api/admin/subjects', {
// //                 headers: { Authorization: `Bearer ${token}` }
// //             });
// //             setSubjects(res.data);
// //         } catch (err) {
// //             console.error('Error fetching subjects:', err.response ? err.response.data : err.message);
// //             setError(err.response?.data?.message || 'Failed to load subjects.');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // Fetch departments for dropdowns
// //     const fetchDepartments = async () => {
// //         try {
// //             const token = getAdminToken();
// //             if (!token) return; // Should be handled by main App.jsx redirect if not authenticated
// //             const res = await axios.get('http://localhost:3700/api/admin/departments', {
// //                 headers: { Authorization: `Bearer ${token}` }
// //             });
// //             setDepartments(res.data);
// //         } catch (err) {
// //             console.error('Error fetching departments:', err);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchSubjects();
// //         fetchDepartments();
// //     }, []);

// //     // Handle Create Subject
// //     const handleCreateSubject = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const token = getAdminToken();
// //             await axios.post('http://localhost:3700/api/admin/subjects', {
// //                 subject_name: formSubjectName,
// //                 department_id: formDepartmentId,
// //                 year: parseInt(formYear),
// //                 section: formSection,
// //                 semester: parseInt(formSemester) // NEW: Send semester
// //             }, {
// //                 headers: { Authorization: `Bearer ${token}` }
// //             });
// //             setShowCreateModal(false);
// //             resetForm();
// //             fetchSubjects(); // Refresh the list
// //         } catch (err) {
// //             console.error('Error creating subject:', err.response ? err.response.data : err.message);
// //             setError(err.response?.data?.message || 'Failed to create subject.');
// //         }
// //     };

// //     // Handle Edit Subject (modal open)
// //     const handleEditClick = (subject) => {
// //         setSelectedSubject(subject);
// //         setFormSubjectName(subject.subject_name);
// //         setFormDepartmentId(subject.department_id);
// //         setFormYear(subject.year);
// //         setFormSection(subject.section);
// //         setFormSemester(subject.semester); // NEW: Set semester for editing
// //         setShowEditModal(true);
// //     };

// //     // Handle Update Subject (modal submit)
// //     const handleUpdateSubject = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const token = getAdminToken();
// //             await axios.put(`http://localhost:3700/api/admin/subjects/${selectedSubject.subject_id}`, {
// //                 subject_name: formSubjectName,
// //                 department_id: formDepartmentId,
// //                 year: parseInt(formYear),
// //                 section: formSection,
// //                 semester: parseInt(formSemester) // NEW: Send semester
// //             }, {
// //                 headers: { Authorization: `Bearer ${token}` }
// //             });
// //             setShowEditModal(false);
// //             resetForm();
// //             fetchSubjects(); // Refresh the list
// //         } catch (err) {
// //             console.error('Error updating subject:', err.response ? err.response.data : err.message);
// //             setError(err.response?.data?.message || 'Failed to update subject.');
// //         }
// //     };

// //     // Handle Delete Subject
// //     const handleDeleteSubject = async (subjectId) => {
// //         if (window.confirm('Are you sure you want to delete this subject?')) {
// //             try {
// //                 const token = getAdminToken();
// //                 await axios.delete(`http://localhost:3700/api/admin/subjects/${subjectId}`, {
// //                     headers: { Authorization: `Bearer ${token}` }
// //                 });
// //                 fetchSubjects(); // Refresh the list
// //             } catch (err) {
// //                 console.error('Error deleting subject:', err.response ? err.response.data : err.message);
// //                 setError(err.response?.data?.message || 'Failed to delete subject.');
// //             }
// //         }
// //     };

// //     const resetForm = () => {
// //         setFormSubjectName('');
// //         setFormDepartmentId('');
// //         setFormYear('');
// //         setFormSection('');
// //         setFormSemester(''); // NEW: Reset semester
// //         setSelectedSubject(null);
// //     };

// //     if (loading) return <div className="text-center text-xl mt-10">Loading Subjects...</div>;
// //     if (error) return <div className="text-center text-red-500 text-xl mt-10">Error: {error}</div>;

// //     return (
// //         <div className="container mx-auto p-4">
// //             <h1 className="text-3xl font-bold mb-6 text-center">Manage Subjects</h1>

// //             <div className="flex justify-end mb-4">
// //                 <button
// //                     onClick={() => setShowCreateModal(true)}
// //                     className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
// //                 >
// //                     <FaPlus className="mr-2" /> Add Subject
// //                 </button>
// //             </div>

// //             <div className="overflow-x-auto bg-white shadow-md rounded-lg">
// //                 {subjects.length === 0 ? (
// //                     <p className="text-center text-gray-500 p-6">No subjects found.</p>
// //                 ) : (
// //                     <table className="min-w-full leading-normal">
// //                         <thead>
// //                             <tr className="bg-gray-100 border-b-2 border-gray-200">
// //                                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject Name</th>
// //                                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Department</th>
// //                                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Year</th>
// //                                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Section</th>
// //                                 <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Semester</th> {/* NEW HEADER */}
// //                                 <th className="px-5 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {subjects.map((subject) => (
// //                                 <tr key={subject.subject_id} className="border-b border-gray-200 hover:bg-gray-50">
// //                                     <td className="px-5 py-5 text-sm">{subject.subject_name}</td>
// //                                     <td className="px-5 py-5 text-sm">{subject.department_name}</td>
// //                                     <td className="px-5 py-5 text-sm">{subject.year}</td>
// //                                     <td className="px-5 py-5 text-sm">{subject.section}</td>
// //                                     <td className="px-5 py-5 text-sm">{subject.semester || 'N/A'}</td> {/* NEW DATA DISPLAY */}
// //                                     <td className="px-5 py-5 text-sm text-center">
// //                                         <button
// //                                             onClick={() => handleEditClick(subject)}
// //                                             className="text-blue-600 hover:text-blue-900 mr-4"
// //                                             title="Edit Subject"
// //                                         >
// //                                             <FaEdit />
// //                                         </button>
// //                                         <button
// //                                             onClick={() => handleDeleteSubject(subject.subject_id)}
// //                                             className="text-red-600 hover:text-red-900"
// //                                             title="Delete Subject"
// //                                         >
// //                                             <FaTrash />
// //                                         </button>
// //                                     </td>
// //                                 </tr>
// //                             ))}
// //                         </tbody>
// //                     </table>
// //                 )}
// //             </div>

// //             {/* Create Subject Modal */}
// //             {showCreateModal && (
// //                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
// //                     <div className="relative p-8 bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
// //                         <h3 className="text-xl font-bold mb-4">Add New Subject</h3>
// //                         <form onSubmit={handleCreateSubject}>
// //                             {/* Subject Name */}
// //                             <div className="mb-4">
// //                                 <label className="block text-gray-700 text-sm font-bold mb-2">Subject Name</label>
// //                                 <input
// //                                     type="text"
// //                                     value={formSubjectName}
// //                                     onChange={(e) => setFormSubjectName(e.target.value)}
// //                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                     required
// //                                 />
// //                             </div>
// //                             {/* Department */}
// //                             <div className="mb-4">
// //                                 <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
// //                                 <select
// //                                     value={formDepartmentId}
// //                                     onChange={(e) => setFormDepartmentId(e.target.value)}
// //                                     className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                     required
// //                                 >
// //                                     <option value="">Select Department</option>
// //                                     {departments.map(dept => (
// //                                         <option key={dept.department_id} value={dept.department_id}>{dept.name}</option>
// //                                     ))}
// //                                 </select>
// //                             </div>
// //                             {/* Year */}
// //                             <div className="mb-4">
// //                                 <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
// //                                 <input
// //                                     type="number"
// //                                     value={formYear}
// //                                     onChange={(e) => setFormYear(e.target.value)}
// //                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                     required
// //                                 />
// //                             </div>
// //                             {/* Section */}
// //                             <div className="mb-4">
// //                                 <label className="block text-gray-700 text-sm font-bold mb-2">Section</label>
// //                                 <input
// //                                     type="text"
// //                                     value={formSection}
// //                                     onChange={(e) => setFormSection(e.target.value)}
// //                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                     required
// //                                 />
// //                             </div>
// //                             {/* Semester */}
// //                             <div className="mb-4">
// //                                 <label className="block text-gray-700 text-sm font-bold mb-2">Semester</label>
// //                                 <input
// //                                     type="number" // Input type number for semester
// //                                     value={formSemester}
// //                                     onChange={(e) => setFormSemester(e.target.value)}
// //                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                     placeholder="e.g., 1 or 2"
// //                                     min="1"
// //                                     max="2"
// //                                     required
// //                                 />
// //                             </div>

// //                             <div className="flex justify-end gap-4 mt-6">
// //                                 <button
// //                                     type="button"
// //                                     onClick={() => { setShowCreateModal(false); resetForm(); }}
// //                                     className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
// //                                 >
// //                                     Cancel
// //                                 </button>
// //                                 <button
// //                                     type="submit"
// //                                     className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
// //                                 >
// //                                     Add Subject
// //                                 </button>
// //                             </div>
// //                         </form>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* Edit Subject Modal */}
// //             {showEditModal && (
// //                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
// //                     <div className="relative p-8 bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
// //                         <h3 className="text-xl font-bold mb-4">Edit Subject</h3>
// //                         <form onSubmit={handleUpdateSubject}>
// //                             {/* Subject Name */}
// //                             <div className="mb-4">
// //                                 <label className="block text-gray-700 text-sm font-bold mb-2">Subject Name</label>
// //                                 <input
// //                                     type="text"
// //                                     value={formSubjectName}
// //                                     onChange={(e) => setFormSubjectName(e.target.value)}
// //                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                     required
// //                                 />
// //                             </div>
// //                             {/* Department */}
// //                             <div className="mb-4">
// //                                 <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
// //                                 <select
// //                                     value={formDepartmentId}
// //                                     onChange={(e) => setFormDepartmentId(e.target.value)}
// //                                     className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                     required
// //                                 >
// //                                     <option value="">Select Department</option>
// //                                     {departments.map(dept => (
// //                                         <option key={dept.department_id} value={dept.department_id}>{dept.name}</option>
// //                                     ))}
// //                                 </select>
// //                             </div>
// //                             {/* Year */}
// //                             <div className="mb-4">
// //                                 <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
// //                                 <input
// //                                     type="number"
// //                                     value={formYear}
// //                                     onChange={(e) => setFormYear(e.target.value)}
// //                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                     required
// //                                 />
// //                             </div>
// //                             {/* Section */}
// //                             <div className="mb-4">
// //                                 <label className="block text-gray-700 text-sm font-bold mb-2">Section</label>
// //                                 <input
// //                                     type="text"
// //                                     value={formSection}
// //                                     onChange={(e) => setFormSection(e.target.value)}
// //                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                     required
// //                                 />
// //                             </div>
// //                             {/* Semester */}
// //                             <div className="mb-4">
// //                                 <label className="block text-gray-700 text-sm font-bold mb-2">Semester</label>
// //                                 <input
// //                                     type="number" // Input type number for semester
// //                                     value={formSemester}
// //                                     onChange={(e) => setFormSemester(e.target.value)}
// //                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
// //                                     placeholder="e.g., 1 or 2"
// //                                     min="1"
// //                                     max="2"
// //                                     required
// //                                 />
// //                             </div>

// //                             <div className="flex justify-end gap-4 mt-6">
// //                                 <button
// //                                     type="button"
// //                                     onClick={() => { setShowEditModal(false); resetForm(); }}
// //                                     className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
// //                                 >
// //                                     Cancel
// //                                 </button>
// //                                 <button
// //                                     type="submit"
// //                                     className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
// //                                 >
// //                                     Update Subject
// //                                 </button>
// //                             </div>
// //                         </form>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// const SubjectsList = () => {
//     // Departments state
//     const [departments, setDepartments] = useState([]);
//     const [loadingDepartments, setLoadingDepartments] = useState(true);
//     const [departmentError, setDepartmentError] = useState('');

//     // Subjects state
//     const [subjects, setSubjects] = useState([]);
//     const [loadingSubjects, setLoadingSubjects] = useState(true);
//     const [subjectError, setSubjectError] = useState('');
//     const [newSubject, setNewSubject] = useState({ subject_name: '', department_id: '', year: '', section: '', semester: '' });
//     const [editingSubject, setEditingSubject] = useState(null);
//     const [editSubject, setEditSubject] = useState({ subject_id: '', subject_name: '', department_id: '', year: '', section: '', semester: '' });

//     // Pagination state
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage, setItemsPerPage] = useState(10);
//     const [totalItems, setTotalItems] = useState(0);
//     const [totalPages, setTotalPages] = useState(1);

//     const getAdminToken = () => localStorage.getItem('adminToken');

//     // Fetch Departments
//     const fetchDepartments = async () => {
//         setLoadingDepartments(true);
//         setDepartmentError('');
//         try {
//             const token = getAdminToken();
//             const response = await axios.get('http://localhost:3700/api/admin/departments', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setDepartments(response.data);
//         } catch (err) {
//             setDepartmentError('Failed to load departments.');
//         } finally {
//             setLoadingDepartments(false);
//         }
//     };

//     // Fetch Subjects (with pagination)
//     const fetchSubjects = async (page = currentPage, limit = itemsPerPage) => {
//         setLoadingSubjects(true);
//         setSubjectError('');
//         try {
//             const token = getAdminToken();
//             const response = await axios.get(`http://localhost:3700/api/admin/subjects?page=${page}&limit=${limit}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setSubjects(response.data.subjects);
//             setTotalItems(response.data.totalItems);
//             setTotalPages(response.data.totalPages);
//             setCurrentPage(response.data.currentPage);
//         } catch (err) {
//             setSubjectError('Failed to load subjects.');
//         } finally {
//             setLoadingSubjects(false);
//         }
//     };

//     useEffect(() => {
//         fetchDepartments();
//         fetchSubjects(currentPage, itemsPerPage);
//         // eslint-disable-next-line
//     }, [currentPage, itemsPerPage]);

//     // Create Subject
//     const handleCreateSubject = async (e) => {
//         e.preventDefault();
//         setSubjectError('');
//         if (!newSubject.subject_name.trim() || !newSubject.department_id || !newSubject.year || !newSubject.section || !newSubject.semester) {
//             setSubjectError('Subject name, department, year, section, and semester are required.');
//             return;
//         }
//         const parsedSemester = parseInt(newSubject.semester);
//         if (isNaN(parsedSemester) || parsedSemester < 1 || parsedSemester > 2) {
//             setSubjectError('Semester must be 1 or 2.');
//             return;
//         }
//         try {
//             const token = getAdminToken();
//             const payload = {
//                 subject_name: newSubject.subject_name,
//                 department_id: newSubject.department_id,
//                 year: parseInt(newSubject.year),
//                 section: newSubject.section,
//                 semester: parsedSemester,
//             };
//             await axios.post('http://localhost:3700/api/admin/subjects', payload, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             alert('Subject created successfully!');
//             setNewSubject({ subject_name: '', department_id: '', year: '', section: '', semester: '' });
//             fetchSubjects(currentPage, itemsPerPage);
//         } catch (err) {
//             setSubjectError(err.response?.data?.message || 'Failed to create subject.');
//         }
//     };

//     // Update Subject
//     const handleUpdateSubject = async (e) => {
//         e.preventDefault();
//         setSubjectError('');
//         if (!editSubject.subject_name.trim() || !editSubject.department_id || !editSubject.year || !editSubject.section || !editSubject.semester) {
//             setSubjectError('Subject name, department, year, section, and semester are required for update.');
//             return;
//         }
//         const parsedSemester = parseInt(editSubject.semester);
//         if (isNaN(parsedSemester) || parsedSemester < 1 || parsedSemester > 2) {
//             setSubjectError('Semester must be 1 or 2.');
//             return;
//         }
//         try {
//             const token = getAdminToken();
//             const payload = {
//                 subject_name: editSubject.subject_name,
//                 department_id: editSubject.department_id,
//                 year: parseInt(editSubject.year),
//                 section: editSubject.section,
//                 semester: parsedSemester,
//             };
//             await axios.put(`http://localhost:3700/api/admin/subjects/${editingSubject.subject_id}`, payload, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             alert('Subject updated successfully!');
//             setEditingSubject(null);
//             setEditSubject({ subject_id: '', subject_name: '', department_id: '', year: '', section: '', semester: '' });
//             fetchSubjects(currentPage, itemsPerPage);
//         } catch (err) {
//             setSubjectError(err.response?.data?.message || 'Failed to update subject.');
//         }
//     };

//     // Delete Subject
//     const handleDeleteSubject = async (subjectId) => {
//         if (!window.confirm('Are you sure you want to delete this subject?')) return;
//         setSubjectError('');
//         try {
//             const token = getAdminToken();
//             await axios.delete(`http://localhost:3700/api/admin/subjects/${subjectId}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             alert('Subject deleted successfully!');
//             if (subjects.length === 1 && currentPage > 1) {
//                 setCurrentPage(currentPage - 1);
//             } else {
//                 fetchSubjects(currentPage, itemsPerPage);
//             }
//         } catch (err) {
//             setSubjectError(err.response?.data?.message || 'Failed to delete subject.');
//         }
//     };

//     // Pagination
//     const handlePageChange = (newPage) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     const handleLimitChange = (e) => {
//         setItemsPerPage(parseInt(e.target.value));
//         setCurrentPage(1);
//     };

//     if (loadingDepartments || loadingSubjects) return <div className="text-center text-xl mt-10">Loading Data...</div>;
//     if (departmentError || subjectError) return <div className="text-center text-red-500 text-xl mt-10">Error: {departmentError || subjectError}</div>;

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6 text-center">Manage Subjects (Courses)</h1>
//             <section className="p-4 border rounded-lg shadow-sm">
//                 <h2 className="text-xl font-semibold mb-4 text-center">Subjects (Courses) List</h2>
//                 {/* Create Subject Form */}
//                 <form onSubmit={handleCreateSubject} className="mb-6 p-4 border rounded-lg bg-gray-50">
//                     <h3 className="text-xl font-semibold mb-3">Add New Subject (Course)</h3>
//                     {subjectError && <div className="text-red-500 text-sm mb-2">{subjectError}</div>}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//                         <input
//                             type="text"
//                             placeholder="Subject Name"
//                             value={newSubject.subject_name}
//                             onChange={(e) => setNewSubject({ ...newSubject, subject_name: e.target.value })}
//                             className="px-4 py-2 border rounded-lg"
//                             required
//                         />
//                         <select
//                             value={newSubject.department_id}
//                             onChange={(e) => setNewSubject({ ...newSubject, department_id: e.target.value })}
//                             className="px-4 py-2 border rounded-lg"
//                             required
//                         >
//                             <option value="">Select Department (Branch)</option>
//                             {departments.map((dept) => (
//                                 <option key={dept.department_id} value={dept.department_id}>
//                                     {dept.name}
//                                 </option>
//                             ))}
//                         </select>
//                         <input
//                             type="number"
//                             placeholder="Year (e.g., 2)"
//                             value={newSubject.year}
//                             onChange={(e) => setNewSubject({ ...newSubject, year: e.target.value })}
//                             className="px-4 py-2 border rounded-lg"
//                             required
//                         />
//                         <input
//                             type="number"
//                             placeholder="Semester (1 or 2)"
//                             value={newSubject.semester}
//                             onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
//                             className="px-4 py-2 border rounded-lg"
//                             required
//                             min="1"
//                             max="2"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Section (e.g., C)"
//                             value={newSubject.section}
//                             onChange={(e) => setNewSubject({ ...newSubject, section: e.target.value })}
//                             className="px-4 py-2 border rounded-lg"
//                             required
//                         />
//                         <button
//                             type="submit"
//                             className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center col-span-1 md:col-span-2 lg:col-span-1"
//                         >
//                             <PlusCircle size={20} className="mr-2" /> Add Subject
//                         </button>
//                     </div>
//                 </form>
//                 {/* Subjects List Table */}
//                 {subjects.length === 0 ? (
//                     <p className="text-center text-gray-500">No subjects found.</p>
//                 ) : (
//                     <table className="min-w-full bg-white border-collapse">
//                         <thead>
//                             <tr className="bg-gray-100 border-b">
//                                 <th className="py-2 px-4 text-left">Name</th>
//                                 <th className="py-2 px-4 text-left">Dept.</th>
//                                 <th className="py-2 px-4 text-left">Year</th>
//                                 <th className="py-2 px-4 text-left">Section</th>
//                                 <th className="py-2 px-4 text-left">Semester</th>
//                                 <th className="py-2 px-4 text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {subjects.map((subj) => (
//                                 <tr key={subj.subject_id} className="border-b last:border-b-0 hover:bg-gray-50">
//                                     <td className="py-2 px-4">{subj.subject_name}</td>
//                                     <td className="py-2 px-4">{subj.department_name}</td>
//                                     <td className="py-2 px-4">{subj.year}</td>
//                                     <td className="py-2 px-4">{subj.section}</td>
//                                     <td className="py-2 px-4">{subj.semester}</td>
//                                     <td className="py-2 px-4 flex space-x-2">
//                                         <button
//                                             onClick={() => {
//                                                 setEditingSubject(subj);
//                                                 setEditSubject({
//                                                     subject_id: subj.subject_id,
//                                                     subject_name: subj.subject_name,
//                                                     department_id: subj.department_id,
//                                                     year: subj.year,
//                                                     section: subj.section,
//                                                     semester: subj.semester,
//                                                 });
//                                             }}
//                                             className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
//                                             title="Edit"
//                                         >
//                                             <Edit size={18} />
//                                         </button>
//                                         <button
//                                             onClick={() => handleDeleteSubject(subj.subject_id)}
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
//                 {/* Pagination Controls */}
//                 {/* <div className="flex justify-between items-center mt-4 p-2 border-t pt-4">
//                     <button
//                         onClick={() => handlePageChange(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center"
//                     >
//                         <ChevronLeft size={16} className="mr-2" /> Previous
//                     </button>
//                     <span className="text-sm text-gray-700">
//                         Page {currentPage} of {totalPages} (Total {totalItems} items)
//                     </span>
//                     <div className="flex items-center space-x-2">
//                         <select value={itemsPerPage} onChange={handleLimitChange} className="p-2 border rounded-lg text-sm">
//                             <option value="5">5 per page</option>
//                             <option value="10">10 per page</option>
//                             <option value="20">20 per page</option>
//                         </select>
//                         <button
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             disabled={currentPage === totalPages}
//                             className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center"
//                         >
//                             Next <ChevronRight size={16} className="ml-2" />
//                         </button>
//                     </div>
//                 </div> */}
//                 {/* Pagination Controls - Simplified */}
//                 <div className="flex justify-between items-center mt-4 p-2 border-t pt-4">
//                 <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center"
//                 >
//                 <ChevronLeft size={16} className="mr-2" /> Previous
//                 </button>
//                 {/* Page Numbers */}
//                 <div className="flex flex-wrap gap-1">
//                 {getPageNumbers().map((page) => (
//                 <button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={`px-3 py-1 rounded-lg border ${
//                     page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
//                 }`}
//                 >
//                 {page}
//                 </button>
//                 ))}
//                 </div>
//                 {/* Display Current Page Info (Items per page selector removed) */}
//                 <span className="text-sm text-gray-700">
//                 Page {currentPage} of {totalPages} (Total {totalItems} items)
//                 </span>
//                 {/* Next Button */}
//                 <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center"
//                 >
//                 Next <ChevronRight size={16} className="ml-2" />
//                 </button>
//                 </div>
//                 {/* Edit Subject Modal */}
//                 {editingSubject && (
//                     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
//                         <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
//                             <h2 className="text-xl font-semibold mb-4 text-center">Edit Subject</h2>
//                             <form onSubmit={handleUpdateSubject}>
//                                 {subjectError && <div className="text-red-500 text-sm mb-2">{subjectError}</div>}
//                                 <input
//                                     type="text"
//                                     value={editSubject.subject_name}
//                                     onChange={(e) => setEditSubject({ ...editSubject, subject_name: e.target.value })}
//                                     className="w-full px-3 py-2 border rounded-lg mb-2"
//                                     required
//                                 />
//                                 <select
//                                     value={editSubject.department_id}
//                                     onChange={(e) => setEditSubject({ ...editSubject, department_id: e.target.value })}
//                                     className="w-full px-3 py-2 border rounded-lg mb-2"
//                                     required
//                                 >
//                                     <option value="">Select Department</option>
//                                     {departments.map((dept) => (
//                                         <option key={dept.department_id} value={dept.department_id}>
//                                             {dept.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <input
//                                     type="number"
//                                     placeholder="Year"
//                                     value={editSubject.year}
//                                     onChange={(e) => setEditSubject({ ...editSubject, year: e.target.value })}
//                                     className="w-full px-3 py-2 border rounded-lg mb-2"
//                                     required
//                                 />
//                                 <input
//                                     type="number"
//                                     placeholder="Semester (1 or 2)"
//                                     value={editSubject.semester}
//                                     onChange={(e) => setEditSubject({ ...editSubject, semester: e.target.value })}
//                                     className="w-full px-3 py-2 border rounded-lg mb-2"
//                                     required
//                                     min="1"
//                                     max="2"
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder="Section"
//                                     value={editSubject.section}
//                                     onChange={(e) => setEditSubject({ ...editSubject, section: e.target.value })}
//                                     className="w-full px-3 py-2 border rounded-lg mb-2"
//                                     required
//                                 />
//                                 <div className="flex justify-end space-x-2">
//                                     <button
//                                         type="button"
//                                         onClick={() => { setEditingSubject(null); setEditSubject({ subject_id: "", subject_name: "", department_id: "", year: "", section: "", semester: "" }); }}
//                                         className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//                                     >
//                                         Cancel
//                                     </button>
//                                     <button
//                                         type="submit"
//                                         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                                     >
//                                         Save Changes
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 )}
//             </section>
//         </div>
//     );
// };

// export default SubjectsList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const SubjectsList = () => {
    // Departments state
    const [departments, setDepartments] = useState([]);
    const [loadingDepartments, setLoadingDepartments] = useState(true);
    const [departmentError, setDepartmentError] = useState('');

    // Subjects state
    const [subjects, setSubjects] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [subjectError, setSubjectError] = useState('');
    const [newSubject, setNewSubject] = useState({ subject_name: '', department_id: '', year: '', section: '', semester: '' });
    const [editingSubject, setEditingSubject] = useState(null);
    const [editSubject, setEditSubject] = useState({ subject_id: '', subject_name: '', department_id: '', year: '', section: '', semester: '' });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

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

    // Fetch Subjects (with pagination)
    const fetchSubjects = async (page = currentPage, limit = itemsPerPage) => {
        setLoadingSubjects(true);
        setSubjectError('');
        try {
            const token = getAdminToken();
            const response = await axios.get(`http://localhost:3700/api/admin/subjects?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(response.data.subjects);
            setTotalItems(response.data.totalItems);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (err) {
            setSubjectError('Failed to load subjects.');
        } finally {
            setLoadingSubjects(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchSubjects(currentPage, itemsPerPage);
        // eslint-disable-next-line
    }, [currentPage, itemsPerPage]);

    // Create Subject
    const handleCreateSubject = async (e) => {
        e.preventDefault();
        setSubjectError('');
        if (!newSubject.subject_name.trim() || !newSubject.department_id || !newSubject.year || !newSubject.section || !newSubject.semester) {
            setSubjectError('Subject name, department, year, section, and semester are required.');
            return;
        }
        const parsedSemester = parseInt(newSubject.semester);
        if (isNaN(parsedSemester) || parsedSemester < 1 || parsedSemester > 2) {
            setSubjectError('Semester must be 1 or 2.');
            return;
        }
        try {
            const token = getAdminToken();
            const payload = {
                subject_name: newSubject.subject_name,
                department_id: newSubject.department_id,
                year: parseInt(newSubject.year),
                section: newSubject.section,
                semester: parsedSemester,
            };
            await axios.post('http://localhost:3700/api/admin/subjects', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Subject created successfully!');
            setNewSubject({ subject_name: '', department_id: '', year: '', section: '', semester: '' });
            fetchSubjects(currentPage, itemsPerPage);
        } catch (err) {
            setSubjectError(err.response?.data?.message || 'Failed to create subject.');
        }
    };

    // Update Subject
    const handleUpdateSubject = async (e) => {
        e.preventDefault();
        setSubjectError('');
        if (!editSubject.subject_name.trim() || !editSubject.department_id || !editSubject.year || !editSubject.section || !editSubject.semester) {
            setSubjectError('Subject name, department, year, section, and semester are required for update.');
            return;
        }
        const parsedSemester = parseInt(editSubject.semester);
        if (isNaN(parsedSemester) || parsedSemester < 1 || parsedSemester > 2) {
            setSubjectError('Semester must be 1 or 2.');
            return;
        }
        try {
            const token = getAdminToken();
            const payload = {
                subject_name: editSubject.subject_name,
                department_id: editSubject.department_id,
                year: parseInt(editSubject.year),
                section: editSubject.section,
                semester: parsedSemester,
            };
            await axios.put(`http://localhost:3700/api/admin/subjects/${editingSubject.subject_id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Subject updated successfully!');
            setEditingSubject(null);
            setEditSubject({ subject_id: '', subject_name: '', department_id: '', year: '', section: '', semester: '' });
            fetchSubjects(currentPage, itemsPerPage);
        } catch (err) {
            setSubjectError(err.response?.data?.message || 'Failed to update subject.');
        }
    };

    // Delete Subject
    const handleDeleteSubject = async (subjectId) => {
        if (!window.confirm('Are you sure you want to delete this subject?')) return;
        setSubjectError('');
        try {
            const token = getAdminToken();
            await axios.delete(`http://localhost:3700/api/admin/subjects/${subjectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Subject deleted successfully!');
            if (subjects.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchSubjects(currentPage, itemsPerPage);
            }
        } catch (err) {
            setSubjectError(err.response?.data?.message || 'Failed to delete subject.');
        }
    };

    // Pagination
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

    if (loadingDepartments || loadingSubjects) return <div className="text-center text-xl mt-10">Loading Data...</div>;
    if (departmentError || subjectError) return <div className="text-center text-red-500 text-xl mt-10">Error: {departmentError || subjectError}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Manage Subjects</h1>
            <section className="p-4 border rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-center">Subjects List</h2>
                {/* Create Subject Form */}
                <form onSubmit={handleCreateSubject} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-xl font-semibold mb-3">Add New Subject</h3>
                    {subjectError && <div className="text-red-500 text-sm mb-2">{subjectError}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Subject Name"
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
                            placeholder="Year"
                            value={newSubject.year}
                            onChange={(e) => setNewSubject({ ...newSubject, year: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Semester (1 or 2)"
                            value={newSubject.semester}
                            onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
                            min="1"
                            max="2"
                        />
                        <input
                            type="text"
                            placeholder="Section"
                            value={newSubject.section}
                            onChange={(e) => setNewSubject({ ...newSubject, section: e.target.value })}
                            className="px-4 py-2 border rounded-lg"
                            required
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
                                <th className="py-2 px-4 text-left">Semester</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subj) => (
                                <tr key={subj.subject_id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2 px-4">{subj.subject_name}</td>
                                    <td className="py-2 px-4">{subj.department_name}</td>
                                    <td className="py-2 px-4">{subj.year}</td>
                                    <td className="py-2 px-4">{subj.section}</td>
                                    <td className="py-2 px-4">{subj.semester}</td>
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
                                                    semester: subj.semester,
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
                {/* Pagination Controls */}
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
                {/* Edit Subject Modal */}
                {editingSubject && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4 text-center">Edit Subject</h2>
                            <form onSubmit={handleUpdateSubject}>
                                {subjectError && <div className="text-red-500 text-sm mb-2">{subjectError}</div>}
                                <input
                                    type="text"
                                    value={editSubject.subject_name}
                                    onChange={(e) => setEditSubject({ ...editSubject, subject_name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg mb-2"
                                    required
                                />
                                <select
                                    value={editSubject.department_id}
                                    onChange={(e) => setEditSubject({ ...editSubject, department_id: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg mb-2"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map((dept) => (
                                        <option key={dept.department_id} value={dept.department_id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Year"
                                    value={editSubject.year}
                                    onChange={(e) => setEditSubject({ ...editSubject, year: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg mb-2"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Semester (1 or 2)"
                                    value={editSubject.semester}
                                    onChange={(e) => setEditSubject({ ...editSubject, semester: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg mb-2"
                                    required
                                    min="1"
                                    max="2"
                                />
                                <input
                                    type="text"
                                    placeholder="Section"
                                    value={editSubject.section}
                                    onChange={(e) => setEditSubject({ ...editSubject, section: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg mb-2"
                                    required
                                />
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingSubject(null);
                                            setEditSubject({ subject_id: "", subject_name: "", department_id: "", year: "", section: "", semester: "" });
                                        }}
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