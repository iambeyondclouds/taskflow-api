const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const dataPath = path.join(__dirname, "tasks.json");

app.use(express.json());

// Read tasks from file
function readTasks() {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

// Write tasks to file
function writeTasks(tasks) {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
}

// GET all tasks
app.get("/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// POST create new task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const tasks = readTasks();

  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false,
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

// PUT update task
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { completed } = req.body;

  const tasks = readTasks();
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  task.completed = completed;
  writeTasks(tasks);

  res.json(task);
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  let tasks = readTasks();
  const exists = tasks.some(t => t.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks = tasks.filter(t => t.id !== id);
  writeTasks(tasks);

  res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});