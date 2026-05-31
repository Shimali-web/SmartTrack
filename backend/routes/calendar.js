import express from "express";
import authMiddleware from "../middleware/auth.js";
import Task from "../models/Task.js";

const router = express.Router();

// Create task
router.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const { title, dueDate, priority } = req.body;
    if (!title || !dueDate) return res.status(400).json({ error: "Title and due date required" });
    
    const task = await Task.create({
      userId: req.user.id,
      title,
      dueDate: new Date(dueDate),
      priority: priority || "medium",
      completed: false
    });
    
    res.json({ task: task.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get tasks for a specific date
router.get("/tasks/date/:date", authMiddleware, async (req, res) => {
  try {
    const { date } = req.params;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      userId: req.user.id,
      dueDate: { $gte: startDate, $lte: endDate }
    }).sort({ priority: -1 });

    res.json({ tasks: tasks.map(t => t.toJSON()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all tasks for current month
router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ dueDate: 1 });
    res.json({ tasks: tasks.map(t => t.toJSON()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update task
router.put("/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, dueDate, priority, completed } = req.body;

    const task = await Task.findById(taskId);
    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (title !== undefined) task.title = title;
    if (dueDate !== undefined) task.dueDate = new Date(dueDate);
    if (priority !== undefined) task.priority = priority;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    res.json({ task: task.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete task
router.delete("/tasks/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task || task.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "Task not found" });
    }
    await Task.deleteOne({ _id: taskId });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
