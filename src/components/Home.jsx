import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center bg-light w-100 h-100 p-5" style={{ minHeight: "100vh", background: "#eaf1fb" }}>
      <div className="animate__animated animate__fadeInDown mb-4">
        
        <h1 className="display-4 fw-bold text-primary">Welcome to Unlife Dashboard</h1>
        <p className="lead text-muted">Organize your university life smartly.</p>
      </div>
      <div className="row justify-content-center gap-4 mb-4">
        <div className="card shadow-sm p-3" style={{ width: 220, background: "#f7fafd" }}>
          <div className="mb-2" style={{ fontSize: "2.5rem", color: "#2563eb" }}>📝</div>
          <h5 className="fw-bold">To-Do List</h5>
          <p className="text-muted small">Track your tasks and stay productive.</p>
          <Link to="/todo" className="btn btn-sm btn-primary">Go to To-Do</Link>
        </div>
        <div className="card shadow-sm p-3" style={{ width: 220, background: "#f7fafd" }}>
          <div className="mb-2" style={{ fontSize: "2.5rem", color: "#2563eb" }}>📅</div>
          <h5 className="fw-bold">Calendar</h5>
          <p className="text-muted small">View and manage your schedule.</p>
          <Link to="/calendar" className="btn btn-sm btn-primary">Go to Calendar</Link>
        </div>
        <div className="card shadow-sm p-3" style={{ width: 220, background: "#f7fafd" }}>
          <div className="mb-2" style={{ fontSize: "2.5rem", color: "#2563eb" }}>⏰</div>
          <h5 className="fw-bold">Reminders</h5>
          <p className="text-muted small">Never miss important deadlines.</p>
          <Link to="/reminders" className="btn btn-sm btn-primary">Go to Reminders</Link>
        </div>
        <div className="card shadow-sm p-3" style={{ width: 220, background: "#f7fafd" }}>
          <div className="mb-2" style={{ fontSize: "2.5rem", color: "#2563eb" }}>🔗</div>
          <h5 className="fw-bold">Quick Links</h5>
          <p className="text-muted small">Access useful university resources.</p>
          <Link to="/links" className="btn btn-sm btn-primary">Go to Links</Link>

        </div>
      </div>
    </div>
  );
}
export default Home;