import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@/Styles/Signup.module.css";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

import PreviousButton from "@/components/common/PreviousButton";
import RU from "@/assets/images/books/RUimage.png";
import { toast } from "react-hot-toast";
import { registerUser } from "@/api/services/authService";
import validatePasswords from "@/utils/validatePasswords";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Please fill all required fields (username, email, password).");
      return;
    }

    const passwordErrors = validatePasswords(password, confirmPassword);
  
    if (passwordErrors) {
      if (passwordErrors.password) {
        toast.error(passwordErrors.password);
      }
      if (passwordErrors.confirmPassword) {
        toast.error(passwordErrors.confirmPassword);
      }
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
        ...(role && { role }),
      };

      const response = await registerUser(body);

      toast.success(response.data.message || "Signup successful!");
      navigate("/login");
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
    <main className={styles.mainSignup}>
      <section>
        <img src={RU} alt="" className={styles.imageRU} />
        <h1 className={styles.titleSignup}>Create your account</h1>
        <p className={styles.subtitle}>
          Library Management System &middot; Rishihood University
        </p>

        <form onSubmit={handleSubmit} className={styles.formSignup}>
          <div className={styles.grid}>
            <label htmlFor="username" className={styles.field}>
              Username
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

            <label htmlFor="email" className={styles.field}>
              Email
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

            <label htmlFor="password" className={styles.field}>
              Password
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Set password"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  name="password"
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>
            </label>

            <label htmlFor="confirmPassword" className={styles.field}>
              Confirm password
              <div className={styles.passwordWrapper}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Confirm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  name="confirmPassword"
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )}
                </span>
              </div>
            </label>

            <div className={styles.divider} />

            <label htmlFor="phone" className={styles.field}>
              <span className={styles.labelText}>
                Phone <span className={styles.optional}>(optional)</span>
              </span>
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

            <label htmlFor="rollNo" className={styles.field}>
              <span className={styles.labelText}>
                Roll number <span className={styles.optional}>(optional)</span>
              </span>
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

            <label
              htmlFor="role"
              className={`${styles.field} ${styles.fullWidth}`}
            >
              <span className={styles.labelText}>
                Role <span className={styles.optional}>(optional)</span>
              </span>
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

            <button
              type="submit"
              className={styles.Signupsubmit}
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
        </form>

        <div className={styles.footerRow}>
          <PreviousButton navi={"/"} />
        </div>
      </section>
    </main>
  );
}

export default Signup;
