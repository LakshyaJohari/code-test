// src/pages/settings/Settings.jsx
import React from 'react';

export default function Settings() {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-gray-800">Settings</h3>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Backup Data</h4>
                        <p className="text-sm text-gray-500 mt-1">Download a backup of all application data.</p>
                    </div>
                    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto">
                        Backup
                    </button>
                </div>
                 <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Print Attendance Sheet</h4>
                        <p className="text-sm text-gray-500 mt-1">Generate and print a master attendance sheet.</p>
                    </div>
                    <button className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 w-full sm:w-auto">
                        Print
                    </button>
                </div>
                 <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg gap-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">Change Attendance Threshold</h4>
                        <p className="text-sm text-gray-500 mt-1">Set the minimum attendance for defaulters.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="number" defaultValue="75" className="w-20 p-2 border rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                        <span className="font-bold text-lg text-gray-700">%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
