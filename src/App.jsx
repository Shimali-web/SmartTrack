console.log("Is Calendar loaded?", Calendar);
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "animate.css";
import { FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [markedDates, setMarkedDates] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, done: false }]);
      setNewTask("");
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

  const handleDateClick = (date) => {
    const dateStr = date.toDateString();
    if (markedDates.includes(dateStr)) {
      setMarkedDates(markedDates.filter((d) => d !== dateStr));
    } else {
      setMarkedDates([...markedDates, dateStr]);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month" && markedDates.includes(date.toDateString())) {
      return <FaCheckCircle className="text-success ms-1" />;
    }
    return null;
  };

  const addReminder = () => {
    if (newReminder.trim()) {
      setReminders([...reminders, newReminder]);
      setNewReminder("");
    }
  };

  const deleteReminder = (index) => {
    const updated = reminders.filter((_, i) => i !== index);
    setReminders(updated);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid px-4">
            <Link className="navbar-brand fw-bold" to="/">🎓 Unlife</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navBar">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navBar">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item"><Link className="nav-link" to="/todo">📝 To-Do</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/calendar">📅 Calendar</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/reminders">⏰ Reminders</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/profile">👤 Profile</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/links">🔗 Links</Link></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Pages */}
        <div className="flex-grow-1 d-flex flex-column w-100">
          <Routes>
            {/* Home */}
            <Route path="/" element={
              <div className="d-flex flex-column justify-content-center align-items-center text-center bg-light w-100 h-100 p-5">
                <div className="animate__animated animate__fadeInDown">
                  <h1 className="display-4 fw-bold text-primary">Welcome to Unlife Dashboard</h1>
                  <p className="lead text-muted">Organize your university life smartly.</p>
                </div>
                <div className="mt-4 animate__animated animate__fadeInUp animate__delay-1s">
                  <Link to="/todo" className="btn btn-lg btn-success mx-2">Start Planning</Link>
                  <Link to="/calendar" className="btn btn-lg btn-outline-secondary mx-2">Calendar View</Link>
                </div>
              </div>
            } />

            {/* To-Do */}
            <Route path="/todo" element={
              <div className="container-fluid px-4 py-3">
                <div className="card shadow-sm">
                  <div className="card-header bg-primary text-white">📝 To-Do List</div>
                  <div className="card-body">
                    <div className="input-group mb-3">
                      <input className="form-control" placeholder="Enter task" value={newTask} onChange={e => setNewTask(e.target.value)} />
                      <button className="btn btn-success" onClick={addTask}>Add</button>
                    </div>
                    <ul className="list-group">
                      {tasks.map((task, i) => (
                        <li key={i} className={`list-group-item ${task.done ? 'text-decoration-line-through' : ''}`}>
                          <span>{task.text}</span>
                          <div>
                            <button className="btn btn-sm btn-outline-success me-2" onClick={() => toggleTask(i)}>
                              {task.done ? 'Undo' : 'Done'}
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => removeTask(i)}>Delete</button>
                          </div>
                        </li>
                      ))}
                      {tasks.length === 0 && <li className="list-group-item text-muted">No tasks yet.</li>}
                    </ul>
                  </div>
                </div>
              </div>
            } />

            {/* Calendar */}
            <Route path="/calendar" element={
              <div className="container-fluid px-4 py-3">
                <div className="card shadow-sm">
                  <div className="card-header bg-warning text-dark">📅 Calendar</div>
                  <div className="card-body">
                    <p>Click on a date to mark it completed ✅</p>
                    <Calendar
                      onClickDay={handleDateClick}
                      tileContent={tileContent}
                      className="w-100 border rounded"
                    />
                  </div>
                </div>
              </div>
            } />

            {/* Reminders */}
            <Route path="/reminders" element={
              <div className="container-fluid px-4 py-3">
                <div className="card shadow-sm">
                  <div className="card-header bg-info text-white">⏰ Reminders</div>
                  <div className="card-body">
                    <div className="input-group mb-3">
                      <input className="form-control" placeholder="Enter reminder" value={newReminder} onChange={e => setNewReminder(e.target.value)} />
                      <button className="btn btn-dark" onClick={addReminder}>Add</button>
                    </div>
                    <ul className="list-group">
                      {reminders.map((r, i) => (
                        <li key={i} className="list-group-item d-flex justify-content-between">
                          {r}
                          <button className="btn btn-sm btn-danger" onClick={() => deleteReminder(i)}><FaTrashAlt /></button>
                        </li>
                      ))}
                      {reminders.length === 0 && <li className="list-group-item text-muted">No reminders yet.</li>}
                    </ul>
                  </div>
                </div>
              </div>
            } />

            {/* Profile */}
            <Route path="/profile" element={
              <div className="container-fluid px-18 py-13">
                <div className="card shadow-sm">
                  <div className="card-header bg-secondary text-white">👤 Profile</div>
                  <div className="card-body">
                    <input className="form-control mb-2" placeholder="Name" />
                    <input className="form-control mb-2" type="email" placeholder="Email" />
                    <input className="form-control mb-3" type="password" placeholder="Password" />
                    <button className="btn btn-dark">Update</button>
                  </div>
                </div>
              </div>
            } />

            {/* Quick Links */}
            <Route path="/links" element={
              <div className="container-fluid px-4 py-3">
                <div className="card shadow-sm">
                  <div className="card-header bg-success text-white">🔗 Quick Links</div>
                  <div className="card-body">
                    <ul className="list-unstyled">
                      <li><a href="https://moodle.org" target="_blank" rel="noopener noreferrer">📘 Moodle</a></li>
                      <li><a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">📧 Email</a></li>
                      <li><a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer">📅 Google Calendar</a></li>
                      <li><a href="https://libgen.rs" target="_blank" rel="noopener noreferrer">📚 Library</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted py-2 bg-white border-top">
          © 2025 Unlife Dashboard by Simran
        </footer>
      </div>
    </Router>
  );
}

export default App;
