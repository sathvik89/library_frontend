import axios from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { setupAxiosHeaders } from "@/api/axiosConfig";

export const reserveBook = async (bookId) => {
  setupAxiosHeaders();
  const response = await axios.post(API_ENDPOINTS.RESERVATIONS.RESERVE(bookId));
  return response;
};


/** The holds queue — staff only. */
export const getReservations = async (params = {}) => {
  setupAxiosHeaders();
  return axios.get(API_ENDPOINTS.RESERVATIONS.LIST, { params });
};

/** Cancel a hold. The holder or staff may do this. */
export const cancelReservation = async (reservationId) => {
  setupAxiosHeaders();
  return axios.delete(API_ENDPOINTS.RESERVATIONS.CANCEL(reservationId));
};
