import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminLogin from "./pages/auth/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import SubjectsAndDepartments from "./pages/admin/SubjectsAndDepartments.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import FaceRegister from "./pages/faceregister/FaceRegister.jsx";
import Settings from "./pages/settings/Settings.jsx";

// Placeholder pages for other sidebar items:
// const FaceRegister = () => <div>Face Register Page</div>; //
// const Settings = () => <div>Settings Page</div>; //

export default function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const navigate = useNavigate();

  const handleLoginSuccess = (token) => {
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
    navigate('/admin/home');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    navigate('/admin-login');
  };

  const stats = { subjects: 10, students: 100, defaulters: 5, faculty: 8 };

  // This function matches your sidebar navItems
  const handleNavigateTo = (section) => {
    if (section === "Home") navigate("/admin/home");
    if (section === "Subjects") navigate("/admin/subjects");
    if (section === "FaceRegister") navigate("/admin/faceregister");
    if (section === "Settings") navigate("/admin/settings");
  };

  if (!adminToken) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Routes>
      <Route path="/admin-login" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
      <Route
        path="/admin/home"
        element={
          <MainLayout
            currentPage="Home"
            navigateTo={handleNavigateTo}
            title="Dashboard"
            onLogout={handleAdminLogout}
          >
            <Dashboard stats={stats} navigateTo={handleNavigateTo} />
          </MainLayout>
        }
      />
      <Route
        path="/admin/subjects"
        element={
          <MainLayout
            currentPage="Subjects"
            navigateTo={handleNavigateTo}
            title="Subjects"
            onLogout={handleAdminLogout}
          >
            <SubjectsAndDepartments />
          </MainLayout>
        }
      />
      <Route
        path="/admin/faceregister"
        element={
          <MainLayout
            currentPage="FaceRegister"
            navigateTo={handleNavigateTo}
            title="Face Register"
            onLogout={handleAdminLogout}
          >
            <FaceRegister />
          </MainLayout>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <MainLayout
            currentPage="Settings"
            navigateTo={handleNavigateTo}
            title="Settings"
            onLogout={handleAdminLogout}
          >
            <Settings />
          </MainLayout>
        }
      />
      <Route path="/" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
    </Routes>
  );
}