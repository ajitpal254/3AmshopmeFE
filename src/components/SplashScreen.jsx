import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 2.5 seconds
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 2500);

        // Call onFinish after fade out completes
        const finishTimer = setTimeout(() => {
            onFinish();
        }, 3200);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinish]);

    return (
        <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
            <div className="splash-content">
                <div className="splash-logo">
                    <i className="fas fa-shopping-bag"></i>
                </div>
                <h1 className="splash-brand">3AMSHOPPEE</h1>
                <p className="splash-tagline">Your 24/7 Shopping Destination</p>
                <div className="splash-loader">
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                    <div className="loader-dot"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
