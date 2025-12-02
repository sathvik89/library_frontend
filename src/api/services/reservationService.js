import axios from "axios";
import { API_ENDPOINTS } from "../../config/apiConfig";
import { setupAxiosHeaders } from "../../utils/axiosConfig";

export const reserveBook = async (bookId) => {
  setupAxiosHeaders();
  const response = await axios.post(API_ENDPOINTS.RESERVATIONS.RESERVE(bookId));
  return response;
};

