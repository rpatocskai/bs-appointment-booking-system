import axios from "axios";

const apiKey = import.meta.env.VITE_APP_API_KEY;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "x-api-key": apiKey,
  },
});
