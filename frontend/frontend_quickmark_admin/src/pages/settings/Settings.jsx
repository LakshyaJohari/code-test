import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Settings() {
    const [threshold, setThreshold] = useState(75);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPrinting, setIsPrinting] = useState(false);
    const [printMessage, setPrintMessage] = useState('');
    const [isBackingUp, setIsBackingUp] = useState(false); // New state for backup loading
    const [backupMessage, setBackupMessage] = useState(''); // New state for backup success/error message


    const getAdminToken = () => localStorage.getItem('adminToken');

    const fetchThreshold = async () => {
        setLoading(true);
        setError('');
        try {
            const token = getAdminToken();
            if (!token) {
                setError('Admin not authenticated. Please log in again.');
                setLoading(false);
                return;
            }
            const response = await axios.get('http://localhost:3700/api/admin/settings/attendance-threshold', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setThreshold(response.data.threshold);
        } catch (err) {
            console.error('Error fetching threshold:', err.response?.data?.message || err.message);
            setError('Failed to load attendance threshold.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThreshold();
    }, []);

    const handleUpdateThreshold = async () => {
        setError('');
        if (threshold < 0 || threshold > 100) {
            setError('Threshold must be a number between 0 and 100.');
            return;
        }
        try {
            const token = getAdminToken();
            const response = await axios.put('http://localhost:3700/api/admin/settings/attendance-threshold', { threshold: parseInt(threshold) }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            alert(response.data.message); // Keep alert for threshold update confirmation
            fetchThreshold(); // Re-fetch to update UI after successful save
        } catch (err) {
            console.error('Error updating threshold:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.message || 'Failed to update threshold.');
        }
    };

    const handleBackup = async () => {
        setIsBackingUp(true); // Set loading true
        setBackupMessage(''); // Clear previous message
        try {
            const token = getAdminToken();
            if (!token) {
                setBackupMessage('Admin not authenticated. Please log in again to backup.');
                setIsBackingUp(false);
                return;
            }
            const response = await axios.get('http://localhost:3700/api/admin/backup', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'quickmark_backup.zip'); // Or use filename from Content-Disposition header if provided by backend
            document.body.appendChild(link);
            link.click(); // Trigger download
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            setBackupMessage('Backup initiated successfully!'); // Show success message
        } catch (err) {
            console.error('Error during backup:', err.response ? err.response.data : err.message);
            setBackupMessage(`Backup failed: ${err.response?.data?.message || err.message}`); // Show error message
        } finally {
            setIsBackingUp(false); // Set loading false
        }
    };

    const handlePrintAttendanceSheet = async () => {
        setIsPrinting(true); // Set loading true
        setPrintMessage(''); // Clear previous message
        try {
            const token = getAdminToken();
            if (!token) {
                setPrintMessage('Admin not authenticated. Please log in again to print.');
                setIsPrinting(false);
                return;
            }
            const response = await axios.get('http://localhost:3700/api/admin/attendance-sheet', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            window.open(url, '_blank'); // Open PDF in new tab immediately
            setPrintMessage('Attendance sheet generated successfully!');
        } catch (err) {
            console.error('Error printing attendance sheet:', err.response ? err.response.data : err.message);
            setPrintMessage(`Failed to generate attendance sheet: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsPrinting(false); // Set loading false
        }
    };


    if (loading) return <div className="text-center text-xl mt-10">Loading Settings...</div>;
    if (error) return <div className="text-center text-red-500 text-xl mt-10">Error: {error}</div>;

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-800">Settings</h3>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Backup Data</h4>
                        <p className="text-sm text-gray-500 mt-1">Download a backup of all application data.</p>
                        {isBackingUp && <div className="text-blue-500 text-sm mt-1">Generating backup...</div>} {/* Loading indicator */}
                        {backupMessage && !isBackingUp && <div className={`text-sm mt-1 ${backupMessage.includes('failed') ? 'text-red-500' : 'text-green-600'}`}>{backupMessage}</div>} {/* Message display */}
                    </div>
                    <button onClick={handleBackup} disabled={isBackingUp} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto disabled:opacity-50">
                        Backup
                    </button>
                </div>
                 <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Print Attendance Sheet</h4>
                        <p className="text-sm text-gray-500 mt-1">Generate and print a master attendance sheet.</p>
                        {isPrinting && <div className="text-blue-500 text-sm mt-1">Generating PDF...</div>} {/* Loading indicator */}
                        {printMessage && !isPrinting && <div className={`text-sm mt-1 ${printMessage.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>{printMessage}</div>} {/* Message display */}
                    </div>
                    <button onClick={handlePrintAttendanceSheet} disabled={isPrinting} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 w-full sm:w-auto disabled:opacity-50">
                        Print
                    </button>
                </div>
                 <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Change Attendance Threshold</h4>
                        <p className="text-sm text-gray-500 mt-1">Set the minimum attendance for defaulters.</p>
                        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThreshold(parseInt(e.target.value))}
                            className="w-20 p-2 border rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            min="0"
                            max="100"
                        />
                        <span className="font-bold text-lg text-gray-700">%</span>
                        <button onClick={handleUpdateThreshold} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}