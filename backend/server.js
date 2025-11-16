 const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Temporary data store
let students = [
  { id: 1, name: "Anjali", age: 20, course: "Backend Developer" },
  { id: 2, name: "Rahul", age: 22, course: "Frontend Developer" },
  { id: 3, name: "Karthik", age: 19, course: "Data Science" }
];


// GET all students
app.get("/students", (req, res) => {
  res.json(students);
});

// POST add a student
app.post("/students", (req, res) => {
  const student = req.body;
  student.id = Date.now(); // unique id
  students.push(student);
  res.json({ message: "Student added", student });
});

// DELETE a student
app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  students = students.filter((s) => s.id !== id);
  res.json({ message: "Student deleted", id });
});

// GET a single student by ID
app.get("/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// UPDATE a student
app.put("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, age, course } = req.body;

  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  students[studentIndex] = {
    id,
    name,
    age,
    course
  };

  res.json({ message: "Student updated", student: students[studentIndex] });
});


// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
