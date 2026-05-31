function QuickLinks() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eaf1fb 60%, #c7e0ff 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          minWidth: 400,
          maxWidth: 750,
          margin: "40px auto",
          width: "100%",
          borderRadius: 24,
        }}
      >
        <div
          className="card-header bg-success text-white text-center fs-4 fw-bold"
          style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, letterSpacing: 1 }}
        >
          🔗 Quick Links
        </div>
        <div className="card-body py-4">
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-6 d-flex justify-content-center">
              <a
                href="https://moodle.org"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-outline-primary d-flex flex-column align-items-center justify-content-center shadow-sm w-100"
                style={{
                  minWidth: 150,
                  minHeight: 130,
                  fontWeight: 600,
                  borderRadius: 18,
                  background: "#f7fafd",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 2px 8px #2563eb22",
                  marginRight: 12,
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.boxShadow = "0 4px 16px #2563eb33";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 8px #2563eb22";
                }}
              >
                <img src="public/MoodleLogo.png" alt="Moodle" width={120} height={120} className="mb-2" />
                Moodle
              </a>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-outline-danger d-flex flex-column align-items-center justify-content-center shadow-sm w-100"
                style={{
                  minWidth: 150,
                  minHeight: 130,
                  fontWeight: 600,
                  borderRadius: 18,
                  background: "#fff7f7",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 2px 8px #e5393522",
                  marginLeft: 12,
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.boxShadow = "0 4px 16px #e5393533";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 8px #e5393522";
                }}
              >
                <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" alt="Email" width={40} height={40} className="mb-2" />
                Email
              </a>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center">
              <a
                href="https://calendar.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-outline-success d-flex flex-column align-items-center justify-content-center shadow-sm w-100"
                style={{
                  minWidth: 150,
                  minHeight: 130,
                  fontWeight: 600,
                  borderRadius: 18,
                  background: "#f7fff7",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 2px 8px #43a04722",
                  marginRight: 12,
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.boxShadow = "0 4px 16px #43a04733";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 8px #43a04722";
                }}
              >
                <img src="public/calenderLogo.jpeg" alt="Google Calendar" width={120} height={120} className="mb-2" />
                Calendar
              </a>
            </div>
            <div className="col-12 col-md-6 d-flex justify-content-center">
              <a
                href="http://notion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-outline-secondary d-flex flex-column align-items-center justify-content-center shadow-sm w-100"
                style={{
                  minWidth: 150,
                  minHeight: 130,
                  fontWeight: 600,
                  borderRadius: 18,
                  background: "#f7f7fa",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 2px 8px #6c757d22",
                  marginLeft: 12,
                }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.boxShadow = "0 4px 16px #6c757d33";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 8px #6c757d22";
                }}
              >
                <img src="public/notion.jpg" alt="Library" width={120} height={120} className="mb-2" />
                Notion
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default QuickLinks;