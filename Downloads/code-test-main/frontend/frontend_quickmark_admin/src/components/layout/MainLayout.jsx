// src/components/layout/MainLayout.jsx
import React from 'react';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

// It now accepts `onLogout` as a prop
export default function MainLayout({ children, currentPage, navigateTo, title, showBackButton, onBack, onLogout }) {
  return (
    <div className="flex h-screen bg-white font-sans">
      {/* And passes `onLogout` down to the Sidebar */}
      <Sidebar currentPage={currentPage} navigateTo={navigateTo} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* It ALSO passes `onLogout` down to the Topbar */}
        <Topbar title={title} showBackButton={showBackButton} onBack={onBack} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
