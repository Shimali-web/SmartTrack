import { useState, useEffect } from "react";
import { FaTrashAlt, FaBell } from "react-icons/fa";

function Reminders() {
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem("reminders");
    return saved ? JSON.parse(saved) : [];
  });
  const [newReminder, setNewReminder] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (newReminder.trim()) {
      setReminders([...reminders, newReminder]);
      setNewReminder("");
      setSuccess("Reminder added!");
      setTimeout(() => setSuccess(""), 1200);
    }
  };

  const deleteReminder = (index) => {
    const updated = reminders.filter((_, i) => i !== index);
    setReminders(updated);
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
            {reminders.map((r, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  borderRadius: 12,
                  marginBottom: 8,
                  background: "#f7fafd",
                  boxShadow: "0 1px 4px #2563eb11",
                }}
              >
                <span className="fw-medium">{r}</span>
                <button
                  className="btn btn-sm btn-danger d-flex align-items-center"
                  style={{ borderRadius: 8 }}
                  onClick={() => deleteReminder(i)}
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