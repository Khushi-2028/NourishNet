import axiosInstance from "./axiosInstance";

const ngoApi = {

  /*
  ==========================================
  NGO PROFILE
  ==========================================
  */

  createProfile(payload) {
    return axiosInstance.post(
      "/ngo/profile",
      payload
    );
  },

  getStats() {
    return axiosInstance.get(
      "/ngo/stats"
    );
  },

  /*
  ==========================================
  DONATIONS
  ==========================================
  */

  getAvailableDonations() {
    return axiosInstance.get(
      "/ngo/available-donations"
    );
  },

  /*
  ------------------------------------------
  KEEP THESE FOR NOW
  (We'll remove them later.)
  ------------------------------------------
  */

  acceptDonation(donationId) {
    return axiosInstance.post(
      `/ngo/accept/${donationId}`
    );
  },

  rejectDonation(donationId) {
    return axiosInstance.post(
      `/ngo/reject/${donationId}`
    );
  },

  /*
  ==========================================
  PICKUP REQUESTS
  ==========================================
  */

  createPickupRequest(
    donationId,
    data
  ) {
    return axiosInstance.post(
      `/pickups/${donationId}`,
      data
    );
  },

  getPickupRequests() {
    return axiosInstance.get(
      "/ngo/pickup-requests"
    );
  },

  /*
  ==========================================
  VOLUNTEERS
  ==========================================
  */

  getAvailableVolunteers() {
    return axiosInstance.get(
      "/volunteers/available"
    );
  },

  assignVolunteer(
    pickupId,
    volunteerId
  ) {
    return axiosInstance.post(
      `/deliveries/assign/${pickupId}`,
      {
        volunteerId
      }
    );
  },

  /*
  ==========================================
  DELIVERY DASHBOARD
  ==========================================
  */

  getActiveDeliveries() {
    return axiosInstance.get(
      "/dashboard/active-deliveries"
    );
  }

};

export default ngoApi;