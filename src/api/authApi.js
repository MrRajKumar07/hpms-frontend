import axiosBase from './axiosBase';

export const authApi = {
    login: (credentials) => axiosBase.post('/auth/login', credentials),
    register: (userData) => axiosBase.post('/auth/register', userData),
    refreshToken: (token) => axiosBase.post('/auth/refresh', { refreshToken: token }),
    logout: () => axiosBase.post('/auth/logout'),
    changePassword: (data) => axiosBase.post('/auth/change-password', data),
};