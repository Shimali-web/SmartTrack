import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  folderId: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
  name: { type: String, required: true },
  fileType: { type: String, default: "file" },
  fileSize: { type: Number },
  filePath: { type: String },
  fileName: { type: String },
  uploadedAt: { type: Date, default: Date.now }
});

// Transform toJSON to return only safe fields
FileSchema.set('toJSON', {
  transform(doc, ret) {
    // Only expose minimal metadata to avoid sending large binary or sensitive fields
    const newRet = {
      id: ret._id.toString(),
      // keep name for display compatibility; prefer `name` then `fileName`
      name: ret.name || ret.fileName || "",
    };
    return newRet;
  }
});

export default mongoose.model("File", FileSchema);
