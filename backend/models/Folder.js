import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  parentFolderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
  createdAt: { type: Date, default: Date.now }
});

// Transform toJSON to return only safe fields
FolderSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.userId;
    delete ret.parentFolderId;
    delete ret.createdAt;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Folder", FolderSchema);
