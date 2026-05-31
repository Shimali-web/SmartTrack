import { useState, useEffect } from "react";
import { auth } from "../firebase";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

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

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [success, setSuccess] = useState("");
  const [lastAddedIndex, setLastAddedIndex] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await apiCall("/calendar/tasks");
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const dateStr = new Date().toISOString().split("T")[0];
      await apiCall("/calendar/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.trim(),
          dueDate: dateStr,
          priority: "medium"
        })
      });
      setNewTask("");
      setSuccess("Task added!");
      setLastAddedIndex(0);
      loadTasks();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      console.error(err);
      setSuccess("Failed to save task.");
      setTimeout(() => setSuccess(""), 1500);
    }
  };

  const toggleTask = async (id, done) => {
    try {
      await apiCall(`/calendar/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !done })
      });
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const removeTask = async (id) => {
    try {
      await apiCall(`/calendar/tasks/${id}`, { method: "DELETE" });
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="d-flex justify-content-center align-items-start p-4 w-100" style={{ minHeight: "90vh", background: "var(--primary-bg)", color: "var(--text-color)" }}>
      <div className="card shadow-lg w-100" style={{ maxWidth: 600, borderRadius: 24, background: "var(--card-bg)", color: "var(--text-color)" }}>
        <div className="card-header border-0 p-4" style={{ background: "var(--header-gradient)", borderRadius: "24px 24px 0 0" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0 text-white fw-bold">📝 Daily Tasks</h4>
              <p className="text-white-50 mb-0 small">Keep track of your productivity</p>
            </div>
            <div className="text-end">
              <span className="h3 mb-0 text-white fw-bold">{progress}%</span>
              <p className="text-white-50 mb-0 small">Completed</p>
            </div>
          </div>
          <div className="progress mt-3" style={{ height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 10 }}>
            <div className="progress-bar bg-white" style={{ width: `${progress}%`, transition: "width 0.5s ease" }}></div>
          </div>
        </div>

        <div className="card-body p-4 p-md-5">
          <div className="input-group mb-4 shadow-sm rounded-pill overflow-hidden p-1 border" style={{ background: "var(--primary-bg)" }}>
            <input
              className="form-control border-0 bg-transparent px-4"
              placeholder="What needs to be done?"
              style={{ fontSize: "1.1rem", color: "var(--text-color)" }}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button className="btn rounded-pill px-4" style={{ background: "var(--accent-color)" }} onClick={addTask}>
              <i className="bi bi-plus-lg me-1"></i> Add
            </button>
          </div>

          {success && (
            <div className="alert alert-success border-0 shadow-sm rounded-4 text-center py-2 mb-4">
              {success} ✨
            </div>
          )}

          <div className="task-list d-flex flex-column gap-3">
            {tasks.map((task, i) => (
              <div
                key={task.id}
                className={`task-item d-flex align-items-center justify-content-between p-3 rounded-4 border transition-all shadow-sm`}
                style={{ 
                  animation: i === lastAddedIndex ? "fadeInScale 0.4s ease-out" : "none",
                  background: task.completed ? "var(--primary-bg)" : "var(--card-bg)",
                  color: "var(--text-color)",
                  opacity: task.completed ? 0.7 : 1,
                  borderColor: "var(--accent-color)"
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className={`check-circle d-flex align-items-center justify-content-center cursor-pointer ${task.completed ? 'checked' : ''}`}
                    onClick={() => toggleTask(task.id, task.completed)}
                    style={{ 
                      width: 28, height: 28, borderRadius: "50%", border: "2px solid var(--accent-color)", 
                      cursor: "pointer", transition: "all 0.2s" 
                    }}
                  >
                    {task.completed && <span>✓</span>}
                  </div>
                  <span 
                    className={`fw-medium fs-5 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}
                    onClick={() => toggleTask(task.id, task.completed)}
                    style={{ cursor: "pointer" }}
                  >
                    {task.title}
                  </span>
                </div>
                <button
                  className="btn btn-link text-danger p-0"
                  onClick={() => removeTask(task.id)}
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-5">
                <div className="mb-3" style={{ fontSize: "4rem", opacity: 0.2 }}>🧘</div>
                <h5 style={{ color: "var(--text-muted)" }}>All caught up! Time for a break.</h5>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          .task-item:hover { transform: translateY(-2px); }
          .check-circle.checked { background: var(--accent-color); color: var(--primary-bg); }
          .cursor-pointer { cursor: pointer; }
          .transition-all { transition: all 0.3s ease; }
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Todo;