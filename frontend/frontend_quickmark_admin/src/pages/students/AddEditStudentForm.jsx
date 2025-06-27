// src/pages/students/AddEditStudentForm.jsx
import React, { useState, useEffect } from 'react';

export default function AddEditStudentForm({ student, onSave, onBack }) {
  // Set up state to manage the form's input fields
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    parentEmail: '',
    // --- FIX: Renamed 'year' to 'startYear' ---
    startYear: '',
    department: ''
  });

  // This effect runs when the 'student' prop changes.
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        rollNo: student.rollNo || '',
        email: student.email || '',
        parentEmail: student.parentEmail || '',
        // --- FIX: Use 'startYear' from the student object ---
        startYear: student.startYear || '',
        department: student.department || ''
      });
    } else {
      // Reset form for adding a new student
      setFormData({
        name: '', rollNo: '', email: '', parentEmail: '', startYear: '', department: ''
      });
    }
  }, [student]);

  // This function updates the state whenever a user types in an input field
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };
  
  // This function is called when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(student ? student.id : null, formData);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-lg mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">{student ? `Edit ${student.name}` : 'Add New Student'}</h3>
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Student Name */}
                <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="name">Student Name</label>
                    <input id="name" type="text" value={formData.name} onChange={handleChange} required className="shadow-sm border rounded w-full py-2 px-3"/>
                </div>
                {/* Roll Number */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="rollNo">Roll Number</label>
                    <input id="rollNo" type="text" value={formData.rollNo} onChange={handleChange} required className="shadow-sm border rounded w-full py-2 px-3"/>
                </div>
                {/* --- FIX: Updated label and input for startYear --- */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="startYear">Start Year</label>
                    <input id="startYear" type="number" placeholder="e.g., 2023" value={formData.startYear} onChange={handleChange} required className="shadow-sm border rounded w-full py-2 px-3"/>
                </div>
                {/* Department */}
                <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="department">Department</label>
                    <input id="department" type="text" placeholder="e.g., Science" value={formData.department} onChange={handleChange} required className="shadow-sm border rounded w-full py-2 px-3"/>
                </div>
                {/* Email */}
                <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">Email</label>
                    <input id="email" type="email" value={formData.email} onChange={handleChange} required className="shadow-sm border rounded w-full py-2 px-3"/>
                </div>
                {/* Parent's Email */}
                <div className="md:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="parentEmail">Parent's Email</label>
                    <input id="parentEmail" type="email" value={formData.parentEmail} onChange={handleChange} className="shadow-sm border rounded w-full py-2 px-3"/>
                </div>
            </div>
            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-8">
                <button type="button" onClick={onBack} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600">Cancel</button>
                <button type="submit" className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Save</button>
            </div>
        </form>
    </div>
  );
}