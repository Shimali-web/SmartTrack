import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useState, useEffect } from "react";
import { FaCog, FaSignOutAlt, FaTimes, FaBars, FaUserCircle } from "react-icons/fa";

function Navbar() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "default");
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    await auth.signOut();
    setShowLogoutConfirm(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const themes = [
    { id: "default", name: "Default Blue", color: "#2563eb" },
    { id: "purple", name: "Royal Purple", color: "#7c3aed" },
    { id: "dark", name: "Dark Mode", color: "#1e293b" },
    { id: "skyblue", name: "Sky Blue", color: "#0ea5e9" },
    { id: "neon", name: "Neon Glow", color: "#39ff14" },
    { id: "glossy", name: "Glossy Cyber", color: "#38bdf8" },
  ];

  const menuItems = [
    { path: "/", label: "🏠 Home" },
    { path: "/assistant", label: "🤖 Assistant" },
    { path: "/todo", label: "📝 To-Do" },
    { path: "/calendar", label: "📅 Calendar" },
    { path: "/notes", label: "📁 Notes" },
    { path: "/profile", label: "🧠 Study Planner" },
  ];

  return (
    <>
      <nav className="navbar sticky-top p-3 shadow-sm transition-all" style={{ background: "var(--navbar-bg)", borderBottom: "1px solid rgba(255,255,255,0.15)", zIndex: 1000 }}>
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            {/* Hamburger Trigger - Mobile Only */}
            <button className="btn btn-link text-white p-0 border-0 shadow-none d-lg-none menu-trigger" onClick={() => setIsMenuOpen(true)}>
              <FaBars size={24} style={{ color: "var(--text-color)" }} />
            </button>
            <Link className="navbar-brand fw-bold fs-3 mb-0" style={{ color: "var(--text-color)" }} to="/">🎓 SmartTrack</Link>
          </div>

          {/* Desktop Links - Restore emojis and original feel */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path} className="nav-link fw-medium transition-all px-2" style={{ color: "var(--text-color)", opacity: 0.8 }}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="d-flex align-items-center gap-2">
             <button className="btn btn-link p-2" onClick={() => setShowSettings(true)} title="Settings">
              <FaCog size={20} style={{ color: "var(--text-color)" }} />
            </button>
            {user && (
               <button className="btn btn-link p-2" onClick={() => setShowLogoutConfirm(true)} title="Logout">
                <FaUserCircle size={24} style={{ color: "var(--text-color)" }} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Modern Hamburger Menu Overlay - With Emojis */}
      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}>
        <div className="menu-content" onClick={e => e.stopPropagation()} style={{ background: "var(--header-gradient)" }}>
          <div className="menu-header d-flex justify-content-between align-items-center p-4">
            <h4 className="mb-0 text-white fw-bold">Menu</h4>
            <button className="btn btn-link text-white p-0 border-0" onClick={() => setIsMenuOpen(false)}>
              <FaTimes size={28} />
            </button>
          </div>

          <div className="menu-body p-4 pt-2">
            <ul className="list-unstyled d-flex flex-column gap-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className="menu-link d-flex align-items-center gap-3 p-3 rounded-4 transition-all text-decoration-none"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="menu-label fw-bold fs-5">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <hr className="my-4 opacity-10" />

            {user && (
              <button 
                className="btn btn-danger w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", zIndex: 1100 }} onClick={() => setShowSettings(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 28, background: "var(--card-bg)", color: "var(--text-color)" }}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="modal-title fw-bold fs-3">⚙️ Settings</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowSettings(false)}></button>
              </div>
              <div className="modal-body p-4">
                <h6 className="fw-bold mb-3 opacity-75">CHOOSE THEME</h6>
                <div className="row g-3">
                  {themes.map((t) => (
                    <div key={t.id} className="col-6">
                      <button 
                        className={`btn w-100 p-3 rounded-4 border-2 transition-all d-flex align-items-center gap-2 ${theme === t.id ? 'border-primary shadow-sm' : 'border-light-subtle'}`}
                        style={{ background: theme === t.id ? "rgba(255, 255, 255, 0.05)" : "transparent", color: "var(--text-color)" }}
                        onClick={() => setTheme(t.id)}
                      >
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: t.color, border: "2px solid rgba(255,255,255,0.2)" }}></div>
                        <span className="fw-medium small">{t.name}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button type="button" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" onClick={() => setShowSettings(false)}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", zIndex: 1100 }} onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-dialog modal-dialog-centered modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 28, background: "var(--card-bg)", color: "var(--text-color)" }}>
              <div className="modal-body p-5 text-center">
                <div className="mb-4" style={{ fontSize: "3.5rem" }}>🚪</div>
                <h4 className="fw-bold mb-2">Logout?</h4>
                <p className="text-muted mb-4">Are you sure you want to sign out of SmartTrack?</p>
                <div className="d-flex flex-column gap-2">
                  <button className="btn btn-danger py-3 rounded-pill fw-bold shadow-sm" onClick={handleLogout}>Yes, Logout</button>
                  <button className="btn btn-link text-decoration-none fw-bold" style={{ color: "var(--text-color)" }} onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .nav-link:hover { opacity: 1 !important; color: var(--accent-color) !important; transform: translateY(-2px); }
          .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(4px);
            visibility: hidden;
            opacity: 0;
            transition: all 0.4s ease;
            z-index: 1050;
          }
          .menu-overlay.open {
            visibility: visible;
            opacity: 1;
          }
          .menu-content {
            position: absolute;
            top: 0;
            left: -320px;
            width: 320px;
            height: 100%;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 10px 0 30px rgba(0,0,0,0.3);
            border-radius: 0 32px 32px 0;
          }
          .menu-overlay.open .menu-content {
            left: 0;
          }
          .menu-link {
            color: rgba(255,255,255,0.8);
            border: 1px solid transparent;
          }
          .menu-link:hover {
            background: rgba(255,255,255,0.1);
            color: white;
            border-color: rgba(255,255,255,0.1);
            transform: translateX(10px);
          }
          .transition-all { transition: all 0.3s ease; }
          .menu-trigger:hover { transform: scale(1.1); }
        `}
      </style>
    </>
  );
}

export default Navbar;