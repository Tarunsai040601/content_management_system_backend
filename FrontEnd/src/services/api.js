import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8095";

// General API instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Customer API instance (attaches customerToken)
export const customerApi = axios.create({
  baseURL: API_BASE_URL,
});

customerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("customerToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Admin API instance (attaches adminToken)
export const adminApi = axios.create({
  baseURL: API_BASE_URL,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
