import axiosBase from './axiosBase';

export const patientApi = {

    getAll: (page = 0, size = 10) =>axiosBase.get('/patients', { params: { page, size } }),

    getById: (id) =>axiosBase.get(`/patients/${id}`),

    search: (q, page = 0, size = 10) =>
        axiosBase.get('/patients/search', { params: { q, page, size } }),

    getMe: () => {return axiosBase.get("/patients/me");
},

    create: (data) =>
        axiosBase.post('/patients', data),

    update: (id, data) =>
        axiosBase.put(`/patients/${id}`, data),

    delete: (id) =>
        axiosBase.delete(`/patients/${id}`),
};