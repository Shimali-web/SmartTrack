import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Transform toJSON to return only safe fields
TaskSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.userId;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Task", TaskSchema);
