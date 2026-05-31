import express from "express";
import authMiddleware from "../middleware/auth.js";
import Reminder from "../models/Reminder.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ reminders: reminders.map(r => r.toJSON()) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: "Reminder text required" });

    const reminder = await Reminder.create({
      userId: req.user.id,
      text: text.trim()
    });

    res.json({ reminder: reminder.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:reminderId", authMiddleware, async (req, res) => {
  try {
    const { reminderId } = req.params;
    const reminder = await Reminder.findById(reminderId);
    if (!reminder || reminder.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    await Reminder.deleteOne({ _id: reminderId });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
