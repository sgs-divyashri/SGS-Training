import axios from "axios";
import toast from "react-hot-toast";
import { globalNavigate } from "../App";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

let isRefreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;

    if (status === 401 && !isRefreshing) {
      toast.error("Refreshing token...");
      localStorage.removeItem("token");
      globalNavigate("/", { replace: true });
    }
    return Promise.reject(err);
  },
);
