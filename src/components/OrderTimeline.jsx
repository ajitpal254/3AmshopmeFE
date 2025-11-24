import React from 'react';
import { Card } from 'react-bootstrap';
import './OrderTimeline.css';

const OrderTimeline = ({ order }) => {
    const statuses = [
        { key: 'Processing', icon: 'fa-clock', label: 'Processing' },
        { key: 'Confirmed', icon: 'fa-check-circle', label: 'Confirmed' },
        { key: 'Shipped', icon: 'fa-shipping-fast', label: 'Shipped' },
        { key: 'Out for Delivery', icon: 'fa-truck', label: 'Out for Delivery' },
        { key: 'Delivered', icon: 'fa-box-open', label: 'Delivered' }
    ];

    const currentStatusIndex = statuses.findIndex(s => s.key === order.orderStatus);
    const isCancelled = order.orderStatus === 'Cancelled';

    const getStatusDate = (statusKey) => {
        if (!order.statusHistory) return null;
        const historyItem = order.statusHistory.find(h => h.status === statusKey);
        return historyItem ? new Date(historyItem.timestamp).toLocaleDateString() : null;
    };

    const getStatusNote = (statusKey) => {
        if (!order.statusHistory) return null;
        const historyItem = order.statusHistory.find(h => h.status === statusKey);
        return historyItem?.note || null;
    };

    if (isCancelled) {
        return (
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-danger text-white">
                    <h5 className="mb-0">
                        <i className="fas fa-times-circle me-2"></i>
                        Order Cancelled
                    </h5>
                </Card.Header>
                <Card.Body>
                    <div className="alert alert-danger mb-0">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        This order has been cancelled.
                        {getStatusNote('Cancelled') && (
                            <div className="mt-2">
                                <strong>Reason:</strong> {getStatusNote('Cancelled')}
                            </div>
                        )}
                    </div>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                    <i className="fas fa-route me-2"></i>
                    Order Tracking
                </h5>
            </Card.Header>
            <Card.Body>
                <div className="order-timeline">
                    {statuses.map((status, index) => {
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        const statusDate = getStatusDate(status.key);
                        const statusNote = getStatusNote(status.key);

                        return (
                            <div
                                key={status.key}
                                className={`timeline-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                            >
                                <div className="timeline-marker">
                                    <div className="timeline-icon">
                                        <i className={`fas ${status.icon}`}></i>
                                    </div>
                                    {index < statuses.length - 1 && (
                                        <div className={`timeline-line ${isCompleted ? 'completed' : ''}`}></div>
                                    )}
                                </div>
                                <div className="timeline-content">
                                    <h6 className="mb-1">{status.label}</h6>
                                    {statusDate && (
                                        <small className="text-muted d-block">{statusDate}</small>
                                    )}
                                    {statusNote && (
                                        <small className="text-muted d-block fst-italic">{statusNote}</small>
                                    )}
                                    {isCurrent && !isCompleted && (
                                        <Badge bg="primary" className="mt-1">In Progress</Badge>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card.Body>
        </Card>
    );
};

export default OrderTimeline;
