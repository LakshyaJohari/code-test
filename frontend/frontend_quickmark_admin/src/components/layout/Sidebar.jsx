// src/components/layout/Sidebar.jsx
import React from 'react';

// The component now accepts an `onLogout` function prop
export default function Sidebar({ currentPage, navigateTo, onLogout }) {
  const navItems = ['Home', 'Subjects', 'FaceRegister', 'Settings'];

  const getIcon = (item) => {
    switch(item) {
        case 'Home': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
        case 'Subjects': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 005.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0014.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" /></svg>;
        case 'FaceRegister': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
        case 'Settings': return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01-.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
        default: return null;
    }
  }

  return (
    <aside className="w-64 bg-white flex-shrink-0 border-r border-gray-200 flex flex-col hidden md:flex">
       <div className="h-16 flex items-center justify-start px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">QuickMark</h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item}>
              <button
                onClick={() => navigateTo(item)}
                className={`w-full flex items-center px-4 py-2 my-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  currentPage === item
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-3">{getIcon(item)}</span>
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-6 pb-4">
          {/* The onClick event now calls the onLogout function */}
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
              Logout
          </button>
      </div>
    </aside>
  );
}
