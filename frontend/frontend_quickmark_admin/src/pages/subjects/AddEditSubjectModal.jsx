// src/pages/subjects/AddEditSubjectModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AddEditSubjectModal({ subject, onClose, onSave }) {
  // Initialize state with the subject prop, or empty if it's a new subject
  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear(), // Default to current year
    section: 'A',
    department: '',
    faculty: ''
  });

  useEffect(() => {
    // If we are editing an existing subject, populate the form
    if (subject) {
      setFormData({
        name: subject.name || '',
        year: subject.year || new Date().getFullYear(),
        section: subject.section || 'A',
        department: subject.department || '',
        faculty: subject.faculty || ''
      });
    }
  }, [subject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Pass the form data to the parent to handle saving
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{subject ? 'Edit Subject' : 'Add New Subject'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Subject Name */}
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input type="number" name="year" id="year" value={formData.year} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input type="text" name="department" id="department" value={formData.department} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
            {/* Faculty */}
            <div className="sm:col-span-2">
              <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
              <input type="text" name="faculty" id="faculty" value={formData.faculty} onChange={handleChange} required className="w-full p-2 border rounded-md" />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Subject</button>
          </div>
        </form>
      </div>
    </div>
  );
}
