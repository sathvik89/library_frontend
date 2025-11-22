const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
console.log(API_BASE_URL);

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
  },
  BOOKS: {
    GET_ALL: `${API_BASE_URL}/books`,
    GET_BY_ID: (id) => `${API_BASE_URL}/books/${id}`,
    CREATE: `${API_BASE_URL}/books`,
    UPDATE: (id) => `${API_BASE_URL}/books/${id}`,
    DELETE: (id) => `${API_BASE_URL}/books/${id}`,
  },
};

