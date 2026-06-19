import express from "express";
import axios from "axios";

const router = express.Router();

// 🔹 Helper function
async function callGemini(prompt, base64Image = null, mimeType = "image/jpeg") {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable in backend deployment.");
  }

  // Using gemini-flash-latest as it supports multimodal and is fast
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const parts = [{ text: prompt }];
    if (base64Image) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: base64Image
        }
      });
    }

    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [{ parts }],
        temperature: 0.2,
        maxOutputTokens: 512,
        candidateCount: 1
      },
      { timeout: 30000 }
    );

    if (response.data && response.data.candidates && response.data.candidates[0].content) {
      let text = response.data.candidates[0].content.parts[0].text;
      // Strip markdown JSON block if present
      if (text.startsWith("```json")) {
        text = text.replace(/^```json\n/, "").replace(/\n```$/, "").trim();
      } else if (text.startsWith("```")) {
        text = text.replace(/^```\n/, "").replace(/\n```$/, "").trim();
      }
      return text;
    } else {
      console.error("Unexpected Gemini Response:", JSON.stringify(response.data));
      return "AI Error! The AI returned an unexpected response format.";
    }
  } catch (error) {
    const errorDetails = error?.response?.data?.error?.message || error.message;
    console.error("Gemini API Error Detail:", errorDetails);
    return `AI Error! ${errorDetails}`;
  }
}

// ============================
// 🧠 AI STUDY PLANNER
// ============================
router.post("/study-plan", async (req, res) => {
  const { subjects, examDate, hoursPerDay } = req.body;

  const today = new Date();
  const exam = new Date(examDate);
  const diffTime = exam - today;
  const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const prompt = `
Create a concise and high-impact study plan for exactly ${daysRemaining} days.

Subjects & Focus:
${subjects.map(s => `- ${s.subject}: ${s.chapters} chapters (${s.difficulty} level)`).join("\n")}

Timeline:
- Start Date: Today (${today.toDateString()})
- Exam Date: ${examDate}
- Total Days Available: ${daysRemaining} days
- Daily Study Time: ${hoursPerDay} hours

Output Requirements:
1. Format: Use a clear Day-wise structure (Day 1 to Day ${daysRemaining}).
2. Content: Focus ONLY on what to study and when. No long introductions or theory.
3. Strategy: Prioritize "${subjects.filter(s => s.difficulty === "weak").map(s => s.subject).join(", ")}" (weak areas).
4. Tone: Extremely simple, actionable, and encouraging.
5. Visuals: Use emojis and bullet points for readability.
6. Conclusion: End with a short "Pro Tip" for success.
`;

  const result = await callGemini(prompt);
  res.json({ plan: result });
});

// ============================
// 📝 NOTES SUMMARIZER
// ============================
router.post("/summarize", async (req, res) => {
  const { text } = req.body;

  const prompt = `
Summarize the following text and give:
1. Short summary
2. Key points
3. 5 important questions

Text:
${text}
`;

  const result = await callGemini(prompt);
  res.json({ summary: result });
});

// ============================
// 💬 CHATBOT
// ============================
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  const prompt = `
You are a helpful student assistant.
Answer simply and clearly.

User: ${message}
`;

  const result = await callGemini(prompt);
  res.json({ reply: result });
});

// ============================
// 🗂️ FLASHCARDS GENERATOR
// ============================
router.post("/flashcards", async (req, res) => {
  const { text } = req.body;

  const prompt = `
Generate up to 10 highly effective question-and-answer flashcards based on the following text.
Return ONLY a raw, valid JSON array of objects. Do not include any explanation or markdown formatting.
Each object must have exactly two keys: "question" and "answer".

Text to analyze:
${text}
`;

  const result = await callGemini(prompt);
  try {
    let jsonStr = result;
    const startIdx = result.indexOf('[');
    const endIdx = result.lastIndexOf(']');
    if (startIdx !== -1 && endIdx !== -1) {
      jsonStr = result.substring(startIdx, endIdx + 1);
    }
    const parsed = JSON.parse(jsonStr);
    res.json({ flashcards: parsed });
  } catch (e) {
    console.error("Flashcard parsing failed:", result);
    res.status(500).json({ error: "Failed to parse AI response into flashcards.", raw: result });
  }
});

// ============================
// 📝 QUIZ GENERATOR
// ============================
router.post("/quiz", async (req, res) => {
  const { text } = req.body;

  const prompt = `
Generate a 5-question multiple choice quiz based on the following text.
Return ONLY a raw, valid JSON array of objects. Do not include any explanation or markdown formatting.
Each object must have exactly these keys: 
- "question" (string)
- "options" (array of 4 strings)
- "correctAnswer" (string, must exactly match one of the options)
- "explanation" (string explaining why the answer is correct)

Text to analyze:
${text}
`;

  const result = await callGemini(prompt);
  try {
    let jsonStr = result;
    const startIdx = result.indexOf('[');
    const endIdx = result.lastIndexOf(']');
    if (startIdx !== -1 && endIdx !== -1) {
      jsonStr = result.substring(startIdx, endIdx + 1);
    }
    const parsed = JSON.parse(jsonStr);
    res.json({ quiz: parsed });
  } catch (e) {
    console.error("Quiz parsing failed:", result);
    res.status(500).json({ error: "Failed to parse AI response into quiz.", raw: result });
  }
});

// ============================
// 📸 OCR IMAGE ANALYSIS
// ============================
router.post("/analyze-image", async (req, res) => {
  const { imageBase64, mimeType, promptText } = req.body;
  
  if (!imageBase64) return res.status(400).json({ error: "No image provided" });

  const prompt = promptText || `
Please extract all readable text from this image and then provide a structured, easy-to-read summary of the key concepts.
Format it using Markdown.
`;

  const result = await callGemini(prompt, imageBase64, mimeType || "image/jpeg");
  res.json({ analysis: result });
});

export default router;
