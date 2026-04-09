import axios from 'axios';
import { store } from '../store/store';
import { setLogout, setTokens } from '../store/authSlice';

const axiosBase = axios.create({
    baseURL: 'http://localhost:8788/api/v1',
});

axiosBase.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    } else {
        delete config.headers['Content-Type'];
    }

    return config;
});

axiosBase.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error("No refresh token");

                const { data } = await axios.post('http://localhost:8788/api/v1/auth/refresh', { refreshToken });

                store.dispatch(setTokens({
                    accessToken: data.data.accessToken,
                    refreshToken: data.data.refreshToken
                }));

                originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                return axiosBase(originalRequest);

            } catch (refreshError) {
                store.dispatch(setLogout());
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosBase;