import React from "react";
import StudentsManager from "./StudentsManager.jsx";
import StudentsList from "./StudentsList.jsx";

export default function Students() {
  return (
    <div className="p-6">
      <StudentsList />
    </div>
  );
}