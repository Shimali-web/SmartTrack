import express from "express";
import FlashcardDeck from "../models/FlashcardDeck.js";
import Quiz from "../models/Quiz.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ============================
// 🗂️ FLASHCARD STORAGE
// ============================

// Get all flashcard decks for user
router.get("/flashcards", authMiddleware, async (req, res) => {
  try {
    const decks = await FlashcardDeck.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ decks });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flashcard decks" });
  }
});

// Save a new flashcard deck
router.post("/flashcards", authMiddleware, async (req, res) => {
  try {
    const { title, cards } = req.body;
    if (!title || !cards || !cards.length) {
      return res.status(400).json({ error: "Title and cards are required" });
    }

    const newDeck = new FlashcardDeck({
      userId: req.user.id,
      title,
      cards
    });

    await newDeck.save();
    res.status(201).json({ deck: newDeck });
  } catch (error) {
    res.status(500).json({ error: "Failed to save flashcard deck" });
  }
});

// Delete a flashcard deck
router.delete("/flashcards/:id", authMiddleware, async (req, res) => {
  try {
    const deck = await FlashcardDeck.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deck) return res.status(404).json({ error: "Deck not found" });
    res.json({ message: "Deck deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete deck" });
  }
});

// ============================
// 📝 QUIZ STORAGE
// ============================

// Get all quizzes for user
router.get("/quizzes", authMiddleware, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ quizzes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// Save a new quiz
router.post("/quizzes", authMiddleware, async (req, res) => {
  try {
    const { title, questions } = req.body;
    if (!title || !questions || !questions.length) {
      return res.status(400).json({ error: "Title and questions are required" });
    }

    const newQuiz = new Quiz({
      userId: req.user.id,
      title,
      questions
    });

    await newQuiz.save();
    res.status(201).json({ quiz: newQuiz });
  } catch (error) {
    res.status(500).json({ error: "Failed to save quiz" });
  }
});

// Delete a quiz
router.delete("/quizzes/:id", authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});

export default router;
