import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

ReminderSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.userId;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Reminder", ReminderSchema);
