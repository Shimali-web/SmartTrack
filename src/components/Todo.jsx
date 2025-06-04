import { useState, useEffect } from "react";

function Todo() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, done: false }]);
      setNewTask("");
      setSuccess("Task added!");
      setTimeout(() => setSuccess(""), 1000);
    }
  };

  const toggleTask = (index) => {
    const updated = tasks.map((t, i) =>
      i === index ? { ...t, done: !t.done } : t
    );
    setTasks(updated);
  };

  const removeTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh", background: "linear-gradient(135deg, #eaf1fb 60%, #c7e0ff 100%)" }}>
      <div className="card shadow-lg border-0" style={{ maxWidth: 450, width: "100%", borderRadius: 24 }}>
        <div className="card-header bg-primary text-white d-flex align-items-center justify-content-center" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
          <span style={{ fontSize: "1.7rem", marginRight: 8 }}>📝</span>
          <span className="fw-bold fs-5">To-Do List</span>
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <input
              className="form-control"
              placeholder="Enter task"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
            />
            <button className="btn btn-success" onClick={addTask}>
              Add
            </button>
          </div>
          {success && <div className="alert alert-success py-1 mb-2">{success}</div>}
          <ul className="list-group">
            {tasks.map((task, i) => (
              <li
                key={i}
                className={`list-group-item d-flex justify-content-between align-items-center shadow-sm mb-2 ${task.done ? "bg-light text-muted" : ""}`}
                style={{
                  borderRadius: 12,
                  background: task.done ? "#e0e7ef" : "#f7fafd",
                  boxShadow: "0 1px 4px #2563eb11",
                  textDecoration: task.done ? "line-through" : "none",
                  opacity: task.done ? 0.7 : 1,
                  transition: "all 0.2s"
                }}
              >
                <span className="fw-medium">{task.text}</span>
                <div>
                  <button
                    className={`btn btn-sm me-2 ${task.done ? "btn-outline-warning" : "btn-outline-success"}`}
                    onClick={() => toggleTask(i)}
                    title={task.done ? "Mark as Undone" : "Mark as Done"}
                  >
                    {task.done ? "Undo" : "Done"}
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeTask(i)}
                    title="Delete"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {tasks.length === 0 && (
              <li className="list-group-item text-muted text-center" style={{ borderRadius: 12 }}>
                No tasks yet.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Todo;