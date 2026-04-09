import axiosBase from "./axiosBase";

export const doctorApi = {

  // ================= DASHBOARD =================
  getDashboard: async () => {
    const res = await axiosBase.get("/doctors/dashboard");
    return res.data?.data || {};
  },

  // ================= PROFILE =================
  getProfile: async () => {
    const res = await axiosBase.get("/doctors/me");
    return res.data?.data || null;
  },

  // ================= GET SLOTS =================
  getSlots: async (date) => {
    const res = await axiosBase.get("/doctor-schedules/slots", {
      params: { date }
    });
    return res.data?.data || [];
  },

  // ================= SET SCHEDULE =================
  setSchedule: async (schedules) => {
    const res = await axiosBase.put("/doctor-schedules/config", schedules);
    return res.data || null;
  }

};