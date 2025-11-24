import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            // Check for stored tokens on mount
            const userToken = localStorage.getItem('token');
            const userInfo = localStorage.getItem('userInfo');

            const vendorToken = localStorage.getItem('vendorToken');
            const vendorInfo = localStorage.getItem('vendorInfo');

            if (userToken && userInfo) {
                setUser(JSON.parse(userInfo));

                // Fetch fresh user data from backend to get latest profile picture
                try {
                    const { data } = await api.get('/api/profile', {
                        headers: { Authorization: `Bearer ${userToken}` }
                    });

                    const freshUser = {
                        _id: data._id,
                        name: data.name,
                        email: data.email,
                        isAdmin: data.isAdmin,
                        profilePicture: data.profilePicture,
                        phone: data.phone
                    };

                    setUser(freshUser);
                    localStorage.setItem('userInfo', JSON.stringify(freshUser));
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                }
            }

            if (vendorToken && vendorInfo) {
                setVendor(JSON.parse(vendorInfo));
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    // User Actions
    const loginUser = async (email, password, isAdmin = false) => {
        try {
            const { data } = await api.post('/app/login', { email, password, attemptingAdminLogin: isAdmin });

            if (isAdmin && (!data.user || !data.user.isAdmin)) {
                throw new Error("Not authorized as admin");
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            setUser(data.user);
            return data;
        } catch (error) {
            throw error.response?.data?.message || error.message || "Login failed";
        }
    };

    const signupUser = async (userData) => {
        try {
            const { data } = await api.post('/app/signup', userData);
            // Auto login after signup? Or just redirect to login.
            // Let's assume auto-login for now if token is returned, else return data
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data.user));
                setUser(data.user);
            }
            return data;
        } catch (error) {
            throw error.response?.data?.message || "Signup failed";
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('isActualAdmin');
        setUser(null);
    };

    const updateUser = (updatedUserData) => {
        // Update both state and localStorage
        const updatedUser = { ...user, ...updatedUserData };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    };

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await api.get('/api/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update user with fresh data from backend
            const refreshedUser = {
                _id: data._id,
                name: data.name,
                email: data.email,
                isAdmin: data.isAdmin,
                profilePicture: data.profilePicture,
                phone: data.phone
            };

            setUser(refreshedUser);
            localStorage.setItem('userInfo', JSON.stringify(refreshedUser));
        } catch (error) {
            console.error('Failed to refresh user data:', error);
        }
    };

    // Vendor Actions
    const loginVendor = async (email, password) => {
        try {
            const { data } = await api.post('/vendor/login', { email, password });
            localStorage.setItem('vendorToken', data.token);
            localStorage.setItem('vendorInfo', JSON.stringify(data.vendor));
            setVendor(data.vendor);
            return data;
        } catch (error) {
            throw error.response?.data?.msg || "Vendor login failed";
        }
    };

    const signupVendor = async (vendorData) => {
        try {
            const { data } = await api.post('/vendor/signup', vendorData);
            return data;
        } catch (error) {
            throw error.response?.data?.msg || "Vendor signup failed";
        }
    };

    const logoutVendor = () => {
        localStorage.removeItem('vendorToken');
        localStorage.removeItem('vendorInfo');
        setVendor(null);
    };

    const value = {
        user,
        vendor,
        loading,
        loginUser,
        signupUser,
        logoutUser,
        updateUser,
        refreshUser,
        loginVendor,
        signupVendor,
        logoutVendor
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
