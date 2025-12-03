import { useState } from "react";
import { signin } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignin = async () => {
    if (!identifier.trim() || !password.trim()) {
      setMsg("Please enter both username/email and password");
      return;
    }

    setIsLoading(true);
    try {
      const data = await signin(identifier, password);
      console.log("Signin response:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        setMsg(""); // Clear error message
        navigate("/dashboard");
      } else {
        setMsg(data.message || data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Signin error:", error);
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
          <p className="auth-subtitle">Welcome back to your chat</p>
        </div>

        <div className="form-group">
          <label htmlFor="identifier">👤 Username or Email</label>
          <input
            id="identifier"
            placeholder="Enter your username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSignin()}
            disabled={isLoading}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">🔐 Password</label>
          <input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSignin()}
            disabled={isLoading}
            className="form-input"
          />
        </div>

        {msg && (
          <div className={msg.includes("Invalid") || msg.includes("required") ? "error-message" : "success-message"}>
            {msg}
          </div>
        )}

        <button 
          className="auth-button" 
          onClick={handleSignin}
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <div className="auth-divider">or</div>

        <div className="auth-link">
          Don't have an account? <a href="/signup">Create one here</a>
        </div>
      </div>
    </div>
  );
}
