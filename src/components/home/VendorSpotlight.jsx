import React from 'react';
import './VendorSpotlight.css';

const VendorSpotlight = () => {
    // Mock data for top vendors
    const vendors = [
        { id: 1, name: "Premium Electronics", rating: 4.8, products: 120, icon: "fas fa-laptop" },
        { id: 2, name: "Trending Fashion", rating: 4.9, products: 350, icon: "fas fa-tshirt" },
        { id: 3, name: "Modern Home Decor", rating: 4.7, products: 85, icon: "fas fa-couch" },
        { id: 4, name: "Smart Gadgets", rating: 4.6, products: 200, icon: "fas fa-mobile-alt" },
        { id: 5, name: "Pro Sports Gear", rating: 4.9, products: 150, icon: "fas fa-running" },
        { id: 6, name: "Beauty Essentials", rating: 4.8, products: 90, icon: "fas fa-spa" },
    ];

    return (
        <div className="vendor-spotlight-container">
            <div className="section-header">
                <h2 className="section-title">
                    <i className="fas fa-store text-primary"></i> Top Verified Vendors
                </h2>
            </div>
            
            <div className="vendor-grid">
                {vendors.map(vendor => (
                    <div key={vendor.id} className="vendor-card">
                        <div className="vendor-icon-wrapper">
                            <i className={vendor.icon}></i>
                        </div>
                        <h3 className="vendor-name">{vendor.name} <i className="fas fa-check-circle text-primary" title="Verified"></i></h3>
                        <div className="vendor-stats">
                            <span><i className="fas fa-star text-warning"></i> {vendor.rating}</span>
                            <span><i className="fas fa-box"></i> {vendor.products}+ Items</span>
                        </div>
                        <button className="visit-store-btn">Visit Store</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VendorSpotlight;
