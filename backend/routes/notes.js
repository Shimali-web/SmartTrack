import express from "express";
import authMiddleware from "../middleware/auth.js";
import Folder from "../models/Folder.js";
import File from "../models/File.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Create folder
router.post("/folders", authMiddleware, async (req, res) => {
  try {
    const { name, parentFolderId } = req.body;
    if (!name) return res.status(400).json({ error: "Folder name required" });
    const folder = await Folder.create({
      userId: req.user.id,
      name,
      parentFolderId: parentFolderId || null
    });
    res.json({ folder: folder.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user's root folders and files
router.get("/folders", authMiddleware, async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id, parentFolderId: null });
    const cleanFolders = folders.map(f => f.toJSON());
    res.json({ folders: cleanFolders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get contents of a specific folder
router.get("/folders/:folderId", authMiddleware, async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    if (!folder || folder.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "Folder not found" });
    }
    const subFolders = await Folder.find({ userId: req.user.id, parentFolderId: folderId });
    const files = await File.find({ userId: req.user.id, folderId });
    const cleanFolders = subFolders.map(f => f.toJSON());
    const cleanFiles = files.map(f => ({ id: f._id.toString(), name: f.fileName, fileType: f.fileType, size: f.fileSize }));
    res.json({ folders: cleanFolders, files: cleanFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete folder (and contents)
router.delete("/folders/:folderId", authMiddleware, async (req, res) => {
  try {
    const { folderId } = req.params;
    const folder = await Folder.findById(folderId);
    if (!folder || folder.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "Folder not found" });
    }
    // Delete all files in this folder
    await File.deleteMany({ folderId });
    // Delete all subfolders
    const subFolders = await Folder.find({ parentFolderId: folderId });
    for (const subFolder of subFolders) {
      await File.deleteMany({ folderId: subFolder._id });
      await Folder.deleteOne({ _id: subFolder._id });
    }
    await Folder.deleteOne({ _id: folderId });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Upload file
router.post("/files", authMiddleware, async (req, res) => {
  try {
    const { folderId, fileName, fileType, fileData } = req.body;
    if (!folderId || !fileName) return res.status(400).json({ error: "Folder ID and file name required" });
    
    const folder = await Folder.findById(folderId);
    if (!folder || folder.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "Folder not found" });
    }
    
    // Convert base64 to Buffer and save to disk to avoid storing large binary in MongoDB
    const buffer = Buffer.from(fileData, 'base64');
    // determine upload folder
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const uploadsDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${fileName}`;
    const filePath = path.join(uploadsDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    const file = await File.create({
      userId: req.user.id,
      folderId,
      name: fileName,
      fileName,
      fileType: fileType || "application/octet-stream",
      fileSize: buffer.length,
      filePath
    });

    res.json({ file: { id: file._id.toString(), name: file.fileName, fileType: file.fileType, size: file.fileSize } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Download file
router.get("/files/:fileId", authMiddleware, async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file || file.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "File not found" });
    }
    if (!file.filePath || !fs.existsSync(file.filePath)) return res.status(404).json({ error: "File missing on server" });
    res.download(file.filePath, file.fileName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete file
router.delete("/files/:fileId", authMiddleware, async (req, res) => {
  try {
    const { fileId } = req.params;
    const file = await File.findById(fileId);
    if (!file || file.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "File not found" });
    }
    // remove file from disk if exists
    try { if (file.filePath && fs.existsSync(file.filePath)) fs.unlinkSync(file.filePath); } catch (e) { console.warn("Failed to unlink file", e); }
    await File.deleteOne({ _id: fileId });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Rename file
router.put("/files/:fileId", authMiddleware, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { fileName } = req.body;
    if (!fileName) return res.status(400).json({ error: "File name required" });
    
    const file = await File.findById(fileId);
    if (!file || file.userId.toString() !== req.user.id) {
      return res.status(404).json({ error: "File not found" });
    }
    
    file.fileName = fileName;
    await file.save();
    res.json({ file: { id: file._id.toString(), name: file.fileName, fileType: file.fileType, size: file.fileSize } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
