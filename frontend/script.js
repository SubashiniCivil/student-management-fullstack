const apiURL = "http://localhost:5000/students";
let editId = null;

// Toast
function showToast(message, color = "#29b6f6") {
  const box = document.getElementById("toastBox");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.borderLeftColor = color;
  toast.textContent = message;
  box.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// Load All Students
async function fetchStudents() {
  try {
    const res = await fetch(apiURL);
    const data = await res.json();

    const tableBody = document.getElementById("studentTableBody");
    tableBody.innerHTML = "";

    data.forEach((student) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>${student.course}</td>
        <td class="actions">
          <button class="btn-edit" onclick="editStudent(${student.id})">Edit</button>
          <button class="btn-delete" onclick="deleteStudent(${student.id})">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

  } catch (error) {
    showToast("Error loading students", "red");
  }
}

fetchStudents();

// Submit Form
document.getElementById("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const course = document.getElementById("course").value.trim();

  if (!name || !age || !course) {
    return showToast("All fields are required", "red");
  }

  const studentData = { name, age: Number(age), course };

  // Update Student
  if (editId) {
    const res = await fetch(`${apiURL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    });

    if (res.ok) {
      showToast("Student updated!", "#ffee58");
      document.getElementById("studentForm").reset();
      document.getElementById("submitBtn").textContent = "Add Student";
      editId = null;
      fetchStudents();
    }

    return;
  }

  // Add Student
  const res = await fetch(apiURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });

  if (res.ok) {
    showToast("Student added!", "#4fc3f7");
    document.getElementById("studentForm").reset();
    fetchStudents();
  }
});

// Edit Student
async function editStudent(id) {
  editId = id;

  const res = await fetch(`${apiURL}/${id}`);
  const student = await res.json();

  document.getElementById("name").value = student.name;
  document.getElementById("age").value = student.age;
  document.getElementById("course").value = student.course;

  document.getElementById("submitBtn").textContent = "Update Student";
  showToast("Editing student...", "#ffeb3b");
}

// Delete
async function deleteStudent(id) {
  if (!confirm("Are you sure?")) return;

  const res = await fetch(`${apiURL}/${id}`, { method: "DELETE" });

  if (res.ok) {
    showToast("Student deleted!", "#ff1744");
    fetchStudents();
  }
}

