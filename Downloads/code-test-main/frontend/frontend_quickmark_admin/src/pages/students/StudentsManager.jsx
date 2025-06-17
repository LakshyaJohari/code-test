import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StudentsManager() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAdminToken = () => localStorage.getItem("adminToken");

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getAdminToken();
      const response = await axios.get("http://localhost:3700/api/admin/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (err) {
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add create, edit, delete logic here...

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4 text-center">Students</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">ID</th>
              {/* ...other columns... */}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.student_id}</td>
                {/* ...other columns... */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}