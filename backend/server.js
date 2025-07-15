import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "icharge", // Change as needed
  password: "icharge123456", // Change as needed
  database: "task_manager", // Change as needed
  dateStrings: true
});

const statusCodes = [
  "Dev",
  "in-progress",
  "UAT-Ready",
  "UAT-passed",
  "PROD-Ready",
  "Launched"
];

function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

function validateTaskInput(name, assignee, dueDate, status) {
  return name && assignee && dueDate && status && statusCodes.includes(status) && isValidDate(dueDate);
}

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Create a new task
app.post("/tasks", async (req, res) => {
  const { name, assignee, dueDate, status } = req.body;
  if (!validateTaskInput(name, assignee, dueDate, status)) {
    return res.status(400).json({ error: "Invalid input" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO tasks (name, assignee, dueDate, status) VALUES (?, ?, ?, ?)",
      [name, assignee, dueDate, status]
    );
    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Update a task
app.put("/tasks/:id", async (req, res) => {
  const { name, assignee, dueDate, status } = req.body;
  if (!validateTaskInput(name, assignee, dueDate, status)) {
    return res.status(400).json({ error: "Invalid input" });
  }
  try {
    const [result] = await pool.query(
      "UPDATE tasks SET name = ?, assignee = ?, dueDate = ?, status = ? WHERE id = ?",
      [name, assignee, dueDate, status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Task not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
}); 