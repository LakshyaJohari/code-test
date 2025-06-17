// src/pages/faceregister/FaceRegister.jsx
import React, { useState } from 'react';
import { List, LayoutGrid } from 'lucide-react';

// Mock student data for demonstration.
const mockStudents = [
  { id: 101, name: 'Sophia Clark', rollNo: '101', imageUrl: 'https://placehold.co/150x150/E8F0FE/4285F4?text=Sophia' },
  { id: 102, name: 'Ethan Miller', rollNo: '102', imageUrl: 'https://placehold.co/150x150/E9F5E9/34A853?text=Ethan' },
  { id: 103, name: 'Olivia Davis', rollNo: '103', imageUrl: 'https://placehold.co/150x150/FEF7E0/FBBC05?text=Olivia' },
  { id: 104, name: 'Liam Wilson', rollNo: '104', imageUrl: 'https://placehold.co/150x150/FCE8E6/EA4335?text=Liam' },
  { id: 105, name: 'Ava Taylor', rollNo: '105', imageUrl: 'https://placehold.co/150x150/E8E8E8/666666?text=Ava' },
  { id: 106, name: 'Noah Anderson', rollNo: '106', imageUrl: 'https://placehold.co/150x150/D1C4E9/673AB7?text=Noah' },
  { id: 107, name: 'Isabella Thomas', rollNo: '107', imageUrl: 'https://placehold.co/150x150/C8E6C9/4CAF50?text=Isabella' },
];


export default function FaceRegister() {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('tile'); // 'tile' or 'list'

    // Filter students based on the search term
    const filteredStudents = mockStudents.filter(student =>
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            {/* Header Section with Search Bar and View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-semibold text-gray-800">Face Registration</h3>
                <div className="flex items-center space-x-2">
                    {/* View Toggle Buttons */}
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                        aria-label="List view"
                    >
                        <List size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('tile')}
                        className={`p-2 rounded-md ${viewMode === 'tile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                        aria-label="Tile view"
                    >
                        <LayoutGrid size={20} />
                    </button>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Conditional Rendering of Views */}
            {viewMode === 'tile' ? (
                // --- TILE VIEW ---
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredStudents.map((student) => (
                        <div key={student.id} className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-center p-4 transform hover:-translate-y-1 transition-transform duration-300">
                            <img
                                src={student.imageUrl}
                                alt={`Face of ${student.name}`}
                                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x150/cccccc/ffffff?text=Error'; }}
                            />
                            <h4 className="text-lg font-bold text-gray-900 truncate">{student.name}</h4>
                            <p className="text-sm text-gray-500 mb-4">Roll No: {student.rollNo}</p>
                            <button className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                                Edit Face
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                // --- LIST VIEW ---
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="py-3 px-4 font-semibold text-gray-600">Photo</th>
                                <th className="py-3 px-4 font-semibold text-gray-600">Student Name</th>
                                <th className="py-3 px-4 font-semibold text-gray-600">Roll No.</th>
                                <th className="py-3 px-4 font-semibold text-gray-600 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="border-b hover:bg-gray-50">
                                    <td className="py-2 px-4">
                                        <img src={student.imageUrl} alt={student.name} className="w-12 h-12 rounded-full object-cover"/>
                                    </td>
                                    <td className="py-2 px-4 font-medium text-gray-800">{student.name}</td>
                                    <td className="py-2 px-4 text-gray-600">{student.rollNo}</td>
                                    <td className="py-2 px-4 text-right">
                                        <button className="text-blue-600 hover:underline font-semibold">Edit Face</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Message to show when no students are found */}
            {filteredStudents.length === 0 && (
                <div className="text-center py-12 col-span-full">
                    <p className="text-gray-500">No students found matching "{searchTerm}".</p>
                </div>
            )}
        </div>
    );
}
