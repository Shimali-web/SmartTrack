import mongoose from "mongoose";

const StudyPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  examDate: { type: Date, required: true },
  hoursPerDay: { type: Number, required: true },
  subjects: [{
    subject: String,
    difficulty: String,
    chapters: Number
  }],
  plan: [{
    day: Number,
    date: Date,
    items: [{ subject: String, hours: Number }]
  }],
  createdAt: { type: Date, default: Date.now }
});

StudyPlanSchema.set("toJSON", {
  transform(doc, ret) {
    return {
      id: ret._id.toString(),
      examDate: ret.examDate,
      hoursPerDay: ret.hoursPerDay,
      subjects: ret.subjects,
      plan: ret.plan,
      createdAt: ret.createdAt
    };
  }
});

export default mongoose.model("StudyPlan", StudyPlanSchema);
