import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/Login.module.css";
import PreviousButton from "./PreviousButton";
import RU from "../BookImages/RUimage.png";
import GoogleLogin from "./GoogleLogin";
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from "../config/apiConfig";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import axios from "axios";
import { setupAxiosHeaders } from "../utils/axiosConfig";

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

      const res = await axios.post(API_ENDPOINTS.AUTH.LOGIN, payload, {
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.data;

      if (res.status === 200) {
        if (!data.token) {
          toast.error("Login failed: No token received.");
          return;
        }
        
        // store token in localStorage
        localStorage.setItem("token", data.token);
        
        // set axios default header
        setupAxiosHeaders();
        
        // Call /auth/me to get user info and verify token
        try {
          const meResponse = await axios.get(API_ENDPOINTS.AUTH.ME);
          const user = meResponse.data;
          
          toast.success(`Logged in as: ${user.userName}`);
          
          // redirect based on role from backend
          if (user.role === "ADMIN") {
            navigate("/adminDashboard");
          } else if (user.role === "LIBRARIAN") {
            navigate("/librarianDashboard");
          } else if (user.role === "STUDENT") {
            navigate("/studentDashboard");
          } else {
            toast.error("Invalid role. Please contact support.");
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
          }
        } catch (meError) {
          console.error("Error fetching user info:", meError);
          toast.error("Failed to verify authentication. Please try again.");
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
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
        {/* <div style={{ width: "100%" }}>
          <GoogleLogin textu="Login with" />
        </div> */}
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
