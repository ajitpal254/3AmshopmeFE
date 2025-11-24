import { toast } from 'react-toastify';

const defaultOptions = {
    position: "bottom-left",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};

const notificationService = {
    success: (message, options = {}) => {
        toast.success(message, { ...defaultOptions, ...options });
    },
    error: (message, options = {}) => {
        toast.error(message, { ...defaultOptions, ...options });
    },
    info: (message, options = {}) => {
        toast.info(message, { ...defaultOptions, ...options });
    },
    warn: (message, options = {}) => {
        toast.warn(message, { ...defaultOptions, ...options });
    },
    // Custom notification for specific actions if needed
    custom: (message, options = {}) => {
        toast(message, { ...defaultOptions, ...options });
    }
};

export default notificationService;
