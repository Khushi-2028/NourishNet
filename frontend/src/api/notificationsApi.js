import axiosInstance from "./axiosInstance";

const notificationsApi = {
  getAll: () => axiosInstance.get("/notifications"),

  getUnreadCount: () => axiosInstance.get("/notifications/unread-count"),

  markRead: (id) => axiosInstance.put(`/notifications/read/${id}`),

  markAllRead: () => axiosInstance.put("/notifications/read-all"),

  remove: (id) => axiosInstance.delete(`/notifications/${id}`)
};

export default notificationsApi;
