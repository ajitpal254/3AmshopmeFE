import React from 'react';
import './TrackOrder.css';

const TrackOrder = ({ isPaid, isDelivered, paidAt, deliveredAt }) => {
    let step = 0;
    if (isPaid) step = 1;
    if (isDelivered) step = 2; // Assuming 3 steps: Placed, Paid, Delivered? Or Placed, Paid, Shipped, Delivered?

    // Let's define steps: Placed -> Paid -> Delivered
    // If we want more granular (Processing, Shipped), we need those fields from backend.
    // For now, let's stick to what we have: Placed (always), Paid, Delivered.

    return (
        <div className="track">
            <div className={`step active`}>
                <span className="icon"> <i className="fa fa-check"></i> </span>
                <span className="text">Order Placed</span>
            </div>
            <div className={`step ${isPaid ? 'active' : ''}`}>
                <span className="icon"> <i className="fa fa-user"></i> </span>
                <span className="text">Paid {isPaid && paidAt && <small>({new Date(paidAt).toLocaleDateString()})</small>}</span>
            </div>
            <div className={`step ${isDelivered ? 'active' : ''}`}>
                <span className="icon"> <i className="fa fa-truck"></i> </span>
                <span className="text">Delivered {isDelivered && deliveredAt && <small>({new Date(deliveredAt).toLocaleDateString()})</small>}</span>
            </div>
        </div>
    );
};

export default TrackOrder;
