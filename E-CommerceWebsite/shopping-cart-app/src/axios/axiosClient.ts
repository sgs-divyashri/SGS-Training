import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");
  if (token) request.headers.Authorization = `Bearer ${token}`;
  return request;
});

api.interceptors.response.use(
  (res) => res, async (err) => {
    const status = err.response.status
    if (status===401){
      console.warn('401 detected by interceptor');
      localStorage.removeItem('token');
      // window.location.replace("/login");
    }
    return Promise.reject(err);
  }
)