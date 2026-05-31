import React, { useState } from "react";
import { signInWithEmailAndPassword, auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eaf1fb 60%, #c7e0ff 100%)",
      }}
    >
      <form
        className="card p-4 shadow-lg border-0"
        style={{
          minWidth: 340,
          maxWidth: 400,
          width: "100%",
          borderRadius: 20,
        }}
        onSubmit={handleLogin}
      >
        <div className="text-center mb-3">
          <span style={{ fontSize: "2.2rem" }}>🔒</span>
          <h3 className="mb-1 fw-bold text-primary">Login</h3>
          <div className="text-muted mb-2" style={{ fontSize: "1rem" }}>
            Welcome back! Please login to your account.
          </div>
        </div>
        {error && <div className="alert alert-danger py-1">{error}</div>}
        <input
          className="form-control mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100 mb-2 fw-bold" type="submit">
          Login
        </button>
        <div className="text-center">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/signup" className="fw-semibold text-decoration-underline">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
export default Login;