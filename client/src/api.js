import axios from 'axios';

const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    if (!url.startsWith('http')) {
        // If it's just a hostname (from Render), prepend https and append /api
        url = `https://${url}/api`;
    }
    return url;
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
