import mongoose from "mongoose";

const FlashcardDeckSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  cards: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

FlashcardDeckSchema.set('toJSON', {
  transform(doc, ret) {
    const newRet = {
      id: ret._id.toString(),
      title: ret.title,
      cards: ret.cards,
      createdAt: ret.createdAt
    };
    return newRet;
  }
});

export default mongoose.model("FlashcardDeck", FlashcardDeckSchema);
