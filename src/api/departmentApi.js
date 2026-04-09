export const departmentApi = {

  getDoctors: (departmentId) =>
    axiosBase.get(`/departments/${departmentId}/doctors`),

  assignHead: (departmentId, doctorId) =>
    axiosBase.put(`/departments/${departmentId}/assign-head`, null, {
      params: { doctorId }
    }),
};