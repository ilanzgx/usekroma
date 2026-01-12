import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
