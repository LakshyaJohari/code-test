import React from 'react';
import { UserCheck, BookOpen } from 'lucide-react';

const Dashboard = ({ user, onNavigate, onStartAttendance }) => {
  return (
    <div className="w-full"    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text-primary">
          Welcome, {user.name}
        </h2>
        
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mark Attendance Card */}
        <div 
          onClick={onStartAttendance}
          className="group relative bg-cover bg-center rounded-lg shadow-md p-8 flex items-end h-64 cursor-pointer transition-transform transform hover:-translate-y-1"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1523289217630-0dd1618426e4?q=80&w=2070&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg group-hover:bg-opacity-60 transition-all duration-300"></div>
          <div className="relative z-10">
            <UserCheck className="h-10 w-10 text-white mb-3" />
            <h3 className="text-3xl font-bold text-white">Mark Attendance</h3>
            <p className="text-white opacity-90 mt-1">Start a new attendance session.</p>
          </div>
        </div>

        {/* View Subjects Card */}
        <div 
          onClick={() => onNavigate('/subjects')}
          className="group relative bg-cover bg-center rounded-lg shadow-md p-8 flex items-end h-64 cursor-pointer transition-transform transform hover:-translate-y-1"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg group-hover:bg-opacity-60 transition-all duration-300"></div>
          <div className="relative z-10">
            <BookOpen className="h-10 w-10 text-white mb-3" />
            <h3 className="text-3xl font-bold text-white">View Subjects</h3>
            <p className="text-white opacity-90 mt-1">See details and history for your subjects.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
