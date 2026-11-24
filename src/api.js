import axios from "axios";

const rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:4000").trim();
const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
const baseURL = withProtocol.replace(/\/+$/, "");

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;