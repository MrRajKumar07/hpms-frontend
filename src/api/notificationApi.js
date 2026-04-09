import axiosBase from "./axiosBase";

const BASE_URL = "/notifications";

export const getNotifications = (page = 0) =>
  axiosBase.get(`${BASE_URL}`, { param: {page},});

export const markRead = (id) =>
  axiosBase.put(`${BASE_URL}/${id}/read`);

// Mark all read
export const markAllRead = () =>
  axiosBase.put(`${BASE_URL}/read-all`);

// Get unread count
export const getUnreadCount = () =>
  axiosBase.get(`${BASE_URL}/unread-count`);