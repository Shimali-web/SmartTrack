import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { FaCheckCircle, FaRegCalendarAlt, FaPlus, FaTrash, FaCheckDouble } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../firebase";
import "react-calendar/dist/Calendar.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

async function apiCall(path, opts = {}) {
  const headers = opts.headers || {};
  if (auth._token) headers["Authorization"] = `Bearer ${auth._token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json().catch(() => ({}));
}

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllTasks();
  }, []);

  const loadAllTasks = async () => {
    try {
      const data = await apiCall("/calendar/tasks");
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async () => {
    if (!taskTitle.trim()) return;
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split("T")[0];
      await apiCall("/calendar/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskTitle,
          dueDate: dateStr,
          priority: taskPriority
        })
      });
      toast.success("Task Created! ✨");
      setTaskTitle("");
      loadAllTasks();
    } catch (err) {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try {
      await apiCall(`/calendar/tasks/${taskId}`, { method: "DELETE" });
      toast.success("Task deleted!");
      loadAllTasks();
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const toggleTaskComplete = async (task) => {
    try {
      await apiCall(`/calendar/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      loadAllTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return tasks.filter(t => t.dueDate.split("T")[0] === dateStr);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#10b981";
      default: return "#6b7280";
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateTasks = getTasksForDate(date);
      if (dateTasks.length > 0) {
        return (
          <div className="d-flex gap-1 justify-content-center mt-1">
            {dateTasks.slice(0, 3).map((t, idx) => (
              <div key={idx} style={{ width: 6, height: 6, borderRadius: "50%", background: getPriorityColor(t.priority) }} />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className="d-flex justify-content-center align-items-start p-4 w-100" style={{ minHeight: "90vh", background: "var(--primary-bg)", color: "var(--text-color)" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      
      <div className="card shadow-lg w-100" style={{ maxWidth: 1000, borderRadius: 24, overflow: "hidden", background: "var(--card-bg)", color: "var(--text-color)" }}>
        <div className="card-header border-0 p-4" style={{ background: "var(--header-gradient)" }}>
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white bg-opacity-25 p-3 rounded-4">
              <FaRegCalendarAlt className="text-white fs-2" />
            </div>
            <div>
              <h4 className="mb-0 text-white fw-bold">Academic Calendar</h4>
              <p className="text-white-50 mb-0 small">Schedule your tasks and deadlines</p>
            </div>
          </div>
        </div>

        <div className="card-body p-4 p-md-5">
          <div className="row g-5">
            <div className="col-lg-6">
              <div className="calendar-wrapper p-3 rounded-4 shadow-sm border" style={{ background: "var(--card-bg)", borderColor: "rgba(255,255,255,0.1)" }}>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="border-0 w-100"
                />
              </div>
              <div className="mt-4 d-flex justify-content-center gap-4">
                <div className="d-flex align-items-center gap-2 small fw-medium">
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }}></span> High
                </div>
                <div className="d-flex align-items-center gap-2 small fw-medium">
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }}></span> Medium
                </div>
                <div className="d-flex align-items-center gap-2 small fw-medium">
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }}></span> Low
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <i className="bi bi-list-check text-warning"></i>
                Tasks for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </h5>

              <div className="p-4 rounded-4 mb-4 border shadow-sm" style={{ background: "var(--primary-bg)", borderColor: "var(--accent-color) !important" }}>
                <input
                  type="text"
                  className="form-control border-0 shadow-sm rounded-pill px-4 mb-3"
                  placeholder="What's the goal?..."
                  style={{ background: "var(--card-bg)", color: "var(--text-color)" }}
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && createTask()}
                />
                <div className="d-flex justify-content-between align-items-center">
                  <select 
                    className="form-select form-select-sm border-0 shadow-sm rounded-pill px-3 w-auto"
                    style={{ background: "var(--card-bg)", color: "var(--text-color)" }}
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value)}
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                  <button className="btn rounded-pill px-4 fw-bold text-white" onClick={createTask} disabled={!taskTitle.trim() || loading} style={{ background: "var(--accent-color)", border: "none" }}>
                    <FaPlus className="me-1" /> Add Task
                  </button>
                </div>
              </div>

              <div className="task-container d-flex flex-column gap-3" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {selectedDateTasks.length === 0 ? (
                  <div className="text-center py-5 opacity-50">
                    <i className="bi bi-calendar-x fs-1"></i>
                    <p className="mt-2">No tasks scheduled for today.</p>
                  </div>
                ) : (
                  selectedDateTasks.map((task) => (
                    <div key={task.id} className={`p-3 rounded-4 border shadow-sm transition-all ${task.completed ? 'opacity-75' : ''}`} style={{ background: "var(--card-bg)", color: "var(--text-color)", borderColor: "var(--accent-color) !important" }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                          <div 
                            className="cursor-pointer d-flex align-items-center justify-content-center"
                            onClick={() => toggleTaskComplete(task)}
                            style={{ 
                              width: 24, height: 24, borderRadius: "50%", 
                              background: task.completed ? getPriorityColor(task.priority) : 'transparent',
                              border: `2px solid ${getPriorityColor(task.priority)}`
                            }}
                          >
                            {task.completed && <FaCheckDouble className="text-white small" size={10} />}
                          </div>
                          <span className={`fw-medium ${task.completed ? 'text-decoration-line-through opacity-50' : ''}`}>
                            {task.title}
                          </span>
                        </div>
                        <button className="btn btn-link text-danger p-0" onClick={() => deleteTask(task.id)}>
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .react-calendar { border: none !important; font-family: inherit; background: transparent !important; color: var(--text-color) !important; }
          .react-calendar__tile { color: var(--text-color) !important; }
          .react-calendar__navigation button { color: var(--text-color) !important; }
          .react-calendar__tile--active { background: var(--accent-color) !important; color: white !important; border-radius: 12px; }
          .react-calendar__tile:enabled:hover { background: var(--primary-bg) !important; border-radius: 12px; }
          .react-calendar__navigation button:enabled:hover { background: var(--primary-bg) !important; border-radius: 8px; }
          .transition-all { transition: all 0.2s ease; }
          .cursor-pointer { cursor: pointer; }
        `}
      </style>
    </div>
  );
}
export default CalendarPage;