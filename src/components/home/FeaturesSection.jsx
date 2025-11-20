import React from 'react';

const FeaturesSection = () => {
    return (
        <div className="container scroll-reveal">
            <div className="features-section">
                <div className="feature-card scroll-reveal-scale">
                    <div className="feature-icon">
                        <i className="fas fa-shipping-fast"></i>
                    </div>
                    <h3 className="feature-title">Free Shipping</h3>
                    <p className="feature-description">
                        Free shipping on all orders over $50. Fast and reliable delivery.
                    </p>
                </div>
                <div className="feature-card scroll-reveal-scale">
                    <div className="feature-icon">
                        <i className="fas fa-undo-alt"></i>
                    </div>
                    <h3 className="feature-title">Easy Returns</h3>
                    <p className="feature-description">
                        30-day return policy. No questions asked, hassle-free returns.
                    </p>
                </div>
                <div className="feature-card scroll-reveal-scale">
                    <div className="feature-icon">
                        <i className="fas fa-lock"></i>
                    </div>
                    <h3 className="feature-title">Secure Payment</h3>
                    <p className="feature-description">
                        100% secure payment with SSL encryption and fraud protection.
                    </p>
                </div>
                <div className="feature-card scroll-reveal-scale">
                    <div className="feature-icon">
                        <i className="fas fa-headset"></i>
                    </div>
                    <h3 className="feature-title">24/7 Support</h3>
                    <p className="feature-description">
                        Dedicated support team ready to help you anytime, anywhere.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
