import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/Login.module.css";
import PreviousButton from "./PreviousButton";
import RU from "../BookImages/RUimage.png";
import GoogleLogin from "./GoogleLogin";
import {jwtDecode} from 'jwt-decode'; 
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from "../config/apiConfig";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
function Login() {
  const [loginMode, setLoginMode] = useState("username"); // "username" or "email"
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        
        // check if token exists in response
        if (!data.token) {
          toast.error("Login failed: No token received.");
          return;
        }
        
        // store token in localStorage
        localStorage.setItem("token", data.token);
        toast.success(`Logged in as: ${identifier}`);
        
        // decode token to get role and redirect
        try {
          const decoded = jwtDecode(data.token);
          console.log(decoded);
          const role = decoded.role;
          console.log(role);
          
          // redirect based on role
          if (role === "ADMIN") {
            navigate("/adminDashboard");
          } else if (role === "LIBRARIAN") {
            navigate("/librarianDashboard");
          } else if (role === "STUDENT") {
            navigate("/studentDashboard");
          } else {
            toast.error("Invalid role in token. Please contact support.");
            // clear invalid token
            localStorage.removeItem("token");
          }
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          toast.error("Failed to process login token. Please try again.");
          // clear invalid token
          localStorage.removeItem("token");
        }
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
    <main className={styles.mainLogin}>
      <section>
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
  <div className={styles.passwordWrapper}>
    <input
      id="pass"
      type={showPassword ? "text" : "password"}
      name="password"
      value={password}
      placeholder="Enter your password"
      onChange={(e) => setPassword(e.target.value)}
      disabled={loading}
    />

    <span
      className={styles.eyeIcon}
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
    </span>
  </div>
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
      </section>
    </main>
  );
}

export default Login;
