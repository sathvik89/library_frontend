import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { useAuth } from "../context/AuthContext";

const GoogleLogin = ({ textu }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      toast.success(`Welcome, ${googleUser.displayName || googleUser.email}!`);
      navigate("/studentDashboard");
    } catch (err) {
      toast.error("Google login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ width: "100%", marginTop: "10px" }}>
      {!user && (
        <button
          style={{ width: "100%", padding: "12px" }}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : `${textu || ''} Google`}
        </button>
      )}
    </div>
  );
};

export default GoogleLogin;
