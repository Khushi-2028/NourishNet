import api from "./axiosInstance";

const pickupApi = {

  /*
  ==========================================
  CREATE PICKUP REQUEST
  ==========================================
  */

  createRequest(donationId, data) {
    return api.post(
      `/pickups/${donationId}`,
      data
    );
  },

  /*
  ==========================================
  GET MY PICKUP REQUESTS
  ==========================================
  */

  getMyRequests() {
    return api.get(
      "/pickups/my-requests"
    );
  }

};

export default pickupApi;