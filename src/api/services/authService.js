import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiConfig";
import { setupAxiosHeaders } from "../../utils/axiosConfig";

export const loginUser = async (identifier, password, loginMode) => {
  const payload = loginMode === "username"
    ? { username: identifier, password }
    : { email: identifier, password };

  const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, payload, {
    headers: { "Content-Type": "application/json" }
  });

  return response;
};

export const registerUser = async (userData) => {
  const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  return response;
};

export const getCurrentUser = async () => {
  setupAxiosHeaders();
  const response = await axios.get(API_ENDPOINTS.AUTH.ME);
  return response;
};

