import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Styles/Login.module.css";
import PreviousButton from "./PreviousButton";
import RU from "../BookImages/RUimage.png";
import { toast } from "react-hot-toast";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backendUrl = "https://library-backend-t3r9.onrender.com/auth/register"

  async function handleSubmit(e) {
    e.preventDefault();
    if (!username || !email || !password) {
      toast.error("Please fill all required fields (username, email, password).");
      return;
    }

    setLoading(true);
    try {
      const body = {
        username: username,
        email,
        password,
        ...(phone && { phone }),
        ...(rollNo && { rollNo: Number(rollNo) }),
        ...(role && { role })
      };

      const response = await axios.post(backendUrl, body);

      toast.success(response.data.message || "Signup successful!");
      navigate("/home"); 
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.mainLogin}>
      <section>
        <img src={RU} alt="" className={styles.imageRU} />
        <h1 className={styles.titleLogin}>Library Management System - Sign Up</h1>
        <form onSubmit={handleSubmit} className={styles.formLogin}>
        <label for="username">
          Username:
          <input
            id="username"
            type="text"
            value={username}
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            name="username"
          />
        </label>
        <br />
        <label for="email">
          Email:
          <input
            id="email"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            name="email"
          />
        </label>
        <br />
        <label for="password">
          Password:
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Set Password"
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            name="password"
          />
        </label>
        <br />
        <label for="phone">
          Phone (optional):
          <input
            id="phone"
            type="tel"
            value={phone}
            placeholder="Enter your phone"
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            name="phone"
          />
        </label>
        <br />
        <label for="rollNo">
          Roll Number (optional):
          <input
            id="rollNo"
            type="number"
            value={rollNo}
            placeholder="Enter your roll number"
            onChange={(e) => setRollNo(e.target.value)}
            disabled={loading}
            name="rollNo"
          />
        </label>
        <br />
        <label for="role">
          Role (optional):
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
            name="role"
          >
            <option value="">Select role</option>
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
            <option value="LIBRARIAN">Librarian</option>
          </select>
        </label>
        <br />
        <button type="submit" className={styles.Loginsubmit} disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div style={{ marginTop: "20px" }}>
        <PreviousButton navi={"/"} />
      </div>
      </section>
    </main>
  );
}

export default Signup;
