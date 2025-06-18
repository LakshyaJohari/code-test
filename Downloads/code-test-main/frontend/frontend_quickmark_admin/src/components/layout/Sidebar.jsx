// src/components/common/Sidebar.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaBuilding, FaBook, FaUserGraduate, FaChalkboardTeacher, FaQrcode, FaUserTimes, FaCog } from 'react-icons/fa';
import { GanttChartSquare } from 'lucide-react';

const navItems = [
  { label: "Home", path: "/admin/home", Icon: FaHome },
  { label: "Departments", path: "/admin/departments", Icon: FaBuilding },
  { label: "Subjects", path: "/admin/subjects-list", Icon: FaBook },
  { label: "Students", path: "/admin/students-list", Icon: FaUserGraduate },
  { label: "Faculty", path: "/admin/faculty-list", Icon: FaChalkboardTeacher },
  { label: "Defaulters", path: "/admin/defaulters-list", Icon: FaUserTimes }, // <-- CHANGE THIS LINE
  { label: "FaceRegister", path: "/admin/face-register", Icon: FaQrcode }, // This already matches App.jsx, but ensure consistency
  { label: "Settings", path: "/admin/settings", Icon: FaCog }
];

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white flex-shrink-0 border-r border-gray-200 flex flex-col hidden md:flex">
      {/* QuickMark Logo/Text at the top */}
      <div className="h-16 flex items-center justify-start px-6 border-b border-gray-200">
        <NavLink
          to="/admin/home"
          className="flex items-center gap-2 text-gray-800 font-bold text-xl"
        >
          <GanttChartSquare className="h-6 w-6 text-primary" />
          QuickMark
        </NavLink>
      </div>
      {/* Main nav */}
      <nav className="flex-1 px-4 py-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 my-1 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`
                }
                // 'end' prop helps with active link matching for parent paths like /admin/home vs /admin/home/subpath
                end={item.path === "/admin/home" || item.path === "/admin/departments"} 
              >
                <item.Icon className="mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {/* Logout at the bottom */}
      <div className="px-6 pb-4 pt-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 0 001.414 1.414l3-3a1 0 000-1.414l-3-3a1 0 10-1.414 1.414L14.586 9H7a1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}