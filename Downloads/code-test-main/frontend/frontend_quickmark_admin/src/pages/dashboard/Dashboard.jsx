import React, { useEffect, useState } from 'react';
import InfoCard from './InfoCard.jsx';
import axios from 'axios';
import { Book, Users, AlertCircle, Briefcase, Building, Settings as SettingsIcon } from 'lucide-react'; // Import icons

export default function Dashboard({ navigateTo }) {
  const [stats, setStats] = useState({
    subjects: 0,
    students: 0,
    defaulters: 0,
    faculty: 0,
    departments: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://localhost:3700/api/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats({
        subjects: res.data.subjects,
        students: res.data.students,
        defaulters: res.data.defaulters || 0,
        faculty: res.data.faculties || res.data.faculty || 0,
        departments: res.data.departments || 0,
      });
    };
    fetchStats();
  }, []);

  const infoCards = [
    { title: 'Total Subjects', value: stats.subjects, navigateTo, linkTo: 'Subjects', imageUrl: 'https://placehold.co/400x300/E9F5E9/34A853?text=Subjects' },
    { title: 'Total Students', value: stats.students, navigateTo, linkTo: 'Students', imageUrl: 'https://placehold.co/400x300/E8F0FE/4285F4?text=Students' },
    { title: 'Total Defaulters', value: stats.defaulters, navigateTo, linkTo: 'Defaulters', imageUrl: 'https://placehold.co/400x300/FCE8E6/EA4335?text=Defaulters' },
    { title: 'Total Faculty', value: stats.faculty, navigateTo, linkTo: 'Faculty', imageUrl: 'https://placehold.co/400x300/FEF7E0/FBBC05?text=Faculty' },
    // New Departments card
    { title: 'Departments', value: stats.departments, navigateTo, linkTo: 'Departments', imageUrl: 'https://placehold.co/400x300/DEF7FE/1E88E5?text=Departments' },
    // New Settings card
    { title: 'Settings', value: '', navigateTo, linkTo: 'Settings', imageUrl: 'https://placehold.co/400x300/F3E8FF/8E24AA?text=Settings' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {infoCards.map((card) => (
        <InfoCard key={card.title} {...card} />
      ))}
    </div>
  );
}