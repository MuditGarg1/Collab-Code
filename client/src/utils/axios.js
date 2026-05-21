import axios from "axios";

const ServerUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: `${ServerUrl}/api`,
  withCredentials: true,
});

export default api;
