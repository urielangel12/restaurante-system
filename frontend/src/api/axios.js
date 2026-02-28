import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 👈 Render en prod, localhost en dev
  withCredentials: true,
});

export default api;