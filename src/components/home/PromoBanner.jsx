import React from 'react';

const PromoBanner = () => {
    return (
        <div className="container scroll-reveal">
            <div className="promo-banner scroll-reveal-scale">
                <h2>Special Offer!</h2>
                <p>Get up to 50% off on selected items. Limited time only!</p>
                <button className="promo-btn">
                    Shop Deals Now <i className="fas fa-arrow-right ms-2"></i>
                </button>
            </div>
        </div>
    );
};

export default PromoBanner;
