// src/pages/faculty/AddEditFacultyModal.jsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function AddEditFacultyModal({ facultyMember, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    designation: ''
  });

  useEffect(() => {
    if (facultyMember) {
      setFormData(facultyMember);
    }
  }, [facultyMember]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{facultyMember ? 'Edit Faculty' : 'Add New Faculty'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md" placeholder="e.g., Dr. John Doe"/>
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input type="text" name="department" id="department" value={formData.department} onChange={handleChange} required className="w-full p-2 border rounded-md" placeholder="e.g., Computer Science"/>
            </div>
            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <input type="text" name="designation" id="designation" value={formData.designation} onChange={handleChange} required className="w-full p-2 border rounded-md" placeholder="e.g., Professor"/>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Faculty</button>
          </div>
        </form>
      </div>
    </div>
  );
}
