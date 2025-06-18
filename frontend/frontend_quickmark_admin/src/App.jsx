// src/App.jsx
import React, { useState } from "react";

// --- Import all your components ---
import MainLayout from "./components/layout/MainLayout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx"; // This now refers to the new graph dashboard
// ... other imports ...
import SubjectsList from "./pages/subjects/SubjectsList.jsx";
import StudentsList from "./pages/students/StudentsList.jsx";
import FacultyList from "./pages/faculty/FacultyList.jsx";
import LowAttendance from "./pages/reports/LowAttendance.jsx";
import Settings from "./pages/settings/Settings.jsx";
import FaceRegister from "./pages/faceregister/FaceRegister.jsx";
import AddEditStudentForm from "./pages/students/AddEditStudentForm.jsx";
import Login from "./pages/auth/Login.jsx";

// ... (initialMockData remains the same)
const initialMockData = {
  subjects: [ { id: 1, name: "Mathematics", year: 2024, section: "A", department: "Science", faculty: "Dr. Eleanor Bennett" }, { id: 2, name: "Physics", year: 2024, section: "B", department: "Science", faculty: "Dr. Charles Harris" }, { id: 3, name: "Chemistry", year: 2024, section: "A", department: "Science", faculty: "Dr. Olivia Carter" }, { id: 4, name: "Biology", year: 2024, section: "B", department: "Science", faculty: "Dr. Samuel Reed" }, { id: 5, name: "History", year: 2024, section: "A", department: "Arts", faculty: "Dr. Sophia Turner" }, ],
  students: [ { id: 101, name: "Sophia Clark", rollNo: "101", email: "sophia.clark@example.com", attendance: 95, parentEmail: 'parent.sophia@example.com', year: 2024, department: 'Science' }, { id: 102, name: "Ethan Miller", rollNo: "102", email: "ethan.miller@example.com", attendance: 88, parentEmail: 'parent.ethan@example.com', year: 2024, department: 'Science' }, { id: 103, name: "Olivia Davis", rollNo: "103", email: "olivia.davis@example.com", attendance: 92, parentEmail: 'parent.olivia@example.com', year: 2023, department: 'Arts' }, { id: 104, name: "Liam Wilson", rollNo: "104", email: "liam.wilson@example.com", attendance: 72, parentEmail: 'parent.liam@example.com', year: 2023, department: 'Arts' }, { id: 105, name: "Ava Taylor", rollNo: "105", email: "ava.taylor@example.com", attendance: 65, parentEmail: 'parent.ava@example.com', year: 2024, department: 'Commerce' }, ],
  faculty: [ { id: 1, name: "Dr. Eleanor Bennett", department: "Computer Science", designation: "Professor" }, { id: 2, name: "Dr. Samuel Carter", department: "Electrical Engineering", designation: "Associate Professor" }, { id: 3, name: "Dr. Olivia Davis", department: "Mechanical Engineering", designation: "Assistant Professor" }, ],
};


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("Home");
  const [mockData, setMockData] = useState(initialMockData);
  // ... other state
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ... (all handler functions remain the same)
  const handleLogin = () => { setIsAuthenticated(true); setCurrentPage("Home"); };
  const handleLogout = () => { setIsAuthenticated(false); };
  const navigateTo = (page) => { setCurrentPage(page); setSelectedSubject(null); setSelectedStudent(null); };
  const viewSubjectDetails = (subject) => { setSelectedSubject(subject); setCurrentPage("SubjectDetails"); };
  const viewStudentDetails = (student) => { setSelectedStudent(student); setCurrentPage("AddEditStudent"); };
  const handleBack = () => { if (currentPage === "SubjectDetails") { setCurrentPage("Subjects"); } else if (currentPage === "AddEditStudent") { setCurrentPage("Students"); } else if (currentPage === "Defaulters") { setCurrentPage("Home"); } else { navigateTo("Home"); } };
  const handleAddSubject = (newSubjectData) => { setMockData(prevData => ({ ...prevData, subjects: [...prevData.subjects, { ...newSubjectData, id: new Date().getTime() }] })); };
  const handleUpdateSubject = (subjectId, updatedData) => { setMockData(prevData => ({ ...prevData, subjects: prevData.subjects.map(subject => subject.id === subjectId ? { ...subject, ...updatedData } : subject) })); };
  const handleAddStudent = (studentId, newStudentData) => { setMockData(prevData => ({ ...prevData, students: [...prevData.students, { ...newStudentData, id: new Date().getTime(), attendance: 100 }] })); navigateTo("Students"); };
  const handleUpdateStudent = (studentId, updatedData) => { setMockData(prevData => ({ ...prevData, students: prevData.students.map(student => student.id === studentId ? { ...student, ...updatedData } : student) })); navigateTo("Students"); };
  const handleDeleteStudent = (studentId) => { if (window.confirm("Are you sure?")) { setMockData(prevData => ({ ...prevData, students: prevData.students.filter(student => student.id !== studentId)})); }};
  const handleAddFaculty = (newFacultyData) => { setMockData(prevData => ({ ...prevData, faculty: [...prevData.faculty, { ...newFacultyData, id: new Date().getTime() }] })); };
  const handleDeleteFaculty = (facultyId) => { if (window.confirm("Are you sure?")) { setMockData(prevData => ({ ...prevData, faculty: prevData.faculty.filter(f => f.id !== facultyId) })); }};

  const renderContent = () => {
    const defaulters = mockData.students.filter((s) => s.attendance < 75);
    const stats = { subjects: mockData.subjects.length, students: mockData.students.length, defaulters: defaulters.length, faculty: mockData.faculty.length };

    switch (currentPage) {
      // THIS IS THE KEY CHANGE
      case "Home":
        return <Dashboard allStudents={mockData.students} allSubjects={mockData.subjects} />;
      
      // ... other cases remain the same
      case "Subjects": return <SubjectsList subjects={mockData.subjects} onViewDetails={viewSubjectDetails} onAddSubject={handleAddSubject} onUpdateSubject={handleUpdateSubject} />;
      case "Students": return <StudentsList students={mockData.students} onEdit={viewStudentDetails} onDelete={handleDeleteStudent} onAdd={() => viewStudentDetails(null)} />;
      case "Faculty": return <FacultyList faculty={mockData.faculty} onAddFaculty={handleAddFaculty} onDeleteFaculty={handleDeleteFaculty} />;
      case "Defaulters": return <LowAttendance allStudents={mockData.students} />;
      case "FaceRegister": return <FaceRegister students={mockData.students}/>;
      case "Settings": return <Settings />;
      case "AddEditStudent": const onSaveStudent = selectedStudent ? handleUpdateStudent : handleAddStudent; return <AddEditStudentForm student={selectedStudent} onSave={onSaveStudent} onBack={() => navigateTo("Students")} />;

      default:
        // Default case also shows the new dashboard
        return <Dashboard allStudents={mockData.students} allSubjects={mockData.subjects} />;
    }
  };

  // ... (getTitle and the rest of the App component remain the same)
  const getTitle = () => {
    switch (currentPage) {
      case "Home": return "Dashboard"; // Updated title
      case "Subjects": return "Subjects";
      case "Students": return "Student List";
      case "Faculty": return "Faculty";
      case "Defaulters": return "Defaulters List"; // Updated title
      case "FaceRegister": return "Face Register";
      case "Settings": return "Settings";
      // ... other titles
      default: return "Dashboard";
    }
  };

  if (!isAuthenticated) { return <Login onLogin={handleLogin} />; }

  return (
    <MainLayout
      currentPage={currentPage}
      navigateTo={navigateTo}
      title={getTitle()}
      showBackButton={!["Home", "Subjects", "Students", "Faculty", "Settings", "FaceRegister"].includes(currentPage)}
      onBack={handleBack}
      onLogout={handleLogout}
    >
      {renderContent()}
    </MainLayout>
  );
}
