import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const userToken = localStorage.getItem('token');
        const vendorToken = localStorage.getItem('vendorToken'); // Or whatever key you use for vendor

        // You might need logic to decide WHICH token to send, or send both if backend handles it.
        // For now, let's prioritize user token, or check the route.
        // A better approach is to have separate instances or dynamic logic.
        // But for simplicity, if we are in a vendor route, maybe we need vendor token.

        // Simple approach: Send 'token' if it exists (user), else 'vendorToken' if it exists.
        // Or send both in different headers if needed. 
        // Standard Bearer usually takes one.

        const token = userToken || vendorToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
