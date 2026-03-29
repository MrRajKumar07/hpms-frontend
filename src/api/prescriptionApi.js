import axiosBase from './axiosBase';

export const prescriptionApi = {
  create: (data) =>
    axiosBase.post('/prescriptions', data),

  getByPatient: (patientId) =>
    axiosBase.get(`/prescriptions/patient/${patientId}`),

  getActiveByPatient: (patientId) =>
    axiosBase.get(`/prescriptions/patient/${patientId}/active`),

  getByEmail: (email) =>
    axiosBase.get('/prescriptions/by-email', { params: { email } }),

  getActiveByEmail: (email) =>
    axiosBase.get('/prescriptions/by-email/active', { params: { email } }),

  markFilled: (id, pharmacistId) =>
    axiosBase.put(`/prescriptions/${id}/fill`, null, { params: { pharmacistId } }),

  revoke: (id, doctorId) =>
    axiosBase.delete(`/prescriptions/${id}`, { params: { doctorId } }),

  downloadPdf: (id) =>
    axiosBase.get(`/prescriptions/${id}/pdf`, { responseType: 'blob' }),
};