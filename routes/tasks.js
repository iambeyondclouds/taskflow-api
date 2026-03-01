const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dataPath = path.join(__dirname, "../tasks.json");

function readTasks() {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

function writeTasks(tasks) {
  fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
}

// GET all tasks (with optional filtering)
router.get("/", (req, res) => {
  let tasks = readTasks();

  // Filtering by completion status
  if (req.query.completed !== undefined) {
    const isCompleted = req.query.completed === "true";
    tasks = tasks.filter(t => t.completed === isCompleted);
  }

  res.json(tasks);
});

// POST create task
router.post("/", (req, res) => {
  const { title } = req.body;

  // Strong validation
  if (!title || typeof title !== "string") {
    return res.status(400).json({
      error: "Title must be a non-empty string"
    });
  }

  if (title.trim().length < 3) {
    return res.status(400).json({
      error: "Title must be at least 3 characters long"
    });
  }

  const tasks = readTasks();

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

// PUT update task
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { completed } = req.body;

  const tasks = readTasks();
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      error: "Completed must be a boolean value"
    });
  }

  task.completed = completed;
  writeTasks(tasks);

  res.json(task);
});

// DELETE task
router.delete("/:id", (req, res) => {
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

module.exports = router;