import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { globalNavigate } from "../App";
import { isAuthenticated } from "../auth/auth";

type PopupCallback = () => void;

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((request) => {
  if (request.url?.startsWith("/users/reset-password")) {
    return request;
  }

  const token = localStorage.getItem("token");
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

let openPopupCallback: PopupCallback = () => {}; 

export const setOpenPopupCallback = (fn: PopupCallback): void => {
  openPopupCallback = fn;
};
// let isRefreshing = false;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;

    if (status === 401) {
       openPopupCallback(); 
      // if (!isRefreshing) {
      //   isRefreshing = true;
      //   try {
      //     toast.error("Refreshing token...");
      //     const res = await api.post("/token/refresh");
      //     const accessToken = res.data.data.accessToken;

      //     if (accessToken) {
      //       localStorage.setItem("token", accessToken);
      //       api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      //       window.location.reload();
      //     } else {
      //       localStorage.removeItem("token");
      //       delete api.defaults.headers.common.Authorization;
      //     }

      //     isRefreshing = false;
      //     err.config.headers.Authorization = `Bearer ${accessToken}`;
      //     return api(err.config);
      //   } catch (refreshError) {
      //     console.error("Refresh token failed:", refreshError);
      //     globalNavigate("/", { replace: true });
      //   }
      // }
    }
    return Promise.reject(err);
  },
);
