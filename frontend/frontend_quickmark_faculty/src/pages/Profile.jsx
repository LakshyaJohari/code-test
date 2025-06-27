import React from 'react';

const Profile = ({ user, onLogout }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-text-primary mb-8">Profile</h2>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
          {/* Avatar */}
          <img
            className="h-32 w-32 rounded-full object-cover mb-6 md:mb-0 md:mr-8 border-4 border-gray-200"
            src={user.avatar}
            alt="User Avatar"
            onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/128x128/E2E8F0/4A5568?text=U"; }}
          />

          {/* User Info */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary">{user.name}</h3>
            <p className="text-text-secondary text-lg mt-1">{user.designation}</p>
            
            <div className="mt-8 border-t border-border-color pt-6">
              <h4 className="font-semibold text-text-primary mb-3">Subjects Taught</h4>
              <ul className="space-y-2">
                {user.subjectsTaught.map((subject, index) => (
                  <li key={index} className="text-text-secondary">{subject}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-border-color text-center">
            <button 
                onClick={onLogout}
                className="px-8 py-3 bg-gray-100 text-text-secondary font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
                Logout
            </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
