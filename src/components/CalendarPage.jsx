import { useState } from "react";
import Calendar from "react-calendar";
import { FaCheckCircle, FaRegCalendarAlt } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";

function CalendarPage() {
  const [markedDates, setMarkedDates] = useState([]);

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

  const tileClassName = ({ date, view }) => {
    if (view === "month" && markedDates.includes(date.toDateString())) {
      return "calendar-marked";
    }
    return "";
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "90vh",
        background: "linear-gradient(135deg, #eaf1fb 60%, #ffe082 100%)",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          maxWidth: 520,
          width: "100%",
          borderRadius: 28,
        }}
      >
        <div
          className="card-header bg-warning text-dark text-center fs-3 fw-bold d-flex align-items-center justify-content-center"
          style={{
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            letterSpacing: 1,
            gap: 10,
          }}
        >
          <FaRegCalendarAlt style={{ fontSize: "2rem" }} />
          <span>My Calendar</span>
        </div>
        <div className="card-body text-center">
          <p className="mb-3" style={{ fontWeight: 500, fontSize: "1.1rem" }}>
            <span className="text-primary">Click</span> any date to <span className="text-success">mark</span> or <span className="text-danger">unmark</span> it as completed!
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <Calendar
              onClickDay={handleDateClick}
              tileContent={tileContent}
              tileClassName={tileClassName}
              className="border rounded shadow calendar-custom"
              // calendarType="US" // REMOVE OR COMMENT THIS LINE IF YOU GET AN ERROR
            />
          </div>
          <div className="mt-3">
            <span className="badge bg-success text-white me-2">
              <FaCheckCircle className="mb-1" /> Marked
            </span>
            <span className="badge bg-secondary text-white">
              Unmarked
            </span>
          </div>
        </div>
      </div>
      <style>
        {`
          .calendar-custom {
            background: #fffbe7;
            border-radius: 18px;
            padding: 12px;
            box-shadow: 0 2px 16px #ffd60033;
          }
          .calendar-marked {
            background: #43a04722 !important;
            border-radius: 50% !important;
            font-weight: bold;
            color: #388e3c !important;
            transition: background 0.2s;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background: #ffe08299 !important;
            border-radius: 50%;
          }
          .react-calendar__navigation button {
            color: #ff9800;
            font-weight: bold;
            font-size: 1.1rem;
          }
        `}
      </style>
    </div>
  );
}
export default CalendarPage;