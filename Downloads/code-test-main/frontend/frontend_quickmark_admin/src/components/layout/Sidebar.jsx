import { NavLink } from 'react-router-dom';

const navItems = [
  { label: "Home", path: "/admin/home" },
  { label: "Departments", path: "/admin/departments" },
  { label: "Subjects", path: "/admin/subjects" },
  { label: "FaceRegister", path: "/admin/faceregister" },
  { label: "Settings", path: "/admin/settings" }
];

export default function Sidebar({ onLogout }) {
  return (
    <nav className="flex flex-col h-full bg-white shadow-lg p-4">
      {/* QuickMark at the top */}
      <div className="mb-6 flex items-center gap-2">
        <NavLink
          to="/admin/quickmark"
          className={({ isActive }) =>
            "flex items-center gap-2 " +
            (isActive ? "font-bold text-green-600" : "text-gray-700")
          }
        >
          {/* Example icon (barcode/QR) */}
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="3" width="4" height="4" fill="#10B981"/>
            <rect x="17" y="3" width="4" height="4" fill="#10B981"/>
            <rect x="3" y="17" width="4" height="4" fill="#10B981"/>
            <rect x="17" y="17" width="4" height="4" fill="#10B981"/>
          </svg>
          QuickMark
        </NavLink>
      </div>
      {/* Main nav */}
      <ul className="flex-1 space-y-2">
        {navItems.map(item => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "font-bold text-blue-600" : "text-gray-700"
              }
              end
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      {/* Logout at the bottom */}
      <div className="mt-auto pt-8">
        <button
          onClick={onLogout}
          className="text-red-600 hover:underline w-full text-left"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}