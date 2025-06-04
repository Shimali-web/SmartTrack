import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useState, useEffect } from "react";

function Navbar() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <nav className={`navbar navbar-expand-lg ${theme === "dark" ? "navbar-dark bg-dark" : "navbar-dark bg-primary"}`}>
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
            <li className="nav-item">
              <button className="btn btn-link nav-link" style={{ color: "#fff" }} onClick={toggleTheme}>
                {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
              </button>
            </li>
            {user && (
              <li className="nav-item">
                <button className="btn btn-link nav-link" style={{ color: "#fff" }} onClick={handleLogout}>
                  🚪 Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;