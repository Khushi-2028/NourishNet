import axiosInstance from "./axiosInstance";

const dashboardApi = {
  getNgoDashboard: () => axiosInstance.get("/dashboard/ngo"),

  getActiveDeliveries: () => axiosInstance.get("/dashboard/active-deliveries"),

  getTrackingHistory: (deliveryId) =>
    axiosInstance.get(`/dashboard/tracking/${deliveryId}`),

  getAnalytics: () => axiosInstance.get("/dashboard/analytics")
};

export default dashboardApi;
