import React from 'react';
import { NavLink } from 'react-router-dom';
// Import icons from react-icons/fa
import { FaHome, FaBuilding, FaBook, FaUserGraduate, FaChalkboardTeacher, FaQrcode, FaUserTimes, FaCog } from 'react-icons/fa';

// Sidebar accepts onLogout prop
export default function Sidebar({ onLogout }) {
  const navItems = [
    { label: "Home", path: "/admin/home", icon: <FaHome /> }, // Link to Dashboard
    { label: "Departments", path: "/admin/departments", icon: <FaBuilding /> }, // Link to Admin Departments page
    { label: "Subjects", path: "/admin/subjects-list", icon: <FaBook /> }, // Link to Combined Subjects/Departments list
    { label: "Students", path: "/admin/students-list", icon: <FaUserGraduate /> }, // Conceptual: Link to Admin Students page
    { label: "Faculty", path: "/admin/faculty-list", icon: <FaChalkboardTeacher /> }, // Conceptual: Link to Admin Faculty page
    { label: "Registered Faces", path: "/admin/faceregister", icon: <FaQrcode /> }, // Conceptual: Link to FaceRegister page
    { label: "Defaulters", path: "/admin/defaulters", icon: <FaUserTimes /> }, // Conceptual: Link to Defaulters page
    { label: "Settings", path: "/admin/settings", icon: <FaCog /> } // Conceptual: Link to Settings page
  ];

  return (
    <aside className="w-64 bg-white flex-shrink-0 border-r border-gray-200 flex flex-col hidden md:flex"> {/* Changed to aside for semantic HTML */}
      {/* QuickMark Logo/Text at the top */}
      <div className="h-16 flex items-center justify-start px-6 border-b border-gray-200">
        <NavLink
          to="/admin/home" // Link QuickMark logo to Admin Dashboard Home
          className="flex items-center gap-2 text-gray-800 font-bold text-xl"
        >
          {/* This is a placeholder for your actual logo/icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h14v14H5V5zm6 2v2h2v-2h-2zm-4 4v2h2v-2H7zm8 0v2h2v-2h-2zm-4 4v2h2v-2h-2z" />
          </svg>
          QuickMark
        </NavLink>
      </div>
      {/* Main nav */}
      <nav className="flex-1 px-4 py-4"> {/* Changed to nav for semantic HTML */}
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) => // NavLink handles active state
                  `flex items-center px-4 py-2 my-1 text-sm font-medium rounded-lg transition-colors duration-200 
                  ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-200'}`
                }
                end={item.label === "Home" || item.label === "Departments"} // Use 'end' for exact match on specific paths
              >
                <span className="mr-3">{item.icon}</span> {/* Render the imported icon */}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {/* Logout at the bottom */}
      <div className="px-6 pb-4 pt-4 border-t border-gray-200"> {/* Added border-t for thin line */}
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}