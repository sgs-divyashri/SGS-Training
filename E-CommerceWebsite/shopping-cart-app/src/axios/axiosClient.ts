// api.ts
import axios from "axios";
import { globalNavigate } from "../App";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // so cookie 'rt' gets sent
});

// --- Auth header injection from localStorage ---
api.interceptors.request.use((config) => {
  // allowlist: no auth header for these
  if (config.url?.startsWith("/users/reset-password")) return config;
  if (config.url?.includes("/token/refresh")) return config;

  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Global refresh queue state ---
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

  // Clear client-side access token
  localStorage.removeItem("token");

  // Optional: brief delay to let UI unmount gracefully
  setTimeout(() => {
    if (!silent) toast.error("Session expired. Please login again.");
    // Navigate away (fallback to hard reload if globalNavigate not ready)
    try {
      globalNavigate("/", { replace: true });
    } catch {
      window.location.replace("/");
    }
  }, 0);
}

// --- Response interceptor with single-flight refresh ---
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // If we already decided to logout, do not attempt anything else
    if (loggedOut) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;
    const original = error?.config;

    // If we don't have the original request, just bubble up.
    if (!original) return Promise.reject(error);

    // Never refresh on refresh endpoint itself or if already retried
    if (original._retry || original.url?.includes("/token/refresh")) {
      if (status === 401) {
        // Refresh endpoint itself failed -> logout immediately
        await forceLogoutOnce();
      }
      return Promise.reject(error);
    }

    // Only handle 401 here. For 403/other, bubble up.
    if (status !== 401) {
      return Promise.reject(error);
    }

    try {
      original._retry = true;

      if (isRefreshing) {
        // Wait for the ongoing refresh to finish, then retry with the new token
        const newAccess = await subscribeTokenRefresh();
        // If we already logged out during waiting, abort
        if (loggedOut) return Promise.reject(error);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      }

      // Start refresh
      isRefreshing = true;

      // Try to get a new access token via cookie-authenticated refresh
      const refreshRes = await api.post("/token/refresh");
      const newAccess: string | undefined = refreshRes?.data?.data?.accessToken;

      if (!newAccess) {
        isRefreshing = false;
        onRefreshError(new Error("No access token in refresh response"));
        await forceLogoutOnce();
        return Promise.reject(error);
      }

      // Save and broadcast
      localStorage.setItem("token", newAccess);
      onRefreshed(newAccess);
      isRefreshing = false;

      // Retry the original request
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (err) {
      // Refresh failed → logout + reject everyone in the queue
      isRefreshing = false;
      onRefreshError(err);
      await forceLogoutOnce();
      return Promise.reject(err);
    }
  }
);







// // api.ts
// import axios from "axios";
// import { globalNavigate } from "../App";
// import toast from "react-hot-toast";

// export const api = axios.create({
//   baseURL: "http://localhost:3000",
//   withCredentials: true, // so cookie 'rt' gets sent
// });

// // --- Auth header injection from localStorage ---
// api.interceptors.request.use((config) => {
//   // allowlist: no auth header for these
//   if (config.url?.startsWith("/users/reset-password")) return config;
//   if (config.url?.includes("/token/refresh")) return config;

//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // --- Global refresh queue state ---
// let isRefreshing = false;
// let pendingQueue: { resolve: (t: string) => void; reject: (e: any) => void }[] = [];

// function subscribeTokenRefresh() {
//   return new Promise<string>((resolve, reject) => {
//     pendingQueue.push({ resolve, reject });
//   });
// }

// function onRefreshed(newToken: string) {
//   pendingQueue.forEach((p) => p.resolve(newToken));
//   pendingQueue = [];
// }

// function onRefreshError(err: any) {
//   pendingQueue.forEach((p) => p.reject(err));
//   pendingQueue = [];
// }

// async function forceLogout(silent?: boolean) {
//   localStorage.removeItem("token");
//   // do NOT keep stale Authorization default; request interceptor reads from localStorage anyway
//   if (!silent) toast.error("Session expired. Please login again.");
//   globalNavigate("/", { replace: true });
// }

// // --- Response interceptor with single-flight refresh ---
// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const status = error?.response?.status;
//     const original = error?.config;

//     // If we don't have the original request, just bubble up.
//     if (!original) return Promise.reject(error);

//     // Never refresh on refresh endpoint itself or if already retried
//     if (original._retry || original.url?.includes("/token/refresh")) {
//       return Promise.reject(error);
//     }

//     // Only handle 401 here. For 403/other, bubble up.
//     if (status !== 401) {
//       return Promise.reject(error);
//     }

//     try {
//       original._retry = true;

//       if (isRefreshing) {
//         // Wait for the ongoing refresh to finish, then retry with the new token
//         const newAccess = await subscribeTokenRefresh();
//         original.headers.Authorization = `Bearer ${newAccess}`;
//         return api(original);
//       }

//       // Start refresh
//       isRefreshing = true;

//       // Try to get a new access token via cookie-authenticated refresh
//       const refreshRes = await api.post("/token/refresh");
//       const newAccess: string | undefined = refreshRes?.data?.data?.accessToken;

//       if (!newAccess) {
//         isRefreshing = false;
//         onRefreshError(new Error("No access token in refresh response"));
//         await forceLogout();
//         return Promise.reject(error);
//       }

//       // Save and broadcast
//       localStorage.setItem("token", newAccess);
//       onRefreshed(newAccess);
//       isRefreshing = false;

//       // Retry the original request
//       original.headers.Authorization = `Bearer ${newAccess}`;
//       return api(original);
//     } catch (err) {
//       // Refresh failed → logout + reject everyone in the queue
//       isRefreshing = false;
//       onRefreshError(err);
//       await forceLogout();
//       return Promise.reject(err);
//     }
//   }
// );










// import axios from "axios";
// import { globalNavigate } from "../App";
// import toast from "react-hot-toast";

// export const api = axios.create({
//   baseURL: "http://localhost:3000",
//   withCredentials: true, 
// });

// api.interceptors.request.use((config) => {
//   if (config.url?.startsWith("/users/reset-password")) return config;
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// async function forceLogout() {
//   localStorage.removeItem("token");
//   delete api.defaults.headers.common.Authorization;
//   globalNavigate("/", { replace: true });
// }

// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const status = error?.response?.status;
//     const original = error?.config;

//     if (!original || original._retry || original.url?.includes("/token/refresh")) {
//       return Promise.reject(error);
//     }

//     if (status === 401) {
//       try {
//         original._retry = true; 

//         const refreshRes = await api.post("/token/refresh");
//         const accessToken: string | undefined = refreshRes?.data?.data?.accessToken;

//         if (!accessToken) {
//           await forceLogout();
//           toast.error('Session expired.')
//           return Promise.reject(error);
//         }

//         localStorage.setItem("token", accessToken);
//         api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//         original.headers.Authorization = `Bearer ${accessToken}`;

//         return api(original);
//       } catch {
//         await forceLogout();
//         toast.error('Session expired.')
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   }
// );









// // import axios from "axios";
// // import toast from "react-hot-toast";
// // import { useNavigate } from "react-router-dom";
// // import { globalNavigate } from "../App";
// // import { isAuthenticated } from "../auth/auth";

// // type PopupCallback = () => void;

// // export const api = axios.create({
// //   baseURL: "http://localhost:3000",
// //   withCredentials: true,
// // });

// // api.interceptors.request.use((request) => {
// //   if (request.url?.startsWith("/users/reset-password")) {
// //     return request;
// //   }

// //   const token = localStorage.getItem("token");
// //   if (token) request.headers.Authorization = `Bearer ${token}`;
// //   return request;
// // });

// // let openPopupCallback: PopupCallback = () => {};

// // export const setOpenPopupCallback = (fn: PopupCallback): void => {
// //   openPopupCallback = fn;
// // };
// // // let isRefreshing = false;

// // api.interceptors.response.use(
// //   (res) => res,
// //   async (err) => {
// //     const status = err?.response?.status;

// //     if (status === 401) {
// //        openPopupCallback();
// //       // if (!isRefreshing) {
// //       //   isRefreshing = true;
// //       //   try {
// //       //     toast.error("Refreshing token...");
// //       //     const res = await api.post("/token/refresh");
// //       //     const accessToken = res.data.data.accessToken;

// //       //     if (accessToken) {
// //       //       localStorage.setItem("token", accessToken);
// //       //       api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
// //       //       window.location.reload();
// //       //     } else {
// //       //       localStorage.removeItem("token");
// //       //       delete api.defaults.headers.common.Authorization;
// //       //     }

// //       //     isRefreshing = false;
// //       //     err.config.headers.Authorization = `Bearer ${accessToken}`;
// //       //     return api(err.config);
// //       //   } catch (refreshError) {
// //       //     console.error("Refresh token failed:", refreshError);
// //       //     globalNavigate("/", { replace: true });
// //       //   }
// //       // }
// //     }
// //     return Promise.reject(err);
// //   },
// // );
