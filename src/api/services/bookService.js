import axios from "axios";
import { API_ENDPOINTS } from "@/config/apiConfig";
import { setupAxiosHeaders } from "@/api/axiosConfig";

export const getAllBooks = async (params = {}) => {
  setupAxiosHeaders();
  const response = await axios.get(API_ENDPOINTS.BOOKS.GET_ALL, { params });
  return response;
};

export const getBookById = async (bookId) => {
  setupAxiosHeaders();
  const url = API_ENDPOINTS.BOOKS.GET_BY_ID(bookId);
  const response = await axios.get(url);
  return response;
};

export const addNewBook = async (bookData) => {
  setupAxiosHeaders();
  const response = await axios.post(API_ENDPOINTS.BOOKS.ADD_NEW_BOOK, bookData);
  return response;
};

export const updateBook = async (bookId, updateData) => {
  setupAxiosHeaders();
  const response = await axios.patch(API_ENDPOINTS.BOOKS.UPDATE(bookId), updateData);
  return response;
};

export const deleteBook = async (bookId) => {
  setupAxiosHeaders();
  const response = await axios.delete(API_ENDPOINTS.BOOKS.DELETE(bookId));
  return response;
};

