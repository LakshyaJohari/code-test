// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// const AdminDepartmentsPage = () => {
//     const [departments, setDepartments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [newDepartmentName, setNewDepartmentName] = useState('');
//     const [editingDepartment, setEditingDepartment] = useState(null); // Stores department being edited {id, name}
//     const [editDepartmentName, setEditDepartmentName] = useState('');

//     const getAdminToken = () => localStorage.getItem('adminToken');

//     const fetchDepartments = async () => {
//         setLoading(true);
//         setError('');
//         try {
//             const token = getAdminToken();
//             if (!token) {
//                 setError('Admin not authenticated. Please log in again.');
//                 setLoading(false);
//                 return;
//             }
//             const response = await axios.get('http://localhost:3700/api/admin/departments', {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             console.log('DepartmentsManager: Fetched Departments Data:', response.data); // DEBUG LOG
//             setDepartments(response.data);
//         } catch (err) {
//             console.error('DepartmentsManager: Error fetching departments:', err.response ? err.response.data : err.message);
//             setError(err.response?.data?.message || 'Failed to load departments. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         console.log('DepartmentsManager: Component mounted/re-rendered'); // DEBUG LOG
//         fetchDepartments();
//     }, []);

//     useEffect(() => {
//         console.log('DepartmentsManager: Current Departments State:', departments); // DEBUG LOG
//     }, [departments]);

//     const handleCreateDepartment = async (e) => {
//         e.preventDefault();
//         setError('');
//         if (!newDepartmentName.trim()) {
//             setError('Department name cannot be empty.');
//             return;
//         }
//         try {
//             const token = getAdminToken();
//             const response = await axios.post('http://localhost:3700/api/admin/departments', {
//                 name: newDepartmentName
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             alert(response.data.message);
//             setNewDepartmentName('');
//             fetchDepartments();
//         } catch (err) {
//             console.error('Error creating department:', err.response ? err.response.data : err.message);
//             setError(err.response?.data?.message || 'Failed to create department.');
//         }
//     };

//     const handleUpdateDepartment = async (e) => {
//         e.preventDefault();
//         setError('');
//         if (!editDepartmentName.trim()) {
//             setError('Department name cannot be empty.');
//             return;
//         }
//         try {
//             const token = getAdminToken();
//             const response = await axios.put(`http://localhost:3700/api/admin/departments/${editingDepartment.department_id}`, {
//                 name: editDepartmentName
//             }, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });
//             alert(response.data.message);
//             setEditingDepartment(null);
//             setEditDepartmentName('');
//             fetchDepartments();
//         } catch (err) {
//             console.error('Error updating department:', err.response ? err.response.data : err.message);
//             setError(err.response?.data?.message || 'Failed to update department.');
//         }
//     };

//     const handleDeleteDepartment = async (departmentId) => {
//         if (!window.confirm('Are you sure you want to delete this department?')) {
//             return;
//         }
//         setError('');
//         try {
//             const token = getAdminToken();
//             const response = await axios.delete(`http://localhost:3700/api/admin/departments/${departmentId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             });
//             alert(response.data.message);
//             fetchDepartments();
//         } catch (err) {
//             console.error('Error deleting department:', err.response ? err.response.data : err.message);
//             if (err.response?.status === 409) {
//                 setError('Cannot delete department: It still has associated records (e.g., faculties, students, subjects).');
//             } else {
//                 setError(err.response?.data?.message || 'Failed to delete department.');
//             }
//         }
//     };

//     if (loading) return <div className="text-center text-xl mt-10">Loading Departments...</div>;
//     if (error) return <div className="text-center text-red-500 text-xl mt-10">Error: {error}</div>;

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-3xl font-bold mb-6 text-center">Manage Departments (Branches)</h1>

//             {/* Create Department Form */}
//             <form onSubmit={handleCreateDepartment} className="mb-8 p-4 border rounded-lg shadow-sm">
//                 <h2 className="text-xl font-semibold mb-4">Add New Department (Branch)</h2>
//                 <div className="flex items-end space-x-2">
//                     <input
//                         type="text"
//                         placeholder="Department Name (e.g., Physics)"
//                         value={newDepartmentName}
//                         onChange={(e) => setNewDepartmentName(e.target.value)}
//                         className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         required
//                     />
//                     <button
//                         type="submit"
//                         className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
//                     >
//                         <PlusCircle size={20} className="mr-2" /> Add
//                     </button>
//                 </div>
//             </form>

//             {/* Departments List */}
//             <div className="p-4 border rounded-lg shadow-sm">
//                 <h2 className="text-xl font-semibold mb-4">Existing Departments (Branches)</h2>
//                 {departments.length === 0 ? (
//                     <p className="text-center text-gray-500">No departments found.</p>
//                 ) : (
//                     <table className="min-w-full bg-white border-collapse">
//                         <thead>
//                             <tr className="bg-gray-100 border-b">
//                                 <th className="py-2 px-4 text-left">Name</th>
//                                 <th className="py-2 px-4 text-left">ID</th>
//                                 <th className="py-2 px-4 text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {departments.map((dept) => (
//                                 <tr key={dept.department_id} className="border-b last:border-b-0 hover:bg-gray-50">
//                                     <td className="py-2 px-4">{dept.name}</td>
//                                     <td className="py-2 px-4 text-xs text-gray-500">{dept.department_id}</td>
//                                     <td className="py-2 px-4 flex space-x-2">
//                                         <button
//                                             onClick={() => { setEditingDepartment(dept); setEditDepartmentName(dept.name); }}
//                                             className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100"
//                                             title="Edit"
//                                         >
//                                             <Edit size={18} />
//                                         </button>
//                                         <button
//                                             onClick={() => handleDeleteDepartment(dept.department_id)}
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

//             {/* Edit Department Modal/Form */}
//             {editingDepartment && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
//                     <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
//                         <h2 className="text-xl font-semibold mb-4">Edit Department</h2>
//                         <form onSubmit={handleUpdateDepartment}>
//                             <div className="mb-4">
//                                 <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-2">
//                                     Department Name
//                                 </label>
//                                 <input
//                                     type="text"
//                                     id="editName"
//                                     value={editDepartmentName}
//                                     onChange={(e) => setEditDepartmentName(e.target.value)}
//                                     className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     required
//                                 />
//                             </div>
//                             <div className="flex justify-end space-x-2">
//                                 <button
//                                     type="button"
//                                     onClick={() => { setEditingDepartment(null); setEditDepartmentName(''); }}
//                                     className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                                 >
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

// export default AdminDepartmentsPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchDepartments = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:3700/api/admin/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
    } catch (err) {
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        "http://localhost:3700/api/admin/departments",
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewName("");
      fetchDepartments();
    } catch {
      setError("Failed to create department.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:3700/api/admin/departments/${editing.department_id}`,
        { name: editName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(null);
      setEditName("");
      fetchDepartments();
    } catch {
      setError("Failed to update department.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `http://localhost:3700/api/admin/departments/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDepartments();
    } catch {
      setError("Failed to delete department.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Departments</h2>
      {/* Create */}
      <form onSubmit={handleCreate} className="mb-4 flex gap-2">
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="New Department Name"
          className="border px-2 py-1 rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded flex items-center">
          <PlusCircle size={18} className="mr-1" /> Add
        </button>
      </form>
      {/* List */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.department_id} className="border-t">
              <td className="py-2 px-4">{dept.name}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  onClick={() => { setEditing(dept); setEditName(dept.name); }}
                  className="text-blue-600"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(dept.department_id)}
                  className="text-red-600"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow">
            <h3 className="mb-2 font-semibold">Edit Department</h3>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="border px-2 py-1 rounded mb-2 w-full"
              required
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditing(null)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

