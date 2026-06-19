import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page" role="main">
      <section id="hero" className="hero-panel" aria-labelledby="hero-heading">
        <div className="container hero-grid">
          <div className="hero-copy animate__animated animate__fadeInUp">
            <span className="eyebrow">AI-powered student success platform</span>
            <h1 id="hero-heading" className="hero-headline">SmartTrack helps students stay organized, focused, and ahead.</h1>
            <p className="hero-subtitle">A professional dashboard for planning study sessions, tracking assignments, managing notes, and using AI to power your learning workflow.</p>
            <div className="hero-actions">
              <Link to="/profile" className="btn primary-cta">Start your free plan</Link>
              <a href="#features" className="btn secondary-cta">Explore features</a>
            </div>
            <div className="hero-badges" aria-label="Trusted by indicators">
              <div className="badge-pill">Trusted by 1,200+ students</div>
              <div className="badge-pill">99.8% uptime</div>
              <div className="badge-pill">AI-driven recommendations</div>
            </div>
          </div>

          <div className="hero-panel-card animate__animated animate__fadeInRight">
            <div className="hero-card-top">
              <span className="hero-card-chip">New</span>
              <span className="hero-card-status">Performance & AI</span>
            </div>
            <div className="hero-card-content">
              <h2>SmartTrack Studio</h2>
              <p>Fast access to your planner, reminders, notes, and assistant from one intelligent dashboard.</p>
              <ul>
                <li>Custom study timelines</li>
                <li>Smooth workflow scheduling</li>
                <li>Secure data sync</li>
              </ul>
            </div>
            <div className="hero-card-footer">
              <span>Built for reliability, speed, and accessibility.</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section-block" aria-labelledby="features-heading">
        <div className="container">
          <div className="section-header text-center mb-5">
            <p className="section-label">Core benefits</p>
            <h2 id="features-heading" className="section-title">Modern tools designed for focused students</h2>
            <p className="section-lead">Boost productivity with clear study planning, smarter reminders, and AI-assisted note management.</p>
          </div>
          <div className="feature-grid">
            <article className="feature-card animate__animated animate__fadeInUp">
              <div className="feature-icon">🧠</div>
              <h3>AI Study Planning</h3>
              <p>Create adaptive plans that respond to your schedule, course load, and exam dates.</p>
            </article>
            <article className="feature-card animate__animated animate__fadeInUp animate__delay-1s">
              <div className="feature-icon">📝</div>
              <h3>Smart Task Management</h3>
              <p>Track deadlines, prioritize assignments, and stay on top of important milestones.</p>
            </article>
            <article className="feature-card animate__animated animate__fadeInUp animate__delay-2s">
              <div className="feature-icon">📚</div>
              <h3>Notes & Resources</h3>
              <p>Organize notes, attach files, and access study materials in one polished workspace.</p>
            </article>
            <article className="feature-card animate__animated animate__fadeInUp animate__delay-3s">
              <div className="feature-icon">🤖</div>
              <h3>AI Assistant</h3>
              <p>Get instant support for study ideas, summaries, reminders, and productivity prompts.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="timeline" className="section-block section-alt" aria-labelledby="timeline-heading">
        <div className="container">
          <div className="section-header text-center mb-5">
            <p className="section-label">How it works</p>
            <h2 id="timeline-heading" className="section-title">From planning to achievement</h2>
          </div>
          <div className="timeline">
            <div className="timeline-item animate__animated animate__fadeInLeft">
              <span className="timeline-step">1</span>
              <div>
                <h3>Set your priorities</h3>
                <p>Capture courses, assignments, exams, and goals with a single intelligent workflow.</p>
              </div>
            </div>
            <div className="timeline-item animate__animated animate__fadeInUp">
              <span className="timeline-step">2</span>
              <div>
                <h3>Plan smarter</h3>
                <p>Generate study schedules, reminders, and progress milestones using AI insights.</p>
              </div>
            </div>
            <div className="timeline-item animate__animated animate__fadeInRight">
              <span className="timeline-step">3</span>
              <div>
                <h3>Execute with confidence</h3>
                <p>Stay on track with notifications, a visual calendar, and trusted analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="section-block" aria-labelledby="trust-heading">
        <div className="container">
          <div className="section-header text-center mb-5">
            <p className="section-label">Trusted and reliable</p>
            <h2 id="trust-heading" className="section-title">Designed for ambitious students who need dependable tools</h2>
          </div>
          <div className="trust-grid">
            <div className="trust-card animate__animated animate__fadeInUp">
              <strong>99.9% uptime</strong>
              <p>Fast, reliable performance even during heavy study periods.</p>
            </div>
            <div className="trust-card animate__animated animate__fadeInUp animate__delay-1s">
              <strong>Secure by design</strong>
              <p>Data-first privacy and secure storage for your study plans and notes.</p>
            </div>
            <div className="trust-card animate__animated animate__fadeInUp animate__delay-2s">
              <strong>Student-focused</strong>
              <p>Built to support daily routines, exam prep, and life balance.</p>
            </div>
            <div className="trust-card animate__animated animate__fadeInUp animate__delay-3s">
              <strong>Expert workflow</strong>
              <p>Modern design and productive interactions keep every session efficient.</p>
            </div>
          </div>
        </div>
      </section>

      <Link
        to="/assistant"
        className="position-fixed bottom-0 end-0 m-4 shadow-lg d-flex align-items-center justify-content-center transition-all assistant-float"
        aria-label="Open AI Assistant"
        title="Chat with AI Assistant"
      >
        🤖
      </Link>
    </main>
  );
}

export default Home;
