import axiosInstance from "./axiosInstance";

const volunteerApi = {

  /*
  ==========================================
  VOLUNTEER PROFILE
  ==========================================
  */

  createProfile(payload) {
    return axiosInstance.post(
      "/volunteers/profile",
      payload
    );
  },

  getDashboard() {
    return axiosInstance.get(
      "/volunteers/dashboard"
    );
  },

  /*
  ==========================================
  AVAILABLE VOLUNTEERS
  ==========================================
  */

  getAvailable() {
    return axiosInstance.get(
      "/volunteers/available"
    );
  }

};

export default volunteerApi;