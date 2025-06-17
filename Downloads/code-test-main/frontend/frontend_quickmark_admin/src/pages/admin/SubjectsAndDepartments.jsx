import React from "react";
import DepartmentsManager from "./DepartmentsManager.jsx";
import SubjectsManager from "./SubjectsManager.jsx";

export default function SubjectsAndDepartments() {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      <div className="flex-1">
        <DepartmentsManager />
      </div>
      <div className="flex-1">
        <SubjectsManager />
      </div>
    </div>
  );
}