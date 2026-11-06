// ---------- Elements ----------
const form = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const rollNoInput = document.getElementById("rollNo");
const branchInput = document.getElementById("branch");
const marksInput = document.getElementById("marks");
const submitBtn = document.getElementById("submitBtn");
const searchInput = document.getElementById("searchInput");
const filterBranch = document.getElementById("filterBranch");
const tableBody = document.getElementById("studentTableBody");
const emptyMsg = document.getElementById("emptyMsg");

// ---------- Data (localStorage nundi load) ----------
let students = JSON.parse(localStorage.getItem("students")) || [];

function saveData() {
  localStorage.setItem("students", JSON.stringify(students));
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ---------- Render table (search + filter tho) ----------
function renderTable() {
  const searchText = searchInput.value.toLowerCase();
  const branch = filterBranch.value;

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchText) ||
      s.rollNo.toLowerCase().includes(searchText);
    const matchesBranch = branch === "" || s.branch === branch;
    return matchesSearch && matchesBranch;
  });

  tableBody.innerHTML = "";

  filtered.forEach((s, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHTML(s.name)}</td>
      <td>${escapeHTML(s.rollNo)}</td>
      <td>${escapeHTML(s.branch)}</td>
      <td>${s.marks}</td>
      <td>
        <button class="edit-btn" onclick="editStudent(${s.id})">Edit</button>
        <button class="delete-btn" onclick="deleteStudent(${s.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  emptyMsg.style.display = filtered.length ? "none" : "block";
}

// ---------- Add / Update ----------
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const rollNo = rollNoInput.value.trim();
  const branch = branchInput.value;
  const marks = Number(marksInput.value);
  const editingId = studentIdInput.value;

  // Same roll no rendu sarlu rakunda check
  const duplicate = students.some(
    (s) => s.rollNo.toLowerCase() === rollNo.toLowerCase() && String(s.id) !== editingId
  );
  if (duplicate) {
    alert("This Roll No already exists!");
    return;
  }

  if (editingId) {
    // Update
    const student = students.find((s) => String(s.id) === editingId);
    student.name = name;
    student.rollNo = rollNo;
    student.branch = branch;
    student.marks = marks;
  } else {
    // Add
    students.push({ id: Date.now(), name, rollNo, branch, marks });
  }

  saveData();
  resetForm();
  renderTable();
});

// ---------- Edit ----------
function editStudent(id) {
  const s = students.find((st) => st.id === id);
  studentIdInput.value = s.id;
  nameInput.value = s.name;
  rollNoInput.value = s.rollNo;
  branchInput.value = s.branch;
  marksInput.value = s.marks;
  submitBtn.textContent = "Update Student";
  nameInput.focus();
}

// ---------- Delete ----------
function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    students = students.filter((s) => s.id !== id);
    saveData();
    renderTable();
  }
}

// ---------- Reset form ----------
function resetForm() {
  form.reset();
  studentIdInput.value = "";
  submitBtn.textContent = "Add Student";
}

// ---------- Live search & filter ----------
searchInput.addEventListener("input", renderTable);
filterBranch.addEventListener("change", renderTable);

// ---------- First load ----------
renderTable();