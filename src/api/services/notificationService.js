import axios from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { setupAxiosHeaders } from "@/api/axiosConfig";

export const getMyNotifications = async () => {
  setupAxiosHeaders();
  return axios.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
};

export const markNotificationRead = async (id) => {
  setupAxiosHeaders();
  return axios.patch(API_ENDPOINTS.NOTIFICATIONS.READ(id));
};

export const markAllNotificationsRead = async () => {
  setupAxiosHeaders();
  return axios.patch(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
};
