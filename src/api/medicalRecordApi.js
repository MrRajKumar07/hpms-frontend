import axiosBase from './axiosBase';

export const medicalRecordApi = {
  create: (data) =>
    axiosBase.post('/medical-records', data),

  getById: (id) =>
    axiosBase.get(`/medical-records/${id}`),

  getByPatient: (patientId, page = 0, size = 10) =>
    axiosBase.get(`/medical-records/patient/${patientId}`, { params: { page, size } }),

  getByEmail: (email, page = 0, size = 10) =>
    axiosBase.get('/medical-records/by-email', { params: { email, page, size } }),

  addVitals: (id, data) =>
    axiosBase.put(`/medical-records/${id}/vitals`, data),

  exportPdf: (id) =>
    axiosBase.get(`/medical-records/${id}/export`, { responseType: 'blob' }),
};