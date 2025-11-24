import React from 'react';
import { useAuth } from '../context/AuthContext';
import MyReviews from '../components/MyReviews';
import { useHistory } from 'react-router-dom';

const MyReviewsPage = () => {
    const { user } = useAuth();
    const history = useHistory();

    if (!user) {
        history.push('/app/login');
        return null;
    }

    return (
        <div className="container mt-5">
            <MyReviews userId={user._id} />
        </div>
    );
};

export default MyReviewsPage;