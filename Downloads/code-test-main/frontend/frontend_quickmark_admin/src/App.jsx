import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AdminLogin from "./pages/auth/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";
import FaceRegister from "./pages/faceregister/FaceRegister.jsx";
import Settings from "./pages/settings/Settings.jsx";
import Departments from "./pages/departments/Departments.jsx";
import Students from "./pages/students/StudentsList.jsx";

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
    if (section === "Departments") navigate("/admin/departments");
    if (section === "Subjects") navigate("/admin/subjects-list");
    if (section === "Students") navigate("/admin/students");
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
        path="/admin/subjects-list"
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
        path="/admin/departments"
        element={
          <MainLayout
            currentPage="Departments"
            navigateTo={handleNavigateTo}
            title="Departments"
            onLogout={handleAdminLogout}
          >
            <Departments />
          </MainLayout>
        }
      />
      <Route
        path="/admin/students"
        element={
          <MainLayout
            currentPage="Students"
            navigateTo={handleNavigateTo}
            title="Students"
            onLogout={handleAdminLogout}
          >
            <Students />
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