import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import calendarRoutes from "./routes/calendar.js";
import studyRoutes from "./routes/studyPlanner.js";
import aiRoutes from "./routes/ai.js";
import aiStorageRoutes from "./routes/aiStorage.js";
import remindersRoutes from "./routes/reminders.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "https://unlife-dashboard.netlify.app",
      "http://localhost:5173"
    ],
    credentials: true
  })
);
app.use(express.json({ limit: "50mb" }));

const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/unlife";
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Connected to MongoDB ✅");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/reminders", remindersRoutes);
app.use("/api", studyRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/ai-storage", aiStorageRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT} 🚀`));
