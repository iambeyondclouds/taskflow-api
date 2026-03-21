const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const filePath = path.join(__dirname, "../tasks.json");

// read tasks from file
function readTasks() {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// write tasks back to file
function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// search tasks by title
router.get("/search", (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "query is required" });
  }

  const tasks = readTasks();

  const result = tasks.filter(t =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  res.json(result);
});

// get all tasks (with some filters)
router.get("/", (req, res) => {
  let tasks = readTasks();

  // filter by completed
  if (req.query.completed !== undefined) {
    const val = req.query.completed === "true";
    tasks = tasks.filter(t => t.completed === val);
  }

  // filter by priority
  if (req.query.priority) {
    tasks = tasks.filter(t => t.priority === req.query.priority);
  }

  res.json(tasks);
});

// create new task
router.post("/", (req, res) => {
  const { title, priority } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "invalid title" });
  }

  if (title.trim().length < 3) {
    return res.status(400).json({ error: "title too short" });
  }

  const valid = ["low", "medium", "high"];

  if (priority && !valid.includes(priority)) {
    return res.status(400).json({ error: "invalid priority" });
  }

  const tasks = readTasks();

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    completed: false,
    priority: priority ? priority : "medium",
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  saveTasks(tasks);

  res.status(201).json(newTask);
});

// update task status
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { completed } = req.body;

  const tasks = readTasks();
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "not found" });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed must be true/false" });
  }

  task.completed = completed;

  saveTasks(tasks);
  res.json(task);
});

// delete task
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  let tasks = readTasks();

  const found = tasks.find(t => t.id === id);

  if (!found) {
    return res.status(404).json({ error: "task not found" });
  }

  tasks = tasks.filter(t => t.id !== id);

  saveTasks(tasks);

  res.json({ msg: "deleted" });
});

module.exports = router;