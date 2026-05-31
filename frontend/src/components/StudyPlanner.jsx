import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { auth } from "../firebase";
import "../App.css";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api`;

async function apiCall(path, opts = {}) {
  const headers = opts.headers || {};
  if (auth?._token) headers["Authorization"] = `Bearer ${auth._token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json().catch(() => ({}));
}

function StudyPlanner() {
  const [subjects, setSubjects] = useState([{ subject: "", difficulty: "medium", chapters: "" }]);
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSubject = () => setSubjects([...subjects, { subject: "", difficulty: "medium", chapters: 1 }]);
  const updateSubject = (idx, field, value) => {
    const s = [...subjects];
    s[idx][field] = field === "chapters" ? (value === "" ? "" : Number(value)) : value;
    setSubjects(s);
  };
  const removeSubject = (idx) => setSubjects(subjects.filter((_, i) => i !== idx));

  const generatePlan = async () => {
    if (!examDate || subjects.length === 0) return alert("Please provide an exam date and at least one subject. 🕒");
    
    setLoading(true);
    setPlan(null);
    try {
      const data = await apiCall("/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjects, examDate, hoursPerDay })
      });
      setPlan(data.plan || "No plan generated. Try again.");
    } catch (err) {
      console.error(err);
      alert("Failed to generate plan. Please ensure the backend is running and GEMINI_API_KEY is configured.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start p-4 w-100" style={{ minHeight: "90vh", background: "var(--primary-bg)", color: "var(--text-color)" }}>
      <div className="card shadow-lg p-0" style={{ width: "100%", maxWidth: 1000, borderRadius: 16, background: "var(--card-bg)", color: "var(--text-color)", border: "var(--card-border)" }}>
        <div className="card-header border-0 d-flex align-items-center justify-content-between p-4" style={{ background: "var(--header-gradient)", borderRadius: "16px 16px 0 0" }}>
          <h4 className="mb-0 text-white fw-bold">🧠 AI Smart Study Planner</h4>
          <div className="small text-white-50 px-3 py-1 bg-white bg-opacity-25 rounded-pill">Powered by Gemini AI</div>
        </div>
        
        <div className="card-body p-4 p-md-5">
          <p className="mb-4 fs-5" style={{ color: "var(--text-muted)" }}>Plan smarter, not harder. Add your subjects, specify your exam date, and let the AI generate a tailored schedule just for you! 🎯</p>

          <div className="mb-4 p-4 rounded-4 shadow-sm border" style={{ background: "var(--primary-bg)", borderColor: "var(--accent-color) !important" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold" style={{ color: "var(--text-color)" }}>📚 Your Subjects</h5>
              <button className="btn btn-sm rounded-pill px-3 shadow-sm" style={{ background: "var(--accent-color)" }} onClick={addSubject}>+ Add Subject</button>
            </div>
            
            {subjects.map((s, idx) => (
              <div key={idx} className="row g-2 align-items-center mb-2 p-2 rounded-3 shadow-sm border" style={{ background: "var(--card-bg)", borderColor: "var(--accent-color) !important" }}>
                <div className="col-md-5">
                  <input className="form-control border-0" style={{ background: "var(--primary-bg)", color: "var(--text-color)" }} placeholder="E.g., Maths, Physics" value={s.subject} onChange={e => updateSubject(idx, "subject", e.target.value)} />
                </div>
                <div className="col-md-3">
                  <select className="form-select border-0" style={{ background: "var(--primary-bg)", color: "var(--text-color)" }} value={s.difficulty} onChange={e => updateSubject(idx, "difficulty", e.target.value)}>
                    <option value="weak">🔴 Weak</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="strong">🟢 Strong</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <input type="number" className="form-control border-0" style={{ background: "var(--primary-bg)", color: "var(--text-color)" }} min={1} value={s.chapters} title="Chapters" placeholder="Chapters" onChange={e => updateSubject(idx, "chapters", e.target.value)} />
                </div>
                <div className="col-md-2 d-flex justify-content-end">
                  <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => removeSubject(idx)}>Remove ❌</button>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="p-4 rounded-4 shadow-sm border border-light-subtle h-100" style={{ background: "var(--primary-bg)" }}>
                <label className="form-label fw-bold" style={{ color: "var(--text-color)" }}>📅 Exam Date</label>
                <input type="date" className="form-control border-0 shadow-sm p-3 rounded-3" style={{ background: "var(--card-bg)", color: "var(--text-color)" }} value={examDate} onChange={e => setExamDate(e.target.value)} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 rounded-4 shadow-sm border border-light-subtle h-100" style={{ background: "var(--primary-bg)" }}>
                <label className="form-label fw-bold" style={{ color: "var(--text-color)" }}>⏳ Study Hours / Day</label>
                <div className="d-flex align-items-center">
                  <input type="range" className="form-range flex-grow-1 me-3" min="1" max="14" step="1" value={hoursPerDay} onChange={e => setHoursPerDay(Number(e.target.value))} />
                  <span className="badge bg-primary fs-5 px-3 py-2 rounded-pill shadow-sm">{hoursPerDay} hrs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 d-flex justify-content-center pt-2">
            <button 
              className="btn px-5 py-3 fs-5 rounded-pill shadow-lg d-flex align-items-center gap-2" 
              style={{ background: "var(--header-gradient)", border: "none", transition: "transform 0.2s", color: "white" }}
              onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
              onClick={generatePlan} 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Generating Magic... ✨
                </>
              ) : "✨ Generate AI Study Plan"}
            </button>
          </div>

          {plan && !loading && (
            <div className="mt-5 slide-in-bottom">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold" style={{ color: "var(--text-color)" }}>📝 Your Personalized Master Plan</h4>
                <div className="small opacity-50" style={{ color: "var(--text-color)" }}>Generated by AI ✨</div>
              </div>

              <div className="card border-0 shadow-sm rounded-4" style={{ background: "var(--primary-bg)" }}>
                <div className="card-body p-4 p-md-5">
                  <div className="markdown-container" style={{ lineHeight: "1.8", color: "var(--text-color)" }}>
                    <ReactMarkdown>{plan}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudyPlanner;
