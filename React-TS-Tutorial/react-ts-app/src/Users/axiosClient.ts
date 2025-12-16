import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((request) => {
  const token = localStorage.getItem("Token");
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("Token");
      // redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

