// src/pages/reports/LowAttendance.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LowAttendance() {
    const [defaulters, setDefaulters] = useState([]);
    const [threshold, setThreshold] = useState(75); // Default threshold, will be updated from backend
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to get the admin token from localStorage
    const getAdminToken = () => localStorage.getItem('adminToken');

    const fetchDefaulters = async () => {
        setLoading(true);
        setError(''); // Clear previous errors

        try {
            const token = getAdminToken();
            if (!token) {
                // If no token, it means the user is not authenticated as admin
                // The AdminProtectedRoute in App.jsx should already handle redirection,
                // but this acts as a client-side safeguard.
                setError('Admin not authenticated. Please log in again.');
                setLoading(false);
                return;
            }

            // --- 1. Fetch the attendance threshold from the backend ---
            // This call hits: GET /api/admin/settings/attendance-threshold
            const thresholdRes = await axios.get('http://localhost:3700/api/admin/settings/attendance-threshold', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const currentThreshold = thresholdRes.data.threshold;
            setThreshold(currentThreshold); // Update local state with the actual threshold

            // --- 2. Fetch the pre-calculated defaulters list from the new backend endpoint ---
            // This call hits: GET /api/admin/defaulters
            const defaultersRes = await axios.get('http://localhost:3700/api/admin/defaulters', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Set the received defaulters list
            setDefaulters(defaultersRes.data);
            
        } catch (err) {
            console.error('Error fetching defaulters:', err.response ? err.response.data : err.message);
            // Display specific error from backend if available
            setError(err.response?.data?.message || 'Failed to load defaulters. Please try again.');
            
            // If it's a 401/403, you might want to force a logout/redirect here if App.jsx doesn't catch it
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                // This scenario means the token became invalid/expired or role check failed.
                // The AdminProtectedRoute *should* handle this on next render, but for immediate UX:
                // You could trigger a logout/redirect, e.g., if onLogout were passed as a prop
                // props.onLogout(); // if you pass onLogout from App.jsx
            }

        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    // useEffect to run the fetchDefaulters function when the component mounts
    useEffect(() => {
        fetchDefaulters();
    }, []); // Empty dependency array means it runs once on mount

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
                    <p className="text-center text-gray-500">No defaulters found at or below {threshold}% attendance.</p>
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
                            {/* Map over the actual defaulters data received from the backend */}
                            {defaulters.map((student) => (
                                <tr key={student.student_id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="py-2 px-4">{student.roll_number}</td>
                                    <td className="py-2 px-4">{student.student_name}</td> {/* Use student_name from query */}
                                    <td className="py-2 px-4">{student.department_name || 'N/A'}</td> 
                                    <td className="py-2 px-4">{student.attendance_percentage.toFixed(2)}%</td> {/* Display percentage, format to 2 decimal places */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
