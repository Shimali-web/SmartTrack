import express from "express";
import auth from "../middleware/auth.js";
import StudyPlan from "../models/StudyPlan.js";

const router = express.Router();

// POST /api/generate-plan
router.post("/generate-plan", auth, async (req, res) => {
  try {
    const { subjects = [], examDate, hoursPerDay } = req.body;
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: "Subjects are required" });
    }
    if (!examDate || !hoursPerDay) return res.status(400).json({ error: "examDate and hoursPerDay required" });

    const today = new Date();
    const exam = new Date(examDate);
    const msPerDay = 1000 * 60 * 60 * 24;
    let daysLeft = Math.ceil((exam - today) / msPerDay);
    if (daysLeft < 1) daysLeft = 1;

    const weightage = { weak: 3, medium: 2, strong: 1 };

    // compute subject score (weight * chapters) to handle workload
    const subjectsWithScore = subjects.map((s) => {
      const w = weightage[s.difficulty] || 2;
      const chapters = Number(s.chapters) || 1;
      return { ...s, weight: w, chapters, score: w * chapters };
    });

    const totalScore = subjectsWithScore.reduce((sum, s) => sum + (s.score || 0), 0) || 1;

    // Build per-day plan
    const plan = [];
    for (let day = 1; day <= daysLeft; day++) {
      const date = new Date(today.getTime() + (day * msPerDay));
      const items = subjectsWithScore.map((s) => {
        const rawHours = (s.score / totalScore) * Number(hoursPerDay);
        // round to 2 decimals and ensure small minimum allocation
        const hours = Math.round(rawHours * 100) / 100;
        return { subject: s.subject, hours };
      });
      plan.push({ day, date, items });
    }

    // Save plan
    const doc = await StudyPlan.create({
      userId: req.user.id,
      examDate: exam,
      hoursPerDay: Number(hoursPerDay),
      subjects: subjectsWithScore.map(s => ({ subject: s.subject, difficulty: s.difficulty, chapters: s.chapters })),
      plan
    });

    return res.json({ plan: doc.plan, id: doc._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
