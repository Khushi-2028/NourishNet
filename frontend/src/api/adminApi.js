import axiosInstance from "./axiosInstance";

const adminApi = {
  getDashboard: () => axiosInstance.get("/admin/dashboard"),

  // Users
  getUsers: (params = {}) => axiosInstance.get("/admin/users", { params }),
  getUserById: (id) => axiosInstance.get(`/admin/users/${id}`),
  updateUser: (id, payload) => axiosInstance.put(`/admin/users/${id}`, payload),
  deleteUser: (id) => axiosInstance.delete(`/admin/users/${id}`),

  // NGOs
  getNGOs: () => axiosInstance.get("/admin/ngos"),
  getNGOById: (id) => axiosInstance.get(`/admin/ngos/${id}`),
  approveNGO: (id) => axiosInstance.put(`/admin/ngos/${id}/approve`),
  rejectNGO: (id) => axiosInstance.put(`/admin/ngos/${id}/reject`),

  // Volunteers
  getVolunteers: () => axiosInstance.get("/admin/volunteers"),
  getVolunteerById: (id) => axiosInstance.get(`/admin/volunteers/${id}`),

  // Donations
  getDonations: () => axiosInstance.get("/admin/donations"),
  getDonationById: (id) => axiosInstance.get(`/admin/donations/${id}`),
  deleteDonation: (id) => axiosInstance.delete(`/admin/donations/${id}`),

  // Deliveries
  getDeliveries: () => axiosInstance.get("/admin/deliveries"),
  getDeliveryById: (id) => axiosInstance.get(`/admin/deliveries/${id}`),

  // Audit Logs
  getAuditLogs: (params = {}) =>
    axiosInstance.get("/admin/audit-logs", { params }),

  // Analytics & Environmental Impact
  getAnalytics: () => axiosInstance.get("/admin/analytics"),
  getEnvironmentalImpact: () => axiosInstance.get("/admin/environment"),

  // Reports (binary blob responses)
  getDonationReport: (format) =>
    axiosInstance.get(`/admin/reports/donations/${format}`, {
      responseType: "blob"
    }),
  getDeliveryReport: (format) =>
    axiosInstance.get(`/admin/reports/deliveries/${format}`, {
      responseType: "blob"
    })
};

export default adminApi;
