import axiosInstance from "./axiosInstance";

const publicApi = {
  getPublicStats: () => axiosInstance.get("/public/stats"),
};

export default publicApi;