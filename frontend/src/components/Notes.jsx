import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { FaFolder, FaFile, FaTrash, FaDownload, FaPlus, FaArrowLeft, FaEdit, FaEye, FaRobot } from "react-icons/fa";
import AIModal from "./AIModal";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api`;

async function apiCall(path, opts = {}) {
  const headers = opts.headers || {};
  if (auth._token) headers["Authorization"] = `Bearer ${auth._token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json().catch(() => ({}));
}

function Notes() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [renameFileId, setRenameFileId] = useState(null);
  const [renameFileName, setRenameFileName] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    loadFolders(null);
  }, []);

  const loadFolders = async (folderId) => {
    try {
      setError("");
      if (folderId === null) {
        const data = await apiCall("/notes/folders");
        setFolders(data.folders || []);
        setFiles([]);
        setCurrentFolderId(null);
      } else {
        const data = await apiCall(`/notes/folders/${folderId}`);
        setFolders(data.folders || []);
        setFiles(data.files || []);
        setCurrentFolderId(folderId);
      }
    } catch (err) {
      setError("Failed to load folders");
    }
  };

  const createFolder = async () => {
    if (!folderName.trim()) return;
    try {
      setLoading(true);
      await apiCall("/notes/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: folderName, parentFolderId: currentFolderId || undefined })
      });
      setSuccess("Folder created! 📂");
      setTimeout(() => setSuccess(""), 1500);
      setFolderName("");
      loadFolders(currentFolderId);
    } catch (err) {
      setError("Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  const deleteFolder = async (folderId) => {
    if (!confirm("Delete this folder and all its contents?")) return;
    try {
      await apiCall(`/notes/folders/${folderId}`, { method: "DELETE" });
      setSuccess("Folder deleted!");
      setTimeout(() => setSuccess(""), 1500);
      loadFolders(currentFolderId);
    } catch (err) {
      setError("Failed to delete folder");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || currentFolderId === null) return;
    try {
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result.split(",")[1];
          await apiCall("/notes/files", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              folderId: currentFolderId,
              fileName: file.name,
              fileType: file.type,
              fileData: base64
            })
          });
          setSuccess("File uploaded! 📄");
          setTimeout(() => setSuccess(""), 1500);
          loadFolders(currentFolderId);
        } catch (err) {
          setError("Upload failed: " + (err.message || "Unknown error"));
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to upload file");
      setLoading(false);
    }
  };

  const deleteFile = async (fileId) => {
    if (!confirm("Delete this file?")) return;
    try {
      await apiCall(`/notes/files/${fileId}`, { method: "DELETE" });
      setSuccess("File deleted!");
      setTimeout(() => setSuccess(""), 1500);
      loadFolders(currentFolderId);
    } catch (err) {
      setError("Failed to delete file");
    }
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const res = await fetch(`${API_BASE}/notes/files/${fileId}`, {
        headers: { "Authorization": `Bearer ${auth._token}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = fileName; a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download file");
    }
  };

  const openFile = async (fileId, fileName, fileType) => {
    try {
      setError("");
      const res = await fetch(`${API_BASE}/notes/files/${fileId}`, {
        headers: { "Authorization": `Bearer ${auth._token}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setPreviewFile({ url, fileName, fileType });
    } catch (err) {
      setError("Failed to open file");
    }
  };

  const submitRename = async () => {
    if (!renameFileName.trim()) return;
    try {
      setLoading(true);
      await apiCall(`/notes/files/${renameFileId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: renameFileName })
      });
      setSuccess("File renamed!");
      setRenameFileId(null);
      loadFolders(currentFolderId);
    } catch (err) {
      setError("Failed to rename file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start p-4 w-100" style={{ minHeight: "90vh", background: "var(--primary-bg)", color: "var(--text-color)" }}>
      <div className="card shadow-lg w-100" style={{ maxWidth: 1000, borderRadius: 24, overflow: "hidden", background: "var(--card-bg)", color: "var(--text-color)" }}>
        <div className="card-header border-0 p-4" style={{ background: "var(--header-gradient)" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white bg-opacity-25 p-3 rounded-4">
                <FaFolder className="text-white fs-2" />
              </div>
              <div>
                <h4 className="mb-0 text-white fw-bold">Cloud Notes</h4>
                <p className="text-white-50 mb-0 small">Securely store your study materials</p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button className="btn rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2" style={{ background: "var(--accent-color)", color: "white" }} onClick={() => setAiModalOpen(true)}>
                <FaRobot /> AI Studio
              </button>
              {currentFolderId && (
                <button className="btn btn-light rounded-pill px-4 fw-bold shadow-sm text-dark" onClick={() => loadFolders(null)}>
                  <FaArrowLeft className="me-2" /> Back
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card-body p-4 p-md-5">
          <div className="row g-4 mb-5">
            <div className="col-md-7">
              <div className="p-4 rounded-4 border shadow-sm h-100" style={{ background: "var(--primary-bg)", borderColor: "var(--accent-color) !important" }}>
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <FaPlus className="text-success" /> New Folder
                </h6>
                <div className="input-group">
                  <input className="form-control border-0 shadow-sm rounded-start-pill px-4" style={{ background: "var(--card-bg)", color: "var(--text-color)" }} placeholder="Enter name..." value={folderName} onChange={e => setFolderName(e.target.value)} onKeyDown={e => e.key === "Enter" && createFolder()} />
                  <button className="btn rounded-end-pill px-4 text-white" style={{ background: "var(--accent-color)" }} onClick={createFolder} disabled={!folderName.trim() || loading}>Create</button>
                </div>
              </div>
            </div>
            {currentFolderId && (
              <div className="col-md-5">
                <div className="p-4 rounded-4 border shadow-sm h-100 d-flex flex-column justify-content-center" style={{ background: "var(--primary-bg)", borderColor: "var(--accent-color) !important" }}>
                   <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <FaPlus className="text-primary" /> Upload File
                  </h6>
                  <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileUpload} />
                  <button className="btn rounded-pill w-100 fw-bold text-white" style={{ background: "var(--accent-color)" }} onClick={() => document.getElementById("fileInput").click()} disabled={loading}>
                    <FaFile className="me-2" /> Choose & Upload
                  </button>
                </div>
              </div>
            )}
          </div>

          {success && <div className="alert alert-success border-0 shadow-sm rounded-4 text-center py-2 mb-4">{success}</div>}
          {error && <div className="alert alert-danger border-0 shadow-sm rounded-4 text-center py-2 mb-4">{error}</div>}

          <div className="mb-5">
            <h5 className="fw-bold mb-4">📂 My Folders</h5>
            <div className="row g-3">
              {folders.map((f) => (
                <div key={f.id} className="col-6 col-sm-4 col-md-3">
                  <div className="folder-card p-3 rounded-4 border text-center transition-all shadow-sm" style={{ background: "var(--card-bg)", color: "var(--text-color)", borderColor: "var(--accent-color) !important" }} onClick={() => loadFolders(f.id)}>
                    <div className="folder-icon mb-2">📁</div>
                    <div className="fw-bold text-truncate px-2">{f.name}</div>
                    <button className="btn btn-link text-danger p-0 mt-2" onClick={(e) => { e.stopPropagation(); deleteFolder(f.id); }}>
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {folders.length === 0 && <p className="text-muted text-center py-4">No folders created yet.</p>}
            </div>
          </div>

          {currentFolderId && (
            <div>
              <h5 className="fw-bold mb-4">📄 Files in this Folder</h5>
              <div className="row g-3">
                {files.map((f) => (
                  <div key={f.id} className="col-6 col-sm-4 col-md-3">
                    <div className="file-card p-3 rounded-4 border text-center transition-all shadow-sm" style={{ background: "var(--card-bg)", color: "var(--text-color)", borderColor: "var(--accent-color) !important" }}>
                      <div className="file-icon mb-2">📄</div>
                      <div className="fw-bold text-truncate px-2 small">{f.name}</div>
                      <div className="text-muted x-small">{(f.size / 1024).toFixed(1)} KB</div>
                      <div className="d-flex justify-content-center gap-2 mt-3 pt-2 border-top border-secondary border-opacity-25">
                        <button className="btn btn-sm btn-outline-primary border-0" onClick={(e) => { e.stopPropagation(); openFile(f.id, f.name, f.fileType); }}><FaEye size={12} /></button>
                        <button className="btn btn-sm btn-outline-secondary border-0" onClick={(e) => { e.stopPropagation(); setRenameFileId(f.id); setRenameFileName(f.name); }}><FaEdit size={12} /></button>
                        <button className="btn btn-sm btn-outline-info border-0" onClick={(e) => { e.stopPropagation(); downloadFile(f.id, f.name); }}><FaDownload size={12} /></button>
                        <button className="btn btn-sm btn-outline-danger border-0" onClick={(e) => { e.stopPropagation(); deleteFile(f.id); }}><FaTrash size={12} /></button>
                      </div>
                      {renameFileId === f.id && (
                        <div className="mt-3">
                          <div className="input-group input-group-sm">
                            <input className="form-control" value={renameFileName} onChange={(e) => setRenameFileName(e.target.value)} />
                            <button className="btn btn-sm btn-success" onClick={submitRename} disabled={!renameFileName.trim() || loading}>Save</button>
                            <button className="btn btn-sm btn-secondary" onClick={() => setRenameFileId(null)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {files.length === 0 && <p className="text-muted text-center py-4">This folder is empty.</p>}
              </div>
              {previewFile && (
                <div className="preview-modal-backdrop" onClick={() => { window.URL.revokeObjectURL(previewFile.url); setPreviewFile(null); }}>
                  <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="mb-1">Preview: {previewFile.fileName}</h6>
                        <p className="small text-muted mb-0">{previewFile.fileType}</p>
                      </div>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => { window.URL.revokeObjectURL(previewFile.url); setPreviewFile(null); }}>
                        Close
                      </button>
                    </div>
                    <div style={{ minHeight: 350, maxHeight: '65vh' }}>
                      <iframe src={previewFile.url} title={previewFile.fileName} width="100%" height="100%" style={{ border: "1px solid rgba(255,255,255,0.1)", minHeight: 350 }} />
                    </div>
                    <p className="small text-muted mt-3">If the file type does not render, use the download button.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          .folder-card, .file-card { cursor: pointer; border: 2px solid transparent !important; }
          .folder-card:hover, .file-card:hover { transform: translateY(-5px); border-color: #10b981 !important; box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; }
          .folder-icon, .file-icon { font-size: 3rem; }
          .transition-all { transition: all 0.3s ease; }
          .x-small { font-size: 0.75rem; }
          .preview-modal-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1050;
            padding: 1.5rem;
          }
          .preview-modal-content {
            width: min(900px, 100%);
            max-height: 90vh;
            background: var(--card-bg);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 24px;
            padding: 1.5rem;
            overflow: hidden;
            box-shadow: 0 25px 60px rgba(0,0,0,0.35);
          }
          /* Custom styles for AI Modal items */
          .cursor-pointer { cursor: pointer; }
          .flashcard:hover { filter: brightness(1.05); }
        `}
      </style>

      <AIModal 
        isOpen={aiModalOpen} 
        onClose={() => setAiModalOpen(false)} 
        apiCall={apiCall}
      />
    </div>
  );
}

export default Notes;
