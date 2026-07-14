import axiosInstance from "./axiosInstance";

const authApi = {
  register: (payload) => axiosInstance.post("/auth/register", payload),

  verifyEmail: (token) => axiosInstance.get(`/auth/verify-email/${token}`),

  login: (payload) => axiosInstance.post("/auth/login", payload),

  refreshToken: (refreshToken) =>
    axiosInstance.post("/auth/refresh-token", { refreshToken }),

  forgotPassword: (email) =>
    axiosInstance.post("/auth/forgot-password", { email }),

  resetPassword: (token, password) =>
    axiosInstance.post(`/auth/reset-password/${token}`, { password })
};

export default authApi;
