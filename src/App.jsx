import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Todo from "./components/Todo";
import CalendarPage from "./components/CalendarPage";
import Reminders from "./components/Reminders";
import Profile from "./components/Profile";
import QuickLinks from "./components/QuickLinks";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "animate.css";
import "./App.css";

function AppContent({ currentUser }) {
  const location = useLocation();
  const hideNavFooter = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="d-flex flex-column min-vh-100">
      {!hideNavFooter && <Navbar />}
      <div className="flex-grow-1 d-flex flex-column w-100">
        <Routes>
          <Route
            path="/login"
            element={
              currentUser ? <Navigate to="/" replace /> : <Login />
            }
          />
          <Route
            path="/signup"
            element={
              currentUser ? <Navigate to="/" replace /> : <Signup />
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute user={currentUser}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/todo" element={<Todo />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/reminders" element={<Reminders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/links" element={<QuickLinks />} />
                </Routes>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!hideNavFooter && <Footer />}
    </div>
  );
}

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppContent currentUser={currentUser} />
    </Router>
  );
}

export default App;