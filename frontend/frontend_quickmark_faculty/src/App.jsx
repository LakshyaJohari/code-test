// src/App.jsx

import React, { useState, useEffect } from 'react';

// Import your icon directly into the component
import appIcon from './assets/favicon-32x32.png'; 

// Import Page Components
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MarkAttendance from './pages/MarkAttendance';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import StartQR from './pages/StartQR';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';

// Import Common Layout Components
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';

// REMOVE THE MOCKUSER DEFINITION COMPLETELY
// const mockUser = {
//   name: 'Dr. Mukesh Adani',
//   designation: 'Assistant Professor',
//   subjectsTaught: ['Calculus I', 'Linear Algebra', 'Differential Equations'],
//   avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=MA'
// };

const mockSubjects = [
  { id: 1, name: 'Subject A', batchName: 'Batch 2023', year: 2, section: 'A', department: 'ECE' },
  { id: 2, name: 'Subject B', batchName: 'Batch 2024', year: 1, section: 'A', department: 'ECE' },
  { id: 3, name: 'Subject C', batchName: 'Batch 2022', year: 3, section: 'D', department: 'IT' },
  { id: 4, name: 'Calculus II', batchName: 'Batch 2023', year: 2, section: 'B', department: 'MATH' },
  { id: 5, name: 'Subject E', batchName: 'Batch 2024', year: 1, section: 'A', department: 'ECE' },
];

const mockStudents = {
    1: [
        { id: 201, name: 'Alice Johnson', rollNo: '2023-ECE-001', attendance: 88 },
        { id: 202, name: 'Bob Williams', rollNo: '2023-ECE-002', attendance: 92 },
    ],
    2: [
        { id: 301, name: 'Charlie Brown', rollNo: '2024-ECE-001', attendance: 75 },
    ],
    3: [
        { id: 401, name: 'Diana Miller', rollNo: '2022-IT-001', attendance: 95 },
        { id: 402, name: 'Eve Davis', rollNo: '2022-IT-002', attendance: 68 },
        { id: 403, name: 'Frank White', rollNo: '2022-IT-003', attendance: 81 },
    ],
    4: [ 
        { id: 101, name: 'Ethan Harper', rollNo: '2021-MATH-001', attendance: 90 },
        { id: 102, name: 'Olivia Bennett', rollNo: '2021-MATH-002', attendance: 85 },
        { id: 103, name: 'Noah Carter', rollNo: '2021-MATH-003', attendance: 70 },
        { id: 104, name: 'Ava Davis', rollNo: '2021-MATH-004', attendance: 95 },
        { id: 105, name: 'Liam Evans', rollNo: '2021-MATH-005', attendance: 65 },
        { id: 106, name: 'Sophia Foster', rollNo: '2021-MATH-006', attendance: 80 },
        { id: 107, name: 'Jackson Green', rollNo: '2021-MATH-007', attendance: 72 },
        { id: 108, name: 'Isabella Hayes', rollNo: '2021-MATH-008', attendance: 88 },
        { id: 109, name: 'Lucas Ingram', rollNo: '2021-MATH-009', attendance: 68 },
        { id: 110, name: 'Mia Kelly', rollNo: '2021-MATH-010', attendance: 92 },
        { id: 111, name: 'James Nelson', rollNo: '2021-MATH-011', attendance: 74 },
    ],
    5: [] // Subject E has no students enrolled
};


function App() {
  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = appIcon;
    }
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [route, setRoute] = useState('/login');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // State to hold the logged-in user's data

  // Effect to check authentication status and load user from localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');

    console.log('App.jsx - Initial load check:');
    console.log('  Token from localStorage:', token);
    console.log('  UserName from localStorage:', userName);
    console.log('  UserId from localStorage:', userId);
    console.log('  UserEmail from localStorage:', userEmail);

    if (token && userName && userId && userEmail) {
      setIsAuthenticated(true);
      const loadedUser = {
        id: userId,
        name: userName,
        email: userEmail,
        // Add default/placeholder values if your components expect them
        designation: 'Faculty',
        subjectsTaught: [], // This might need to be fetched via another API call later
        avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=' + userName.charAt(0)
      };
      setCurrentUser(loadedUser);
      console.log('App.jsx - Loaded currentUser from localStorage:', loadedUser);
      setRoute('/dashboard'); // Redirect to dashboard if already logged in
    } else {
        // If no token or user data, ensure isAuthenticated is false and route is login
        setIsAuthenticated(false);
        setCurrentUser(null);
        setRoute('/login');
    }
  }, []); // Run once on component mount

  const navigate = (newRoute) => setRoute(newRoute);

  // Modified handleLogin to accept userToken and userData
  const handleLogin = (userToken, userData) => {
    console.log('App.jsx - handleLogin called with userToken:', userToken);
    console.log('App.jsx - handleLogin called with userData:', userData);
    setIsAuthenticated(true);
    setCurrentUser(userData); // Set the received user data
    console.log('App.jsx - currentUser after setting (in handleLogin):', userData); // Log the new user data
    navigate('/dashboard');
  };

  const handleLogout = () => {
    console.log('App.jsx - handleLogout called. Clearing state and localStorage.');
    setIsAuthenticated(false);
    setCurrentUser(null); // Clear user data on logout
    // Clear all related items from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    navigate('/subject-detail');
  };

  const handleViewStudentCalendar = (student) => {
    setSelectedStudent(student);
    navigate('/calendar');
  }

  const handleStartAttendanceFlow = () => {
      navigate('/mark-attendance');
  }

  const handleStartQR = (subject) => {
      setSelectedSubject(subject);
      navigate('/start-qr');
  }

  const renderContent = () => {
    if (!isAuthenticated) {
      // Pass the updated handleLogin which now expects user data
      return <LoginPage onLogin={handleLogin} />;
    }
    
    // Ensure currentUser is available before rendering components that use it
    // This is important because state updates are async, and initial render might not have currentUser yet
    if (!currentUser) {
        console.log('App.jsx - Waiting for currentUser data to be set...');
        return <div>Loading user data...</div>; // Or a loading spinner
    }

    // Now that currentUser is guaranteed to exist, pass it down
    switch (route) {
      case '/dashboard':
        return <Dashboard user={currentUser} onNavigate={navigate} onStartAttendance={handleStartAttendanceFlow} />;
      case '/mark-attendance':
        return <MarkAttendance subjects={mockSubjects} onStart={handleStartQR} />;
      case '/subjects':
        return <Subjects subjects={mockSubjects} onSelectSubject={handleSelectSubject} />;
      case '/subject-detail':
        return <SubjectDetail 
                  subject={selectedSubject} 
                  students={mockStudents[selectedSubject?.id] || []} 
                  onBack={() => navigate('/subjects')} 
                  onSelectStudent={handleViewStudentCalendar}
               />;
      case '/start-qr':
        return <StartQR 
                  subject={selectedSubject} 
                  onBack={() => navigate('/mark-attendance')} 
                  onSubmit={() => navigate('/dashboard')} 
               />;
      case '/calendar':
        return <Calendar 
                  subject={selectedSubject} 
                  student={selectedStudent} 
                  onBack={() => navigate('/subject-detail')} 
                />;
      case '/profile':
        return <Profile user={currentUser} onLogout={handleLogout}/>;
      case '/settings':
        return <Settings />;
      default:
        // Default to dashboard with currentUser
        return <Dashboard user={currentUser} onNavigate={navigate} onStartAttendance={handleStartAttendanceFlow}/>;
    }
  };

  return (
    <div className="flex min-h-screen bg-white-100">
      {/* Only render Sidebar and Navbar if authenticated AND currentUser is available */}
      {isAuthenticated && currentUser && <Sidebar currentRoute={route} onNavigate={navigate} />}
      <div className="flex-1 flex flex-col">
        {isAuthenticated && currentUser && <Navbar user={currentUser} onNavigate={navigate} />}
        <main className="p-4 sm:p-6 md:p-8 flex-1">
            {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;