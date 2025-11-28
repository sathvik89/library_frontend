import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiConfig";
import { setupAxiosHeaders } from "../../utils/axiosConfig";

export const updateUser = async (userId, updateData) => {
  setupAxiosHeaders();
  const response = await axios.patch(API_ENDPOINTS.USER.UPDATE(userId), updateData);
  return response;
};

