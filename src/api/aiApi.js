import axiosBase from './axiosBase';

export const aiApi = {
    //Doctor AI Endpoints
    doctor: {
        ask: (data) => axiosBase.post('/ai/doctor/ask', data),
        diagnose: (data) => axiosBase.post('/ai/doctor/diagnose', data),
        summarize: (id) => axiosBase.get(`/ai/doctor/summarize/${id}`)
    },

    //Patient AI Endpoints
    patient: {
        chat: (data) => axiosBase.post('/ai/patient/chat', data),
        symptoms: (data) => axiosBase.post('/ai/patient/symptoms', data)
    },

    //RAG/Admin Endpoints
    rag: {
        ingest: (formData) => axiosBase.post('/rag/ingest', formData), // Ingest using FormData
        search: (query, topK) => axiosBase.get('/rag/search', { params: { query, topK } }),
        clear: (type) => axiosBase.delete(`/rag/clear/${type}`)
    }
};