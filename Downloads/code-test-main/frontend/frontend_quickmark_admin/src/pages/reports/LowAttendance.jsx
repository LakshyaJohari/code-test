import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LowAttendance() {
    const [defaulters, setDefaulters] = useState([]);
    const [threshold, setThreshold] = useState(75);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getAdminToken = () => localStorage.getItem('adminToken');

    const fetchDefaulters = async () => {
        setLoading(true);
        setError('');
        try {
            const token = getAdminToken();
            if (!token) {
                setError('Admin not authenticated. Please log in again.');
                setLoading(false);
                return;
            }

            const thresholdRes = await axios.get('http://localhost:3700/api/admin/settings/attendance-threshold', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const currentThreshold = thresholdRes.data.threshold;
            setThreshold(currentThreshold);

            const studentsRes = await axios.get('http://localhost:3700/api/admin/students', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const allStudents = studentsRes.data;
            const mockDefaulters = allStudents.filter(s => s.roll_number === 'IEC2023021' || s.roll_number === 'IEC2023022');
            
            setDefaulters(mockDefaulters);
            
        } catch (err) {
            console.error('Error fetching defaulters:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to load defaulters.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDefaulters();
    }, []);

    if (loading) return <div className="text-center text-xl mt-10">Loading Defaulters...</div>;
    if (error) return <div className="text-center text-red-500 text-xl mt-10">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Low Attendance (Defaulters)</h1>

            <div className="mb-6 p-4 border rounded-lg shadow-sm bg-yellow-50 text-yellow-800 text-center">
                <p className="text-lg font-semibold">Current Defaulter Threshold: {threshold}%</p>
                <p className="text-sm mt-1">Students with attendance below this percentage are considered defaulters.</p>
            </div>

            <div className="p-4 border rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Defaulters List</h2>
                {defaulters.length === 0 ? (
                    <p className="text-center text-gray-500">No defaulters found.</p>
                ) : (
                    <table className="min-w-full bg-white border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="py-2 px-4 text-left">Roll No.</th>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Department</th>
                                <th className="py-2 px-4 text-left">Attendance %</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {defaulters.map((student) => (
                                <tr key={student.student_id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2 px-4">{student.roll_number}</td>
                                    <td className="py-2 px-4">{student.name}</td>
                                    <td className="py-2 px-4">{student.department_name || 'N/A'}</td> 
                                    <td className="py-2 px-4">{student.attendance || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}