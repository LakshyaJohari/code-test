// src/App.jsx
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

// --- Initial Mock Data ---
const initialMockData = {
  subjects: [
    {
      id: 1,
      name: "Mathematics",
      startYear: 2024,
      section: "A",
      department: "Science",
      faculty: "Dr. Eleanor Bennett",
    },
    {
      id: 2,
      name: "Physics",
      startYear: 2024,
      section: "B",
      department: "Science",
      faculty: "Dr. Charles Harris",
    },
    {
      id: 3,
      name: "Chemistry",
      startYear: 2024,
      section: "A",
      department: "Science",
      faculty: "Dr. Olivia Carter",
    },
    {
      id: 4,
      name: "Biology",
      startYear: 2024,
      section: "B",
      department: "Science",
      faculty: "Dr. Samuel Reed",
    },
    {
      id: 5,
      name: "History",
      startYear: 2024,
      section: "A",
      department: "Arts",
      faculty: "Dr. Sophia Turner",
    },
  ],
  students: [
    {
      id: 101,
      name: "Sophia Clark",
      rollNo: "101",
      email: "sophia.clark@example.com",
      attendance: 95,
      parentEmail: "parent.sophia@example.com",
      startYear: 2024,
      department: "Science",
    },
    {
      id: 102,
      name: "Ethan Miller",
      rollNo: "102",
      email: "ethan.miller@example.com",
      attendance: 88,
      parentEmail: "parent.ethan@example.com",
      startYear: 2024,
      department: "Science",
    },
    {
      id: 103,
      name: "Olivia Davis",
      rollNo: "103",
      email: "olivia.davis@example.com",
      attendance: 92,
      parentEmail: "parent.olivia@example.com",
      startYear: 2023,
      department: "Arts",
    },
    {
      id: 104,
      name: "Liam Wilson",
      rollNo: "104",
      email: "liam.wilson@example.com",
      attendance: 72,
      parentEmail: "parent.liam@example.com",
      startYear: 2023,
      department: "Arts",
    },
    {
      id: 105,
      name: "Ava Taylor",
      rollNo: "105",
      email: "ava.taylor@example.com",
      attendance: 65,
      parentEmail: "parent.ava@example.com",
      startYear: 2024,
      department: "Commerce",
    },
  ],
  faculty: [
    {
      id: 1,
      name: "Dr. Eleanor Bennett",
      department: "Computer Science",
      designation: "Professor",
    },
    {
      id: 2,
      name: "Dr. Samuel Carter",
      department: "Electrical Engineering",
      designation: "Associate Professor",
    },
    {
      id: 3,
      name: "Dr. Olivia Davis",
      department: "Mechanical Engineering",
      designation: "Assistant Professor",
    },
  ],
  departments: [
    { id: 1, name: "Science" },
    { id: 2, name: "Arts" },
    { id: 3, name: "Commerce" },
    { id: 4, name: "Computer Science" },
    { id: 5, name: "Mechanical Engineering" },
  ],
};

// --- Main App Component ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("Home");
  const [mockData, setMockData] = useState(initialMockData);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [activeFilter, setActiveFilter] = useState(null);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setActiveFilter(null); // Clear any active filters when navigating directly
  };

  // --- NEW: Handler to navigate from Departments to Subjects with a filter ---
  const handleNavigateWithFilter = (departmentName) => {
    setCurrentPage("Subjects");
    setActiveFilter({ Department: departmentName });
  };
  // --- Handlers for Authentication and Navigation ---
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const viewSubjectDetails = (subject) => {
    setSelectedSubject(subject);
    setCurrentPage("SubjectDetails");
  };

  const viewStudentCalendar = (student) => {
    setSelectedStudent(student);
    setCurrentPage("Calendar");
  };
  const handleBack = () => {
    if (currentPage === "SubjectDetails") {
      setCurrentPage("Subjects");
    } else if (currentPage === "AddEditStudent") {
      setCurrentPage("Students");
    } else if (currentPage === "Calendar") {
      setCurrentPage("SubjectDetails");
    } else {
      navigateTo("Home");
    }
  };

  // --- Data Management Handlers ---
  const handleAddSubject = (newSubjectData) => {
    setMockData((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { ...newSubjectData, id: Date.now() }],
    }));
  };
  const handleUpdateSubject = (subjectId, updatedData) => {
    setMockData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.id === subjectId ? { ...s, ...updatedData } : s
      ),
    }));
  };
  const handleAddStudent = (studentId, newData) => {
    setMockData((prev) => ({
      ...prev,
      students: [
        ...prev.students,
        { ...newData, id: Date.now(), attendance: 100 },
      ],
    }));
    navigateTo("Students");
  };
  const handleUpdateStudent = (studentId, updatedData) => {
    setMockData((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, ...updatedData } : s
      ),
    }));
    navigateTo("Students");
  };
  const handleDeleteStudent = (studentId) => {
    if (window.confirm("Delete student?"))
      setMockData((prev) => ({
        ...prev,
        students: prev.students.filter((s) => s.id !== studentId),
      }));
  };
  const handleAddFaculty = (newFacultyData) => {
    setMockData((prev) => ({
      ...prev,
      faculty: [...prev.faculty, { ...newFacultyData, id: Date.now() }],
    }));
  };
  const handleDeleteFaculty = (facultyId) => {
    if (window.confirm("Delete faculty member?"))
      setMockData((prev) => ({
        ...prev,
        faculty: prev.faculty.filter((f) => f.id !== facultyId),
      }));
  };
  const handleAddDepartment = (departmentName) => {
    setMockData((prev) => ({
      ...prev,
      departments: [
        ...prev.departments,
        { id: Date.now(), name: departmentName },
      ],
    }));
  };
  const handleDeleteDepartment = (departmentId) => {
    if (window.confirm("Delete department?"))
      setMockData((prev) => ({
        ...prev,
        departments: prev.departments.filter((d) => d.id !== departmentId),
      }));
  };

  const renderContent = () => {
    const defaulters = mockData.students.filter((s) => s.attendance < 75);
    const stats = {
      subjects: mockData.subjects.length,
      students: mockData.students.length,
      defaulters: defaulters.length,
      faculty: mockData.faculty.length,
    };

    switch (currentPage) {
      case "Home":
        return (
          <Dashboard
            allStudents={mockData.students}
            allSubjects={mockData.subjects}
          />
        );
      case "Subjects":
        return (
          <SubjectsList
            subjects={mockData.subjects}
            // --- FIX: Pass the department and faculty data down ---
            allDepartments={mockData.departments}
            allFaculty={mockData.faculty}
            onViewDetails={viewSubjectDetails}
            onAddSubject={handleAddSubject}
            onUpdateSubject={handleUpdateSubject}
            initialDepartmentFilter={activeFilter?.Department || ""}
          />
        );
      case "SubjectDetails":
        return (
          <EnrolledStudents
            subject={selectedSubject}
            allStudents={mockData.students}
            onBack={() => navigateTo("Subjects")}
          />
        );

      case "Students":
        return (
          <StudentsList
            students={mockData.students}
            onAdd={() => {
              setSelectedStudent(null);
              setCurrentPage("AddEditStudent");
            }}
            onEdit={(student) => {
              setSelectedStudent(student);
              setCurrentPage("AddEditStudent");
            }}
            onDelete={handleDeleteStudent}
          />
        );
      case "Faculty":
        return (
          <FacultyList
            faculty={mockData.faculty}
            onAddFaculty={handleAddFaculty}
            onDeleteFaculty={handleDeleteFaculty}
          />
        );
      case "Defaulters":
        return <LowAttendance allStudents={defaulters} />;
      case "Settings":
        return <Settings />;
      case "FaceRegister":
        return <FaceRegister students={mockData.students} />;
      case "Departments":
        return (
          <DepartmentPage
            departments={mockData.departments}
            onAdd={handleAddDepartment}
            onDelete={handleDeleteDepartment}
            onSelectDepartment={handleNavigateWithFilter}
          />
        );
      case "AddEditStudent":
        const onSaveStudent = selectedStudent
          ? handleUpdateStudent
          : handleAddStudent;
        return (
          <AddEditStudentForm
            student={selectedStudent}
            allStudents={mockData.students}
            allSubjects={mockData.subjects}
            onSave={onSaveStudent}
            onBack={() => navigateTo("Students")}
          />
        );
      case "Calendar":
        return (
          <Calendar
            subject={selectedSubject}
            student={selectedStudent}
            onBack={() => setCurrentPage("SubjectDetails")}
          />
        );
      default:
        return (
          <Dashboard
            allStudents={mockData.students}
            allSubjects={mockData.subjects}
          />
        );
    }
  };

  const getTitle = () => {
    switch (currentPage) {
      case "Home":
        return "Dashboard";
      case "Subjects":
        return "Subjects";
      case "SubjectDetails":
        return `Students in ${selectedSubject?.name}`;
      case "Students":
        return "Student List";
      case "Faculty":
        return "Faculty";
      case "Departments":
        return "Manage Departments";
      case "Defaulters":
        return "Defaulters List";
      case "FaceRegister":
        return "Face Register";
      case "Settings":
        return "Settings";
      case "AddEditStudent":
        return selectedStudent ? "Edit Student" : "Add Student";
      case "Calendar":
        return `Attendance for ${selectedStudent?.name}`;
      default:
        return "Dashboard";
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
      showBackButton={!["Home"].includes(currentPage)}
      onBack={handleBack}
      onLogout={handleLogout}
    >
      {renderContent()}
    </MainLayout>
  );
}
