import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

QuizSchema.set('toJSON', {
  transform(doc, ret) {
    const newRet = {
      id: ret._id.toString(),
      title: ret.title,
      questions: ret.questions,
      createdAt: ret.createdAt
    };
    return newRet;
  }
});

export default mongoose.model("Quiz", QuizSchema);
