// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import InfoCard from './InfoCard';
// import { Book, Users, AlertCircle, Briefcase, Building, Settings as SettingsIcon } from 'lucide-react';

// export default function Dashboard() {
//   const [stats, setStats] = useState({
//     subjects: 0,
//     students: 0,
//     defaulters: 0,
//     faculty: 0,
//     departments: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const fetchDashboardStats = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('adminToken');
//       if (!token) {
//         setError('Admin not authenticated.');
//         setLoading(false);
//         return;
//       }
//       const response = await axios.get('http://localhost:3700/api/admin/dashboard-stats', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setStats({
//         subjects: response.data.subjects,
//         students: response.data.students,
//         defaulters: response.data.defaulters,
//         faculty: response.data.faculties,
//         departments: response.data.departments,
//       });
//     } catch (err) {
//       console.error('Error fetching dashboard stats:', err.response ? err.response.data : err.message);
//       setError(err.response?.data?.message || 'Failed to load dashboard stats.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardStats();
//   }, []);

//   const infoCards = [
//     { title: 'Total Subjects', value: stats.subjects, navigate, linkTo: '/admin/subjects-list', IconComponent: Book },
//     { title: 'Total Students', value: stats.students, navigate, linkTo: '/admin/students-list', IconComponent: Users },
//     { title: 'Total Defaulters', value: stats.defaulters, navigate, linkTo: '/admin/defaulters', IconComponent: AlertCircle },
//     { title: 'Total Faculty', value: stats.faculty, navigate, linkTo: '/admin/faculty-list', IconComponent: Briefcase },
//     { title: 'Departments', value: stats.departments, navigate, linkTo: '/admin/departments', IconComponent: Building },
//     { title: 'Settings', value: '', navigate, linkTo: '/admin/settings', IconComponent: SettingsIcon },
//   ];

//   if (loading) return <div className="text-center text-xl mt-10">Loading Dashboard...</div>;
//   if (error) return <div className="text-center text-red-500 text-xl mt-10">Error: {error}</div>;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//       {infoCards.map((card) => (
//         <InfoCard key={card.title} {...card} />
//       ))}
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InfoCard from './InfoCard';
import { Book, Users, AlertCircle, Briefcase, Building, Settings as SettingsIcon } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    subjects: 0,
    students: 0,
    defaulters: 0,
    faculty: 0,
    departments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Admin not authenticated.');
        setLoading(false);
        return;
      }
      const response = await axios.get('http://localhost:3700/api/admin/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Dashboard: Fetched Stats Data:', response.data); // ADDED LOG
      setStats({
        subjects: response.data.subjects,
        students: response.data.students,
        defaulters: response.data.defaulters,
        faculty: response.data.faculties,
        departments: response.data.departments,
      });
    } catch (err) {
      console.error('Dashboard: Error fetching dashboard stats:', err.response ? err.response.data : err.message); // ADDED LOG
      setError(err.response?.data?.message || 'Failed to load dashboard stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Dashboard: Component mounted/re-rendered'); // ADDED LOG
    fetchDashboardStats();
  }, []);

  const infoCards = [
    { title: 'Total Subjects', value: stats.subjects, navigate, linkTo: '/admin/subjects-list', IconComponent: Book },
    { title: 'Total Students', value: stats.students, navigate, linkTo: '/admin/students-list', IconComponent: Users },
    { title: 'Total Defaulters', value: stats.defaulters, navigate, linkTo: '/admin/defaulters', IconComponent: AlertCircle },
    { title: 'Total Faculty', value: stats.faculty, navigate, linkTo: '/admin/faculty-list', IconComponent: Briefcase },
    { title: 'Departments', value: stats.departments, navigate, linkTo: '/admin/departments', IconComponent: Building },
    { title: 'Settings', value: '', navigate, linkTo: '/admin/settings', IconComponent: SettingsIcon },
  ];

  if (loading) return <div className="text-center text-xl mt-10">Loading Dashboard...</div>;
  if (error) return <div className="text-center text-red-500 text-xl mt-10">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {infoCards.map((card) => (
        <InfoCard key={card.title} {...card} />
      ))}
    </div>
  );
}