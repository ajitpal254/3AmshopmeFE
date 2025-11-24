import axios from 'axios';

// Environment-based BASE_URL configuration
const getBaseUrl = () => {
    const nodeEnv = process.env.NODE_ENV;
    const customEnv = process.env.REACT_APP_ENV;

    let baseUrl;

    // Use production URL if NODE_ENV is production OR if explicitly set
    if (nodeEnv === 'production' || customEnv === 'production') {
        baseUrl = process.env.REACT_APP_API_URL_PROD || 'https://threeamshoppeebe.onrender.com/';
    } else {
        // Use development URL for all other cases
        baseUrl = process.env.REACT_APP_API_URL || 'http://192.168.2.33:8080';
    }

    // Log the configuration in development
    if (nodeEnv === 'development') {
        console.log('%c API Configuration ', 'background: #0066cc; color: white; font-weight: bold; padding: 4px;');
        console.log('BASE_URL:', baseUrl);
        console.log('NODE_ENV:', nodeEnv);
        console.log('REACT_APP_ENV:', customEnv);
    }

    return baseUrl;
};

const BASE_URL = getBaseUrl();

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const userToken = localStorage.getItem('token');
        const vendorToken = localStorage.getItem('vendorToken');

        const token = userToken || vendorToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMsg = error.response?.data?.message || error.message || 'An unexpected error occurred';
        const serviceName = 'FrontendService';

        // Log error with service name
        console.error(`[${serviceName}] Error:`, {
            message: errorMsg,
            status: error.response?.status,
            url: error.config?.url,
            stack: error.stack
        });

        // Optional: Trigger toast notification for errors automatically
        // import notificationService from './notificationService';
        // notificationService.error(errorMsg); 
        // (Commented out to avoid circular dependency or unwanted auto-toasts if handled in components)

        return Promise.reject(error);
    }
);

export default api;
