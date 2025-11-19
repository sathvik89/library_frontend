import axios from "axios";
import { API_ENDPOINTS } from "../config/apiConfig";
import { toast } from "react-hot-toast";

// Set up axios default headers
const setupAxiosHeaders = () => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Initialize axios headers on module load
setupAxiosHeaders();

// Response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      
      // Only show error if not already on login page
      if (!window.location.pathname.includes("/login")) {
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { setupAxiosHeaders };

