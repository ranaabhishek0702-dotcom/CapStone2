import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setMsg("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const data = await signup(username, email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        setMsg("Signup successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMsg(data.message || data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMsg("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container auth-dark">
      <div className="auth-form">
        <div className="auth-header">
          <h1 className="app-title">💬 Chattr</h1>
          <p className="auth-subtitle">Join our chat community</p>
        </div>

        <div className="form-group">
          <label htmlFor="username">👤 Username</label>
          <input
            id="username"
            placeholder="Choose a unique username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            className="form-input"
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSignup()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">📧 Email</label>
          <input
            id="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            disabled={isLoading}
            className="form-input"
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSignup()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">🔐 Password</label>
          <input
            id="password"
            placeholder="Create a strong password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="form-input"
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSignup()}
          />
        </div>

        {msg && (
          <div className={msg.includes("successful") ? "success-message" : "error-message"}>
            {msg}
          </div>
        )}

        <button 
          className="auth-button" 
          onClick={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <div className="auth-divider">or</div>

        <div className="auth-link">
          Already have an account? <a href="/">Sign in here</a>
        </div>
      </div>
    </div>
  );
}
