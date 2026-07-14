import axiosInstance from "./axiosInstance";

const deliveriesApi = {
  assignVolunteer: (pickupId, volunteerId) =>
    axiosInstance.post(`/deliveries/assign/${pickupId}`, { volunteerId }),

  acceptTask: (deliveryId) =>
    axiosInstance.put(`/deliveries/accept/${deliveryId}`),

  pickupFood: (deliveryId) =>
    axiosInstance.put(`/deliveries/pickup/${deliveryId}`),

  startTransit: (deliveryId) =>
    axiosInstance.put(`/deliveries/transit/${deliveryId}`),

  completeDelivery: (deliveryId) =>
    axiosInstance.put(`/deliveries/complete/${deliveryId}`),
  uploadProof: (deliveryId, formData) =>
  axiosInstance.post(
    `/deliveries/${deliveryId}/proof`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  ),
  getDeliveryById: (deliveryId) =>
  axiosInstance.get(`/deliveries/${deliveryId}`),

confirmDelivery: (deliveryId) =>
  axiosInstance.put(
    `/deliveries/${deliveryId}/confirm`
  )
  
};


export default deliveriesApi;
