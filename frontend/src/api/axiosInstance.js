import axios from "axios";
import toast from "react-hot-toast";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearAuthStorage
} from "../utils/storage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// A plain axios client (no interceptors) reserved for the refresh-token
// call itself, to avoid infinite interceptor loops.
const rawClient = axios.create({ baseURL: API_BASE_URL });

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

// Callback the auth slice registers so the interceptor can force a
// full logout without creating a circular import with the store.
let onForceLogout = () => {};
export const registerForceLogout = (callback) => {
  onForceLogout = callback;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthRoute =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh-token");

    if (status === 401 && !originalRequest._retry && !isAuthRoute) {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearAuthStorage();
        onForceLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await rawClient.post("/auth/refresh-token", {
          refreshToken
        });

        const newAccessToken = data.accessToken;
        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthStorage();
        onForceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Surface a friendly toast for unexpected server errors (not for
    // validation 400s, which forms handle themselves).
    if (status >= 500) {
      toast.error("Something went wrong on the server. Please try again.");
    } else if (!status) {
      toast.error("Unable to reach the server. Check your connection.");
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.errors?.[0]?.msg ||
    error?.message ||
    fallback
  );
};

export default axiosInstance;
