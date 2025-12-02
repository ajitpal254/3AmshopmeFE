import React from 'react';
import { Link } from 'react-router-dom';
import './BecomeSellerBanner.css';

const BecomeSellerBanner = () => {
    return (
        <div className="become-seller-banner">
            <div className="seller-content">
                <div className="seller-text">
                    <h2>Become a Seller on 3AmShoppee</h2>
                    <p>Join our marketplace and reach millions of customers worldwide. Setup is easy and free!</p>
                </div>
                <div className="seller-action">
                    <Link to="/vendor/signup" className="seller-btn">
                        Start Selling <i className="fas fa-store ms-2"></i>
                    </Link>
                </div>
            </div>
            <div className="seller-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
            </div>
        </div>
    );
};

export default BecomeSellerBanner;
