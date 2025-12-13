import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = () => {
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const banners = [
        {
            id: 1,
            title: "Millions of Products",
            subtitle: "From Top Verified Sellers",
            cta: "Shop Marketplace",
            bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            link: "/search?sortBy=newest"
        },
        {
            id: 2,
            title: "Start Selling Today",
            subtitle: "Join Our Growing Marketplace",
            cta: "Become a Vendor",
            bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            link: "/vendor/signup"
        },
        {
            id: 3,
            title: "Global Shipping",
            subtitle: "Trusted Vendors Worldwide",
            cta: "Explore Categories",
            bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            link: "/search" // General shop
        }
    ];

    return (
        <div className="hero-banner-container">
            <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                interval={4000}
                fade
                controls={true}
                indicators={true}
            >
                {banners.map((banner) => (
                    <Carousel.Item key={banner.id}>
                        <div
                            className="hero-slide"
                            style={{ background: banner.bgGradient }}
                        >
                            <div className="hero-content">
                                <h1 className="hero-title animate-fade-in">{banner.title}</h1>
                                <p className="hero-subtitle animate-slide-up">{banner.subtitle}</p>
                                <button
                                    className="hero-cta animate-scale-in"
                                    onClick={() => navigate(banner.link)}
                                >
                                    {banner.cta}
                                </button>
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

export default HeroBanner;
