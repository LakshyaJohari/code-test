import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

export default function SubjectsList() {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSubject, setNewSubject] = useState({
    subject_name: "",
    department_id: "",
    year: "",
    section: "",
    batch_name: "",
  });
  const [editing, setEditing] = useState(null);
  const [editSubject, setEditSubject] = useState({
    subject_name: "",
    department_id: "",
    year: "",
    section: "",
    batch_name: "",
  });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const [subjectsRes, departmentsRes] = await Promise.all([
        axios.get("http://localhost:3700/api/admin/subjects", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3700/api/admin/departments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setSubjects(subjectsRes.data);
      setDepartments(departmentsRes.data);
    } catch (err) {
      setError("Failed to load subjects or departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !newSubject.subject_name.trim() ||
      !newSubject.department_id ||
      !newSubject.year ||
      !newSubject.section
    ) {
      setError("All required fields are needed.");
      return;
    }
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(
        "http://localhost:3700/api/admin/subjects",
        newSubject,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewSubject({
        subject_name: "",
        department_id: "",
        year: "",
        section: "",
        batch_name: "",
      });
      fetchData();
    } catch {
      setError("Failed to create subject.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !editSubject.subject_name.trim() ||
      !editSubject.department_id ||
      !editSubject.year ||
      !editSubject.section
    ) {
      setError("All required fields are needed.");
      return;
    }
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:3700/api/admin/subjects/${editing.subject_id}`,
        editSubject,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing(null);
      setEditSubject({
        subject_name: "",
        department_id: "",
        year: "",
        section: "",
        batch_name: "",
      });
      fetchData();
    } catch {
      setError("Failed to update subject.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `http://localhost:3700/api/admin/subjects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch {
      setError("Failed to delete subject.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subjects</h2>
      {/* Create */}
      <form onSubmit={handleCreate} className="mb-4 flex flex-wrap gap-2 items-end">
        <input
          value={newSubject.subject_name}
          onChange={e => setNewSubject({ ...newSubject, subject_name: e.target.value })}
          placeholder="Subject Name"
          className="border px-2 py-1 rounded"
          required
        />
        <select
          value={newSubject.department_id}
          onChange={e => setNewSubject({ ...newSubject, department_id: e.target.value })}
          className="border px-2 py-1 rounded"
          required
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept.department_id} value={dept.department_id}>
              {dept.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={newSubject.year}
          onChange={e => setNewSubject({ ...newSubject, year: e.target.value })}
          placeholder="Year"
          className="border px-2 py-1 rounded"
          required
        />
        <input
          value={newSubject.section}
          onChange={e => setNewSubject({ ...newSubject, section: e.target.value })}
          placeholder="Section"
          className="border px-2 py-1 rounded"
          required
        />
        <input
          value={newSubject.batch_name}
          onChange={e => setNewSubject({ ...newSubject, batch_name: e.target.value })}
          placeholder="Batch (optional)"
          className="border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded flex items-center">
          <PlusCircle size={18} className="mr-1" /> Add
        </button>
      </form>
      {/* List */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Department</th>
            <th className="py-2 px-4">Year</th>
            <th className="py-2 px-4">Section</th>
            <th className="py-2 px-4">Batch</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subj) => (
            <tr key={subj.subject_id} className="border-t">
              <td className="py-2 px-4">{subj.subject_name}</td>
              <td className="py-2 px-4">
                {departments.find(d => d.department_id === subj.department_id)?.name || subj.department_name || "N/A"}
              </td>
              <td className="py-2 px-4">{subj.year}</td>
              <td className="py-2 px-4">{subj.section}</td>
              <td className="py-2 px-4">{subj.batch_name}</td>
              <td className="py-2 px-4 flex gap-2">
                <button
                  onClick={() => {
                    setEditing(subj);
                    setEditSubject({
                      subject_name: subj.subject_name,
                      department_id: subj.department_id,
                      year: subj.year,
                      section: subj.section,
                      batch_name: subj.batch_name || "",
                    });
                  }}
                  className="text-blue-600"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(subj.subject_id)}
                  className="text-red-600"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow">
            <h3 className="mb-2 font-semibold">Edit Subject</h3>
            <input
              value={editSubject.subject_name}
              onChange={e => setEditSubject({ ...editSubject, subject_name: e.target.value })}
              className="border px-2 py-1 rounded mb-2 w-full"
              required
              placeholder="Subject Name"
            />
            <select
              value={editSubject.department_id}
              onChange={e => setEditSubject({ ...editSubject, department_id: e.target.value })}
              className="border px-2 py-1 rounded mb-2 w-full"
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={editSubject.year}
              onChange={e => setEditSubject({ ...editSubject, year: e.target.value })}
              className="border px-2 py-1 rounded mb-2 w-full"
              required
              placeholder="Year"
            />
            <input
              value={editSubject.section}
              onChange={e => setEditSubject({ ...editSubject, section: e.target.value })}
              className="border px-2 py-1 rounded mb-2 w-full"
              required
              placeholder="Section"
            />
            <input
              value={editSubject.batch_name}
              onChange={e => setEditSubject({ ...editSubject, batch_name: e.target.value })}
              className="border px-2 py-1 rounded mb-2 w-full"
              placeholder="Batch (optional)"
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditing(null)} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}