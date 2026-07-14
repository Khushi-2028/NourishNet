import axiosInstance from "./axiosInstance";

const donationsApi = {
  create: (formData) =>
    axiosInstance.post("/donations", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }),

  getAll: (params = {}) => axiosInstance.get("/donations", { params }),

  getStats: () => axiosInstance.get("/donations/stats"),

  getById: (id) => axiosInstance.get(`/donations/${id}`),

  update: (id, payload) => axiosInstance.put(`/donations/${id}`, payload),

  remove: (id) => axiosInstance.delete(`/donations/${id}`),

  updateStatus: (id, status) =>
    axiosInstance.patch(`/donations/${id}/status`, { status })
};

export default donationsApi;
