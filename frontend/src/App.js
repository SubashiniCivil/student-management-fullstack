import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Using proxy → no localhost:5000 in URL
  const apiURL = "/students";

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [course, setCourse] = useState("");
  const [editId, setEditId] = useState(null);

  // Load all students
  const fetchStudents = async () => {
    try {
      const res = await fetch(apiURL);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

 useEffect(() => {
  fetch("/students")
    .then(res => res.json())
    .then(data => setStudents(data))
    .catch(err => console.error("Error fetching:", err));
}, []);


  // Add / Update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !age || !course) {
      alert("All fields are required");
      return;
    }

    const studentData = { name, age: Number(age), course };
    const requestOptions = {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    };

    try {
      let res;

      // Update student
      if (editId) {
        res = await fetch(`${apiURL}/${editId}`, {
          method: "PUT",
          ...requestOptions,
        });
        if (res.ok) {
          alert("Student updated!");
        }
      } else {
        // Add new student
        res = await fetch(apiURL, {
          method: "POST",
          ...requestOptions,
        });
        if (res.ok) {
          alert("Student added!");
        }
      }

      // Reset form & refresh
      setEditId(null);
      setName("");
      setAge("");
      setCourse("");
      fetchStudents();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  // Load student into form
  const editStudent = async (id) => {
    try {
      setEditId(id);

      const res = await fetch(`${apiURL}/${id}`);
      const student = await res.json();

      setName(student.name);
      setAge(student.age);
      setCourse(student.course);
    } catch (error) {
      console.error("Edit error:", error);
    }
  };

  // Delete a student
  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const res = await fetch(`${apiURL}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Student deleted!");
        fetchStudents();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="container">
      <h1>📚 Student Management System</h1>

      <form onSubmit={handleSubmit}>
        <h2>{editId ? "Update Student" : "Add New Student"}</h2>

        <div className="form-row">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            placeholder="Enter name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>Age:</label>
          <input
            type="number"
            value={age}
            placeholder="Enter age"
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>Course:</label>
          <input
            type="text"
            value={course}
            placeholder="Enter course"
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </div>

        <div className="button-row">
          <button type="submit">
            {editId ? "Update Student" : "Add Student"}
          </button>
        </div>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.age}</td>
              <td>{s.course}</td>

              <td className="actions">
                <button className="btn-edit" onClick={() => editStudent(s._id)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => deleteStudent(s._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

