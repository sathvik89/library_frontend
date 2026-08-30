import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@/Styles/Login.module.css";
import PreviousButton from "@/components/common/PreviousButton";
import RU from "@/assets/images/books/RUimage.png";
import { toast } from 'react-hot-toast';
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { loginUser, getCurrentUser } from "@/api/services/authService";
import { setupAxiosHeaders } from "@/api/axiosConfig";
import axios from "axios";

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
      const res = await loginUser(identifier, password, loginMode);
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
          const meResponse = await getCurrentUser();
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
      // axios rejects on any non-2xx, so surface the server's message when there is one
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.request) {
        toast.error("Cannot reach the server. Please check your connection.");
      } else {
        toast.error("Login failed. Please try again.");
      }
      console.error("Login error:", err);
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
