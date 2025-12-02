import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiConfig";
import { setupAxiosHeaders } from "../../utils/axiosConfig";

export const getAllUsers = async (params = {}) => {
  setupAxiosHeaders();
  const response = await axios.get(API_ENDPOINTS.USER.GET_ALL, { params });
  return response;
};

export const getUserById = async (userId) => {
  setupAxiosHeaders();
  const response = await axios.get(API_ENDPOINTS.USER.GET_BY_ID(userId));
  return response;
};

export const updateUser = async (userId, updateData) => {
  setupAxiosHeaders();
  const response = await axios.patch(API_ENDPOINTS.USER.UPDATE(userId), updateData);
  return response;
};

export const deleteUser = async (userId) => {
  setupAxiosHeaders();
  const response = await axios.delete(API_ENDPOINTS.USER.DELETE(userId));
  return response;
};