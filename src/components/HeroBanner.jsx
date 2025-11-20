import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import './HeroBanner.css';

const HeroBanner = () => {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const banners = [
        {
            id: 1,
            title: "New Arrivals",
            subtitle: "Shop the Latest Trends",
            cta: "Shop Now",
            bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            image: null
        },
        {
            id: 2,
            title: "Up to 50% Off",
            subtitle: "Selected Items on Sale",
            cta: "View Deals",
            bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            image: null
        },
        {
            id: 3,
            title: "Free Shipping",
            subtitle: "On Orders Over $50",
            cta: "Start Shopping",
            bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            image: null
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
                                <button className="hero-cta animate-scale-in">
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
