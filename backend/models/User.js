import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, default: "" },
  // photoURL removed: profile images are no longer stored on the User document
}, { timestamps: true });

// Transform toJSON to return only safe fields
UserSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.passwordHash;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

export default mongoose.model("User", UserSchema);
