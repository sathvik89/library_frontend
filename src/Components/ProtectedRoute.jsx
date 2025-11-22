import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import axios from "axios";
import { API_ENDPOINTS } from "../config/apiConfig";
import { setupAxiosHeaders } from "../utils/axiosConfig";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // setting axios header
      setupAxiosHeaders();

      try {
        const response = await axios.get(API_ENDPOINTS.AUTH.ME);
        const user = response.data;

        // checking if user role is allowed
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          navigate("/login");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, allowedRoles]);

  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh"
      }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;

