import { useState } from "react";
import { signin } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignin = async () => {
    const data = await signin(identifier, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      navigate("/dashboard"); // redirect to dashboard
    } else {
      setMsg(data.message || data.error || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container auth-dark">
      <div className="auth-form">
        <h2>Welcome Back</h2>

        <div className="form-group">
          <label htmlFor="identifier">Username or Email</label>
          <input
            id="identifier"
            placeholder="Username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {msg && <div className={msg.includes("Invalid") ? "error-message" : "success-message"}>{msg}</div>}

        <button className="auth-button" onClick={handleSignin}>Sign In</button>

        <div className="auth-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
