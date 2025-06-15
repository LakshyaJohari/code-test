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

// Mock Data
const mockUser = {
  name: 'Dr. Mukesh Adani',
  designation: 'Assistant Professor',
  subjectsTaught: ['Calculus I', 'Linear Algebra', 'Differential Equations'],
  avatar: 'https://placehold.co/100x100/E2E8F0/4A5568?text=MA'
};

const mockSubjects = [
  { id: 1, name: 'Subject A', batchName: 'Batch 2023', year: 2, section: 'A', department: 'ECE' },
  { id: 2, name: 'Subject B', batchName: 'Batch 2024', year: 1, section: 'A', department: 'ECE' },
  { id: 3, name: 'Subject C', batchName: 'Batch 2022', year: 3, section: 'D', department: 'IT' },
  { id: 4, name: 'Calculus II', batchName: 'Batch 2023', year: 2, section: 'B', department: 'MATH' },
  { id: 5, name: 'Subject E', batchName: 'Batch 2024', year: 1, section: 'A', department: 'ECE' },
];

// *** ADDED MOCK DATA FOR ALL SUBJECTS ***
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

  const navigate = (newRoute) => setRoute(newRoute);

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
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
      return <LoginPage onLogin={handleLogin} />;
    }
    switch (route) {
      case '/dashboard':
        return <Dashboard user={mockUser} onNavigate={navigate} onStartAttendance={handleStartAttendanceFlow} />;
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
        return <Profile user={mockUser} onLogout={handleLogout}/>;
      case '/settings':
        return <Settings />;
      default:
        return <Dashboard user={mockUser} onNavigate={navigate} onStartAttendance={handleStartAttendanceFlow}/>;
    }
  };

  return (
    <div className="flex min-h-screen bg-white-100">
      {isAuthenticated && <Sidebar currentRoute={route} onNavigate={navigate} />}
      <div className="flex-1 flex flex-col">
        {isAuthenticated && <Navbar user={mockUser} onNavigate={navigate} />}
        <main className="p-4 sm:p-6 md:p-8 flex-1">
            {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
