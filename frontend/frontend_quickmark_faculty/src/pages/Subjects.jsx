import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronRight, Filter, X } from 'lucide-react';

// --- Filter Dropdown Sub-Component ---
const FilterDropdown = ({ subjects, activeFilters, onFilterChange, onClear, onClose }) => {
    const dropdownRef = useRef(null);

    // Get unique options for each filter from the subjects data
    const filterOptions = useMemo(() => {
        const years = [...new Set(subjects.map(s => s.year))].sort();
        const departments = [...new Set(subjects.map(s => s.department))].sort();
        const sections = [...new Set(subjects.map(s => s.section))].sort();
        return { years, departments, sections };
    }, [subjects]);

    // Close dropdown if clicked outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef, onClose]);

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        onFilterChange(name, value);
    };

    return (
        <div ref={dropdownRef} className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border z-10 p-4">
            <h4 className="font-semibold mb-4">Filter Subjects</h4>
            
            {/* Year Filter */}
            <div className="mb-4">
                <label htmlFor="year" className="block text-sm font-medium text-text-secondary mb-1">Year</label>
                <select name="year" id="year" value={activeFilters.year} onChange={handleSelectChange} className="w-full p-2 border border-border-color rounded-md">
                    <option value="">All Years</option>
                    {filterOptions.years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
            </div>

            {/* Department Filter */}
            <div className="mb-4">
                <label htmlFor="department" className="block text-sm font-medium text-text-secondary mb-1">Department</label>
                <select name="department" id="department" value={activeFilters.department} onChange={handleSelectChange} className="w-full p-2 border border-border-color rounded-md">
                    <option value="">All Departments</option>
                    {filterOptions.departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
            </div>

            {/* Section Filter */}
            <div className="mb-4">
                <label htmlFor="section" className="block text-sm font-medium text-text-secondary mb-1">Section</label>
                <select name="section" id="section" value={activeFilters.section} onChange={handleSelectChange} className="w-full p-2 border border-border-color rounded-md">
                    <option value="">All Sections</option>
                    {filterOptions.sections.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                </select>
            </div>

            <button onClick={onClear} className="w-full text-sm text-primary hover:underline">Clear All Filters</button>
        </div>
    );
};


// --- Main Subjects Component ---
const Subjects = ({ subjects, onSelectSubject }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        year: '',
        department: '',
        section: ''
    });

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const clearFilters = () => {
        setFilters({ year: '', department: '', section: '' });
    };

    // Filter the subjects based on the current filter state
    const filteredSubjects = useMemo(() => {
        return subjects.filter(subject => {
            return (filters.year ? subject.year == filters.year : true) &&
                   (filters.department ? subject.department === filters.department : true) &&
                   (filters.section ? subject.section === filters.section : true);
        });
    }, [subjects, filters]);

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Subjects</h2>
                    <p className="text-text-secondary mt-1">Click on a subject to view student details and attendance.</p>
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setShowFilters(!showFilters)} 
                        className="flex items-center px-4 py-2 border border-border-color rounded-lg text-text-secondary hover:bg-gray-50"
                    >
                        <Filter size={18} className="mr-2"/>
                        Filter
                    </button>
                    {showFilters && (
                        <FilterDropdown 
                            subjects={subjects} 
                            activeFilters={filters}
                            onFilterChange={handleFilterChange}
                            onClear={clearFilters}
                            onClose={() => setShowFilters(false)}
                        />
                    )}
                </div>
            </div>

            {/* Subjects List Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Subject Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Year</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Section</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-color">
                            {filteredSubjects.map((subject) => (
                                <tr 
                                    key={subject.id} 
                                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                                    onClick={() => onSelectSubject(subject)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-text-primary">{subject.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{subject.year}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{subject.section}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{subject.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <ChevronRight size={20} className="text-gray-400"/>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Subjects;
