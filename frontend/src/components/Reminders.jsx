import { useState, useEffect } from "react";
import { FaTrashAlt, FaBell } from "react-icons/fa";
import { auth } from "../firebase";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api`;

async function apiCall(path, opts = {}) {
  const headers = opts.headers || {};
  if (auth._token) headers["Authorization"] = `Bearer ${auth._token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }
  return res.json().catch(() => ({}));
}

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const data = await apiCall("/reminders");
      setReminders(data.reminders || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addReminder = async () => {
    if (!newReminder.trim()) return;
    try {
      await apiCall("/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newReminder.trim() })
      });
      setNewReminder("");
      setSuccess("Reminder added!");
      loadReminders();
      setTimeout(() => setSuccess(""), 1200);
    } catch (err) {
      console.error(err);
      setSuccess("Failed to save reminder.");
      setTimeout(() => setSuccess(""), 1200);
    }
  };

  const deleteReminder = async (reminderId) => {
    try {
      await apiCall(`/reminders/${reminderId}`, { method: "DELETE" });
      loadReminders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "90vh",
        background: "linear-gradient(135deg, #eaf1fb 60%, #c7e0ff 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: 420,
          width: "100%",
          borderRadius: 24,
        }}
      >
        <div
          className="card-header bg-info text-white text-center fs-4 fw-bold d-flex align-items-center justify-content-center"
          style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, letterSpacing: 1 }}
        >
          <FaBell className="me-2" />
          Reminders
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              className="form-control"
              placeholder="Enter reminder"
              value={newReminder}
              onChange={e => setNewReminder(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addReminder()}
            />
            <button className="btn btn-info text-white fw-bold" onClick={addReminder}>
              Add
            </button>
          </div>
          {success && <div className="alert alert-success py-1 mb-2">{success}</div>}
          <ul className="list-group">
            {reminders.map((r) => (
              <li
                key={r.id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  borderRadius: 12,
                  marginBottom: 8,
                  background: "#f7fafd",
                  boxShadow: "0 1px 4px #2563eb11",
                }}
              >
                <span className="fw-medium">{r.text}</span>
                <button
                  className="btn btn-sm btn-danger d-flex align-items-center"
                  style={{ borderRadius: 8 }}
                  onClick={() => deleteReminder(r.id)}
                  title="Delete"
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
            {reminders.length === 0 && (
              <li className="list-group-item text-muted text-center" style={{ borderRadius: 12 }}>
                No reminders yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Reminders;