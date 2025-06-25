// src/pages/subjects/AddEditSubjectModal.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';

// A new, reusable component for a searchable dropdown
const SearchableDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    // This handles clicks outside of the dropdown to close it
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);
  
  const filteredOptions = useMemo(
    () => options.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase())),
    [options, searchTerm]
  );

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 border rounded-md bg-white text-left flex justify-between items-center"
      >
        <span>{value || <span className="text-gray-500">{placeholder}</span>}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 top-full mt-1 w-full bg-white rounded-md shadow-lg border">
          <div className="p-2">
            <div className="relative">
              <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 border rounded-md"
              />
            </div>
          </div>
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.map(option => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50"
                >
                  {option}
                </button>
              </li>
            ))}
             {filteredOptions.length === 0 && <p className="text-center text-gray-500 py-2">No results found.</p>}
          </ul>
        </div>
      )}
    </div>
  );
};


// The main modal component, now using the searchable dropdown
export default function AddEditSubjectModal({ subject, allDepartments, allFaculty, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    faculty: '',
    startYear: new Date().getFullYear(),
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name || '',
        department: subject.department || '',
        faculty: subject.faculty || '',
        startYear: subject.startYear || new Date().getFullYear(),
      });
    }
  }, [subject]);

  const departmentNames = useMemo(() => allDepartments.map(d => d.name), [allDepartments]);
  const facultyNames = useMemo(() => allFaculty.map(f => f.name), [allFaculty]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTextChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.department || !formData.faculty) {
      alert("Please fill out all fields.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{subject ? 'Edit Subject' : 'Add New Subject'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleTextChange} required className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <SearchableDropdown
                options={departmentNames}
                value={formData.department}
                onChange={(value) => handleChange('department', value)}
                placeholder="Select a department"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Faculty</label>
               <SearchableDropdown
                options={facultyNames}
                value={formData.faculty}
                onChange={(value) => handleChange('faculty', value)}
                placeholder="Select a faculty member"
              />
            </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Subject</button>
          </div>
        </form>
      </div>
    </div>
  );
}