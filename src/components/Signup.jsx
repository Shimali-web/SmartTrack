import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message); // Show the actual Firebase error
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
        onSubmit={handleSignup}
      >
        <div className="text-center mb-3">
          <span style={{ fontSize: "2.2rem" }}>📝</span>
          <h3 className="mb-1 fw-bold text-success">Sign Up</h3>
          <div className="text-muted mb-2" style={{ fontSize: "1rem" }}>
            Create your account to get started!
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
        <button className="btn btn-success w-100 mb-2 fw-bold" type="submit">
          Sign Up
        </button>
        <div className="text-center">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="fw-semibold text-decoration-underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
export default Signup;