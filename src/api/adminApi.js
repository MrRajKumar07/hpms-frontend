import axiosBase from "./axiosBase";

const BASE_URL = "/admin";

export const getDashboard = () =>
  axiosBase.get(`${BASE_URL}/stats/dashboard`);

export const getAllUsers = (page = 0, size = 10, sort = "email,asc") =>
  axiosBase.get(`${BASE_URL}/users`, {
    params: { page, size, sort },
  });

export const activateUser = (id) =>
  axiosBase.put(`${BASE_URL}/users/${id}/activate`);

export const deactivateUser = (id) =>
  axiosBase.put(`${BASE_URL}/users/${id}/deactivate`);