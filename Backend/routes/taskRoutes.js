
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Add task
router.post("/addtask", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

// Get all tasks
router.get("/gettasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Update task
router.put("/updatetask/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(task);
});

// Delete task
router.delete("/deletetask/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted successfully" });
});

module.exports = router;
