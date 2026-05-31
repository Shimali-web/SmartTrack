import { useEffect, useState, useRef } from "react";
import { auth, updateProfile } from "../firebase";

function Profile() {
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [email, setEmail] = useState(user ? user.email : "");
  const [photoURL, setPhotoURL] = useState(user && user.photoURL ? user.photoURL : "");
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
      setNewName(user.displayName || "");
    }
  }, [user]);

  const handleEdit = () => {
    setEditing(true);
    setSuccess("");
    setError("");
  };

  const handleCancel = () => {
    setEditing(false);
    setNewName(name);
    setSuccess("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user, { displayName: newName });
      setName(newName);
      setEditing(false);
      setSuccess("Profile updated!");
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  // Handle image upload and preview
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    // Convert image to base64 (for demo/local use; for production, upload to storage and use the URL)
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await updateProfile(user, { photoURL: reader.result });
        setPhotoURL(reader.result);
        setSuccess("Profile photo updated!");
      } catch {
        setError("Failed to update photo.");
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", background: "linear-gradient(135deg, #eaf1fb 60%, #c7e0ff 100%)" }}>
      <div className="card shadow-lg border-0" style={{ maxWidth: 420, width: "100%", borderRadius: 24 }}>
        <div className="card-header bg-primary text-white d-flex align-items-center justify-content-center" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
          <span className="me-2" style={{ fontSize: "2.2rem" }}>👤</span>
          <span className="fw-bold fs-4">Your Profile</span>
        </div>
        <div className="card-body text-center">
          <div className="mb-3 position-relative">
            {photoURL ? (
              <img
                src={photoURL}
                alt="Profile"
                className="avatar avatar--img mb-2"
                onClick={() => fileInputRef.current.click()}
                title="Click to change photo"
              />
            ) : (
              <div
                className="avatar avatar--fallback mb-2"
                onClick={() => fileInputRef.current.click()}
                title="Click to add photo"
              >
                {name ? name[0].toUpperCase() : (email ? email[0].toUpperCase() : "U")}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
              disabled={uploading}
            />
            <div>
              <button
                className="btn btn-link btn-sm text-decoration-underline"
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
              >
                {photoURL ? "Change Photo" : "Add Photo"}
              </button>
            </div>
          </div>
          {editing ? (
            <form onSubmit={handleSave} className="mb-2">
              <input
                className="form-control mb-2"
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Enter name"
                required
                autoFocus
              />
              <button className="btn btn-success btn-sm me-2 px-3" type="submit">Save</button>
              <button className="btn btn-secondary btn-sm px-3" type="button" onClick={handleCancel}>Cancel</button>
            </form>
          ) : (
            <>
              <h4 className="mb-1 fw-bold text-primary">{name || "No Name Set"}</h4>
              <button className="btn btn-outline-primary btn-sm mb-2 px-3" onClick={handleEdit}>Edit Name</button>
            </>
          )}
          <div className="mb-3">
            <span className="badge bg-light text-dark px-3 py-2" style={{ fontSize: "1rem", border: "1px solid #2563eb" }}>
              <span style={{ fontWeight: 500 }}>Email:</span> {email}
            </span>
          </div>
          {success && <div className="alert alert-success py-1">{success}</div>}
          {error && <div className="alert alert-danger py-1">{error}</div>}
        </div>
      </div>
    </div>
  );
}
export default Profile;