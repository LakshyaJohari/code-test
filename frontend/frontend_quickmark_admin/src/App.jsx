import React, { useState } from "react";
import { Routes, Route, useNavigate, Outlet, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import AdminDepartmentsPage from "./pages/admin/AdminDepartmentsPage.jsx";
import Subjects from "./pages/subjects/SubjectsList.jsx";
import Students from "./pages/students/StudentsList.jsx";
import Faculty from "./pages/faculty/FacultyList.jsx";
import DefaultersList from "./pages/reports/LowAttendance.jsx";
import Settings from "./pages/settings/Settings.jsx";
import FaceRegister from "./pages/faceregister/FaceRegister.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import MainLayout from "./components/layout/MainLayout.jsx";

export default function App() {
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
    const navigate = useNavigate();

    const handleLoginSuccess = (token) => {
        localStorage.setItem('adminToken', token);
        setAdminToken(token);
        navigate('/admin/home');
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('adminToken');
        setAdminToken(null);
        navigate('/admin/login');
    };

    // Use Outlet for nested routes
    const AdminProtectedRoute = () => {
        if (!adminToken) {
            return <Login onLoginSuccess={handleLoginSuccess} />;
        }
        return <MainLayout onLogout={handleAdminLogout}><Outlet /></MainLayout>;
    };

    return (
        <Routes>
            {/* Redirect root to /admin/login */}
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route element={<AdminProtectedRoute />}>
                <Route path="/admin/home" element={<Dashboard />} />
                <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
                <Route path="/admin/subjects-list" element={<Subjects />} />
                <Route path="/admin/students-list" element={<Students />} />
                <Route path="/admin/faculty-list" element={<Faculty />} />
                <Route path="/admin/defaulters-list" element={<DefaultersList />} />
                <Route path="/admin/settings" element={<Settings />} />
                <Route path="/admin/face-register" element={<FaceRegister />} />
                </Route>
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
    );
}
