import React, { useState } from "react";

// --- Import all your components from their correct folders ---
import MainLayout from "./components/layout/MainLayout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import SubjectsList from "./pages/subjects/SubjectsList.jsx";
import StudentsList from "./pages/students/StudentsList.jsx";
import FacultyList from "./pages/faculty/FacultyList.jsx";
import DepartmentPage from "./pages/department/DepartmentPage.jsx";
import LowAttendance from "./pages/reports/LowAttendance.jsx";
import Settings from "./pages/settings/Settings.jsx";
import FaceRegister from "./pages/faceregister/FaceRegister.jsx";
import AddEditStudentForm from "./pages/students/AddEditStudentForm.jsx";
import Login from "./pages/auth/Login.jsx";
import Calendar from "./pages/subjects/Calendar.jsx";
import EnrolledStudents from "./pages/subjects/EnrolledStudents.jsx";

// --- Mock Data ---
const initialMockData = {
  departments: [
    { "id": 1, "name": "Computer Science" },
    { "id": 2, "name": "Electrical Engineering" },
    { "id": 3, "name": "Mechanical Engineering" },
    { "id": 4, "name": "Civil Engineering" }
  ],
  faculty: [
    { "id": 1, "name": "Dr. Alan Turing", "email": "alan.turing@example.com", "department": "Computer Science", "designation": "Professor" },
    { "id": 2, "name": "Dr. Nikola Tesla", "email": "nikola.tesla@example.com", "department": "Electrical Engineering", "designation": "Professor" },
    { "id": 3, "name": "Dr. James Watt", "email": "james.watt@example.com", "department": "Mechanical Engineering", "designation": "Associate Professor" },
    { "id": 4, "name": "Dr. John Smeaton", "email": "john.smeaton@example.com", "department": "Civil Engineering", "designation": "Head of Department" }
  ],
  students: [
    { "id": 101, "name": "Ada Lovelace", "rollNo": "CSE101", "email": "ada.lovelace@example.com", "department": "Computer Science", "startYear": 2023, "attendance": 90 },
    { "id": 102, "name": "Charles Babbage", "rollNo": "CSE102", "email": "charles.babbage@example.com", "department": "Computer Science", "startYear": 2023, "attendance": 85 },
    { "id": 103, "name": "Grace Hopper", "rollNo": "CSE103", "email": "grace.hopper@example.com", "department": "Computer Science", "startYear": 2023, "attendance": 95 },
    { "id": 201, "name": "Michael Faraday", "rollNo": "EE201", "email": "michael.faraday@example.com", "department": "Electrical Engineering", "startYear": 2023, "attendance": 70 },
    { "id": 202, "name": "James Clerk Maxwell", "rollNo": "EE202", "email": "james.maxwell@example.com", "department": "Electrical Engineering", "startYear": 2023, "attendance": 92 },
    { "id": 301, "name": "George Stephenson", "rollNo": "ME301", "email": "george.stephenson@example.com", "department": "Mechanical Engineering", "startYear": 2022, "attendance": 65 },
    { "id": 401, "name": "Isambard Kingdom Brunel", "rollNo": "CE401", "email": "isambard.brunel@example.com", "department": "Civil Engineering", "startYear": 2022, "attendance": 88 }
  ],
  subjects: [
    { "id": 1, "name": "Data Structures", "department": "Computer Science", "faculty": "Dr. Alan Turing", "startYear": 2023 },
    { "id": 2, "name": "Algorithms", "department": "Computer Science", "faculty": "Dr. Alan Turing", "startYear": 2023 },
    { "id": 3, "name": "Electromagnetism", "department": "Electrical Engineering", "faculty": "Dr. Nikola Tesla", "startYear": 2023 },
    { "id": 4, "name": "Circuit Theory", "department": "Electrical Engineering", "faculty": "Dr. Nikola Tesla", "startYear": 2023 },
    { "id": 5, "name": "Thermodynamics", "department": "Mechanical Engineering", "faculty": "Dr. James Watt", "startYear": 2022 },
    { "id": 6, "name": "Structural Analysis", "department": "Civil Engineering", "faculty": "Dr. John Smeaton", "startYear": 2022 }
  ]
};


// --- Main App Component ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentPage, setCurrentPage] = useState("Home");
  const [mockData, setMockData] = useState(initialMockData);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  // --- NEW: Add state for the attendance threshold ---
  const [attendanceThreshold, setAttendanceThreshold] = useState(75);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setActiveFilter(null);
  };

  const handleNavigateWithFilter = (departmentName) => {
    setCurrentPage("Subjects");
    setActiveFilter({ Department: departmentName });
  };
  
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  const viewSubjectDetails = (subject) => {
    setSelectedSubject(subject);
    setCurrentPage("SubjectDetails");
  };

  const handleBack = () => {
    if (currentPage === "SubjectDetails") setCurrentPage("Subjects");
    else if (currentPage === "AddEditStudent") setCurrentPage("Students");
    else if (currentPage === "Calendar") setCurrentPage("SubjectDetails");
    else navigateTo("Home");
  };

  // --- NEW: Handler to update the threshold from the Settings page ---
  const handleThresholdChange = (newThreshold) => {
    const thresholdValue = parseInt(newThreshold, 10);
    if (!isNaN(thresholdValue)) {
      setAttendanceThreshold(thresholdValue);
    }
  };

  // --- Data Management Handlers ---
  const handleAddSubject = (newSubjectData) => {
    const newSubject = { ...newSubjectData, id: Date.now() };
    setMockData(prev => ({ ...prev, subjects: [...prev.subjects, newSubject] }));
  };
  const handleUpdateSubject = (subjectId, updatedData) => {
    setMockData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === subjectId ? { ...s, ...updatedData } : s)
    }));
  };
  
  const handleSaveStudent = (studentId, updatedData) => {
    if (studentId) {
      setMockData(prev => ({ ...prev, students: prev.students.map(s => s.id === studentId ? { ...s, ...updatedData } : s) }));
    } else {
      setMockData(prev => ({ ...prev, students: [...prev.students, { ...updatedData, id: Date.now(), attendance: 100 }] }));
    }
    navigateTo("Students");
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Delete student?")) {
      setMockData(prev => ({ ...prev, students: prev.students.filter(s => s.id !== studentId) }));
    }
  };

  const handleAddFaculty = (newFacultyData) => {
    setMockData(prev => ({ ...prev, faculty: [...prev.faculty, { ...newFacultyData, id: Date.now() }] }));
  };

  const handleUpdateFaculty = (facultyId, updatedData) => {
    setMockData(prev => ({
      ...prev,
      faculty: prev.faculty.map(f => f.id === facultyId ? { ...f, ...updatedData } : f)
    }));
  };

  const handleDeleteFaculty = (facultyId) => {
    if (window.confirm("Delete faculty member?")) {
      setMockData(prev => ({ ...prev, faculty: prev.faculty.filter(f => f.id !== facultyId) }));
    }
  };

  const handleAddDepartment = (departmentName) => {
    setMockData(prev => ({ ...prev, departments: [...prev.departments, { id: Date.now(), name: departmentName }] }));
  };

  const handleDeleteDepartment = (departmentId) => {
    if (window.confirm("Delete department?")) {
      setMockData(prev => ({ ...prev, departments: prev.departments.filter(d => d.id !== departmentId) }));
    }
  };

  const renderContent = () => {
    // --- FIX: Defaulter calculation now uses the state variable ---
    const defaulters = mockData.students.filter((s) => s.attendance < attendanceThreshold);
   
    switch (currentPage) {
      case "Home":
        return <Dashboard allStudents={mockData.students} allSubjects={mockData.subjects} allFaculty={mockData.faculty} allDepartments={mockData.departments}/>;
      
      case "Subjects":
        return (
          <SubjectsList
            subjects={mockData.subjects}
            allDepartments={mockData.departments}
            allFaculty={mockData.faculty}
            onViewDetails={viewSubjectDetails}
            onAddSubject={handleAddSubject}
            onUpdateSubject={handleUpdateSubject}
            initialDepartmentFilter={activeFilter?.Department || ""}
          />
        );
      
      case "SubjectDetails":
        return <EnrolledStudents subject={selectedSubject} allStudents={mockData.students} onBack={() => navigateTo("Subjects")} />;
      
      case "Students":
        return <StudentsList students={mockData.students} onAdd={() => { setSelectedStudent(null); setCurrentPage("AddEditStudent"); }} onEdit={(student) => { setSelectedStudent(student); setCurrentPage("AddEditStudent"); }} onDelete={handleDeleteStudent} />;
      
      case "Faculty":
        return <FacultyList faculty={mockData.faculty} onAddFaculty={handleAddFaculty} onUpdateFaculty={handleUpdateFaculty} onDeleteFaculty={handleDeleteFaculty} />;
      
      case "Departments":
        return <DepartmentPage departments={mockData.departments} onAdd={handleAddDepartment} onDelete={handleDeleteDepartment} onSelectDepartment={handleNavigateWithFilter} />;
      
      case "AddEditStudent":
        return <AddEditStudentForm student={selectedStudent} onSave={handleSaveStudent} onBack={() => navigateTo("Students")} />;
      
      case "Defaulters":
        return <LowAttendance allStudents={defaulters} />;
        
      case "Calendar":
        return <Calendar subject={selectedSubject} student={selectedStudent} onBack={() => setCurrentPage("SubjectDetails")} />;
      
      case "FaceRegister":
        return <FaceRegister />;
        
      // --- FIX: Pass all necessary data and functions to the Settings component ---
      case "Settings":
        return <Settings 
                  mockData={mockData}
                  attendanceThreshold={attendanceThreshold}
                  onThresholdChange={handleThresholdChange}
               />;

      default:
        return <Dashboard allStudents={mockData.students} allSubjects={mockData.subjects} allFaculty={mockData.faculty} allDepartments={mockData.departments}/>;
    }
  };

  const getTitle = () => {
    switch (currentPage) {
      case "Home": return "Dashboard";
      case "Subjects": return "Subjects";
      case "SubjectDetails": return `Students in ${selectedSubject?.name}`;
      case "Students": return "Student List";
      case "Faculty": return "Faculty";
      case "Departments": return "Manage Departments";
      case "Defaulters": return "Defaulters List";
      case "FaceRegister": return "FaceRegister";
      case "Settings": return "Settings";
      case "AddEditStudent": return selectedStudent ? "Edit Student" : "Add Student";
      case "Calendar": return `Attendance for ${selectedStudent?.name}`;
      default: return "Dashboard";
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <MainLayout
      currentPage={currentPage}
      navigateTo={navigateTo}
      title={getTitle()}
      showBackButton={!["Home", "Dashboard"].includes(currentPage)}
      onBack={handleBack}
      onLogout={handleLogout}
    >
      {renderContent()}
    </MainLayout>
  );
}