import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/Login.module.css";
import PreviousButton from "./PreviousButton";
import RU from "../BookImages/RUimage.png";
import GoogleLogin from "./GoogleLogin";
import { toast } from 'react-hot-toast';

function Login() {
  const [loginMode, setLoginMode] = useState("username"); // "username" or "email"
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handles login via username or email
  async function handleSubmit(e) {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error(
        `Please enter both ${loginMode === "username" ? "username" : "email"} and password.`
      );
      return;
    }
    setLoading(true);
    try {
      let payload = loginMode === "username"
        ? { username: identifier, password }
        : { email: identifier, password };

      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        toast.success(`Logged in as: ${identifier}`);
        navigate("/home");
      } else {
        toast.error(data.message || "Login failed.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function handleToggleMode() {
    setLoginMode(loginMode === "username" ? "email" : "username");
    setIdentifier(""); 
  }

  return (
    <div className={styles.mainLogin}>
      <img className={styles.imageRU} src={RU} alt="" />
      <h1 className={styles.titleLogin}>Library Management System</h1>
      <form onSubmit={handleSubmit} className={styles.formLogin}>
        <label htmlFor="identifier">
          {loginMode === "username"
            ? "Username:"
            : "Email:"}
          <input
            id="identifier"
            type={loginMode === "username" ? "text" : "email"}
            name={loginMode}
            value={identifier}
            placeholder={loginMode === "username"
              ? "Enter your username"
              : "Enter your email"}
            onChange={e => setIdentifier(e.target.value)}
            disabled={loading}
          />
        </label>
        <div
          style={{
            cursor: "pointer",
            fontSize: "0.98em",
            color: "#900b09",
            marginTop: "2px",
            marginBottom: "12px"
          }}
          onClick={handleToggleMode}
        >
          {loginMode === "username"
            ? "Or, enter email instead"
            : "Or, enter username instead"}
        </div>
        <label htmlFor="pass">
          Password:
          <input
            id="pass"
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
        </label>
        <br />
        <div style={{ width: "100%" }}>
          <GoogleLogin textu="Login with" />
        </div>
        <button className={styles.Loginsubmit} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div style={{ marginTop: "20px" }}>
        <PreviousButton navi={"/"} />
      </div>
    </div>
  );
}

export default Login;
