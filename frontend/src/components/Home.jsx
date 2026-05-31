import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center w-100 h-100 p-5" style={{ minHeight: "100vh", background: "var(--primary-bg)", color: "var(--text-color)" }}>
      <div className="animate__animated animate__fadeInDown mb-4">
        
        <h1 className="display-4 fw-bold" style={{ color: "var(--accent-color)" }}>Welcome to SmartTrack Dashboard</h1>
        <p className="lead" style={{ color: "var(--text-muted)" }}>Organize your university life smartly.</p>
      </div>
      <div className="row justify-content-center gap-4 mb-4">
        <div className="card shadow-sm p-3 border-0" style={{ width: 220, background: "var(--card-bg)", color: "var(--text-color)", borderRadius: 16 }}>
          <div className="mb-2" style={{ fontSize: "2.5rem" }}>🧠</div>
          <h5 className="fw-bold" style={{ color: "var(--accent-color)" }}>Study Planner</h5>
          <p className="small" style={{ color: "var(--text-muted)" }}>Generate AI-powered study schedules.</p>
          <Link to="/profile" className="btn btn-sm rounded-pill w-100 shadow-sm" style={{ background: "var(--accent-color)" }}>Plan Now</Link>
        </div>
        <div className="card shadow-sm p-3 border-0" style={{ width: 220, background: "var(--card-bg)", color: "var(--text-color)", borderRadius: 16 }}>
          <div className="mb-2" style={{ fontSize: "2.5rem", color: "var(--accent-color)" }}>📝</div>
          <h5 className="fw-bold" style={{ color: "var(--accent-color)" }}>To-Do List</h5>
          <p className="small" style={{ color: "var(--text-muted)" }}>Track your tasks and stay productive.</p>
          <Link to="/todo" className="btn btn-sm rounded-pill w-100 shadow-sm" style={{ background: "var(--accent-color)" }}>Go to To-Do</Link>
        </div>
        <div className="card shadow-sm p-3 border-0" style={{ width: 220, background: "var(--card-bg)", color: "var(--text-color)", borderRadius: 16 }}>
          <div className="mb-2" style={{ fontSize: "2.5rem", color: "var(--accent-color)" }}>📅</div>
          <h5 className="fw-bold" style={{ color: "var(--accent-color)" }}>Calendar</h5>
          <p className="small" style={{ color: "var(--text-muted)" }}>View and manage your schedule.</p>
          <Link to="/calendar" className="btn btn-sm rounded-pill w-100 shadow-sm" style={{ background: "var(--accent-color)" }}>Go to Calendar</Link>
        </div>
        <div className="card shadow-sm p-3 border-0" style={{ width: 220, background: "var(--card-bg)", color: "var(--text-color)", borderRadius: 16 }}>
          <div className="mb-2" style={{ fontSize: "2.5rem", color: "var(--accent-color)" }}>🗒️</div>
          <h5 className="fw-bold" style={{ color: "var(--accent-color)" }}>Notes</h5>
          <p className="small" style={{ color: "var(--text-muted)" }}>Create notes and manage files.</p>
          <Link to="/notes" className="btn btn-sm rounded-pill w-100 shadow-sm" style={{ background: "var(--accent-color)" }}>Go to Notes</Link>
        </div>
      </div>

      {/* Floating AI Assistant Icon */}
      <Link 
        to="/assistant" 
        className="position-fixed bottom-0 end-0 m-4 shadow-lg d-flex align-items-center justify-content-center transition-all assistant-float"
        style={{ 
          width: 70, height: 70, 
          background: "var(--header-gradient)", 
          borderRadius: "50%", 
          zIndex: 1000, 
          fontSize: "2rem",
          textDecoration: "none",
          border: "2px solid rgba(255,255,255,0.3)"
        }}
        title="Chat with AI Assistant"
      >
        🤖
      </Link>

      <style>
        {`
          .assistant-float:hover {
            transform: scale(1.1) rotate(10deg);
            box-shadow: 0 15px 30px rgba(0,0,0,0.3) !important;
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .assistant-float {
            animation: bounce 3s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
}
export default Home;