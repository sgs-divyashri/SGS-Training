// api.ts
import axios from "axios";
import { globalNavigate } from "../App";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  if (config.url?.startsWith("/users/reset-password")) return config;
  if (config.url?.includes("/token/refresh")) return config;

  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let loggedOut = false;
let pendingQueue: { resolve: (t: string) => void; reject: (e: any) => void }[] = [];

function subscribeTokenRefresh() {
  return new Promise<string>((resolve, reject) => {
    pendingQueue.push({ resolve, reject });
  });
}
function onRefreshed(newToken: string) {
  pendingQueue.forEach((p) => p.resolve(newToken));
  pendingQueue = [];
}
function onRefreshError(err: any) {
  pendingQueue.forEach((p) => p.reject(err));
  pendingQueue = [];
}

async function forceLogoutOnce({ silent }: { silent?: boolean } = {}) {
  if (loggedOut) return;
  loggedOut = true;

  localStorage.removeItem("token");

  setTimeout(() => {
    if (!silent) toast.error("Session expired. Please login again.");
    try {
      globalNavigate("/", { replace: true });
    } catch {
      window.location.replace("/");
    }
  }, 0);
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (loggedOut) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    const original = error?.config;

    if (!original) return Promise.reject(error);

    if (original._retry || original.url?.includes("/token/refresh")) {
      if (status === 401) {
        await forceLogoutOnce();
      }
      return Promise.reject(error);
    }

    if (status !== 401) {
      return Promise.reject(error);
    }

    try {
      original._retry = true;

      if (isRefreshing) {
        const newAccess = await subscribeTokenRefresh();
        if (loggedOut) return Promise.reject(error);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      }

      isRefreshing = true;

      const refreshRes = await api.post("/token/refresh");
      const newAccess: string | undefined = refreshRes?.data?.data?.accessToken;

      if (!newAccess) {
        isRefreshing = false;
        onRefreshError(new Error("No access token in refresh response"));
        await forceLogoutOnce();
        return Promise.reject(error);
      }

      localStorage.setItem("token", newAccess);
      onRefreshed(newAccess);
      isRefreshing = false;

      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (err) {
      isRefreshing = false;
      onRefreshError(err);
      await forceLogoutOnce();
      return Promise.reject(err);
    }
  }
);

