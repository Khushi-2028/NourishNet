import axiosInstance from "./axiosInstance";

const trackingApi = {
  /*
  ==========================================
  Volunteer APIs
  ==========================================
  */

  updateLocation: (deliveryId, latitude, longitude) =>
    axiosInstance.put(`/tracking/location/${deliveryId}`, {
      latitude,
      longitude,
    }),

  getActiveDeliveries: () =>
    axiosInstance.get("/tracking/active"),

  /*
  ==========================================
  NGO Tracking APIs
  ==========================================
  */

  getDeliveryTracking: (deliveryId) =>
    axiosInstance.get(`/tracking/delivery/${deliveryId}`),

  getHistory: (deliveryId) =>
    axiosInstance.get(`/tracking/history/${deliveryId}`),

  getETA: (deliveryId) =>
    axiosInstance.get(`/tracking/eta/${deliveryId}`),
};

export default trackingApi;