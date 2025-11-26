import React from 'react';
import { useAuth } from '../context/AuthContext';
import MyReviews from '../components/MyReviews';
import { useNavigate } from 'react-router-dom';

const MyReviewsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/app/login');
        return null;
    }

    return (
        <div className="container mt-5">
            <MyReviews userId={user._id} />
        </div>
    );
};

export default MyReviewsPage;