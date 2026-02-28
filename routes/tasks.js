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

// GET all tasks
router.get("/", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

// POST create task
router.post("/", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
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