import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignup = async () => {
    const data = await signup(username, email, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      setMsg("Signup successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      setMsg(data.error || "Signup failed");
    }
  };

  return (
    <div className="auth-container auth-dark">
      <div className="auth-form">
        <h2>Create Account</h2>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            placeholder="Create a password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {msg && <div className={msg.includes("successful") ? "success-message" : "error-message"}>{msg}</div>}

        <button className="auth-button" onClick={handleSignup}>Sign Up</button>

        <div className="auth-link">
          Already have an account? <a href="/">Sign In</a>
        </div>
      </div>
    </div>
  );
}
