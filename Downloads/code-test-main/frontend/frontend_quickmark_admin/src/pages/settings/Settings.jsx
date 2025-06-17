import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Settings() {
    const [threshold, setThreshold] = useState(75);
    const [saving, setSaving] = useState(false);

    // Fetch threshold from backend on mount
    useEffect(() => {
        const fetchThreshold = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get('http://localhost:3700/api/admin/settings/attendance-threshold', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && typeof res.data.threshold === "number") {
                    setThreshold(res.data.threshold);
                }
            } catch (err) {
                // Optionally handle error
            }
        };
        fetchThreshold();
    }, []);

    // Backup handler
    const handleBackup = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:3700/api/admin/backup', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'backup.zip');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Backup failed.');
        }
    };

    // Print handler
    const handlePrint = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:3700/api/admin/attendance-sheet', {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            window.open(url, '_blank');
        } catch (err) {
            alert('Failed to generate attendance sheet.');
        }
    };

    // Save threshold handler
    const handleThresholdChange = (e) => setThreshold(Number(e.target.value));

    const saveThreshold = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(
                'http://localhost:3700/api/admin/settings/attendance-threshold',
                { threshold: Number(threshold) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Threshold updated!');
        } catch (err) {
            alert('Failed to update threshold.');
        }
        setSaving(false);
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-800">Settings</h3>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Backup Data</h4>
                        <p className="text-sm text-gray-500 mt-1">Download a backup of all application data.</p>
                    </div>
                    <button
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
                        onClick={handleBackup}
                    >
                        Backup
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Print Attendance Sheet</h4>
                        <p className="text-sm text-gray-500 mt-1">Generate and print a master attendance sheet.</p>
                    </div>
                    <button
                        className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 w-full sm:w-auto"
                        onClick={handlePrint}
                    >
                        Print
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Change Attendance Threshold</h4>
                        <p className="text-sm text-gray-500 mt-1">Set the minimum attendance for defaulters.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            value={threshold}
                            onChange={handleThresholdChange}
                            className="w-20 p-2 border rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <span className="font-bold text-lg text-gray-700">%</span>
                        <button
                            className="ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            onClick={saveThreshold}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}