import axios from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { setupAxiosHeaders } from "@/api/axiosConfig";

/** The signed-in member's own borrowing, with a summary block. */
export const getMyLoans = async () => {
  setupAxiosHeaders();
  return axios.get(API_ENDPOINTS.LOANS.MINE);
};

/** Desk view for staff: paged, filterable by status or member. */
export const getAllLoans = async (params = {}) => {
  setupAxiosHeaders();
  return axios.get(API_ENDPOINTS.LOANS.LIST, { params });
};

/** Hand a copy to a member. Identify the copy by barcode or bookCopyID. */
export const issueLoan = async ({ userID, barcode, bookCopyID }) => {
  setupAxiosHeaders();
  return axios.post(API_ENDPOINTS.LOANS.ISSUE, { userID, barcode, bookCopyID });
};

export const returnLoan = async (loanId) => {
  setupAxiosHeaders();
  return axios.post(API_ENDPOINTS.LOANS.RETURN(loanId));
};

export const renewLoan = async (loanId) => {
  setupAxiosHeaders();
  return axios.post(API_ENDPOINTS.LOANS.RENEW(loanId));
};
