import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../utils/api';
import '../components/css/AdminVendorManagement.css';

const AdminVendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const history = useHistory();

    useEffect(() => {
        fetchStats();
        fetchVendors();
    }, [filter]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await api.get('/api/admin/vendors/stats/overview', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchVendors = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');

            const { data } = await api.get(`/api/admin/vendors?status=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setVendors(data);
        } catch (err) {
            console.error('Error fetching vendors:', err);
            if (err.response?.status === 403 || err.response?.status === 401) {
                setError('You do not have admin access.');
                setTimeout(() => history.push('/'), 2000);
            } else {
                setError('Failed to load vendors');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (vendorId) => {
        if (!window.confirm('Are you sure you want to approve this vendor?')) return;

        try {
            const token = localStorage.getItem('token');
            await api.put(`/api/admin/vendors/${vendorId}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Vendor approved successfully!');
            fetchVendors();
            fetchStats();
            setSelectedVendor(null);
        } catch (err) {
            console.error('Error approving vendor:', err);
            alert('Failed to approve vendor');
        }
    };

    const handleReject = async (vendorId) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        if (!window.confirm('Are you sure you want to reject this vendor?')) return;

        try {
            const token = localStorage.getItem('token');
            await api.put(`/api/admin/vendors/${vendorId}/reject`,
                { reason: rejectionReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Vendor rejected');
            fetchVendors();
            fetchStats();
            setSelectedVendor(null);
            setRejectionReason('');
        } catch (err) {
            console.error('Error rejecting vendor:', err);
            alert('Failed to reject vendor');
        }
    };

    const handleDelete = async (vendorId) => {
        if (!window.confirm('Are you sure you want to permanently delete this vendor? This action cannot be undone.')) return;

        try {
            const token = localStorage.getItem('token');
            await api.delete(`/api/admin/vendors/${vendorId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Vendor deleted successfully');
            fetchVendors();
            fetchStats();
        } catch (err) {
            console.error('Error deleting vendor:', err);
            alert('Failed to delete vendor');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-warning',
            approved: 'badge-success',
            rejected: 'badge-danger'
        };
        return badges[status] || 'badge-secondary';
    };

    return (
        <div className="admin-vendor-management">
            <div className="admin-header">
                <h1>🛡️ Vendor Management</h1>
                <p>Manage and approve vendor applications</p>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                        <h3>{stats.total}</h3>
                        <p>Total Vendors</p>
                    </div>
                </div>
                <div className="stat-card pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>{stats.pending}</h3>
                        <p>Pending Approval</p>
                    </div>
                </div>
                <div className="stat-card approved">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>{stats.approved}</h3>
                        <p>Approved</p>
                    </div>
                </div>
                <div className="stat-card rejected">
                    <div className="stat-icon">❌</div>
                    <div className="stat-info">
                        <h3>{stats.rejected}</h3>
                        <p>Rejected</p>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    className={filter === 'pending' ? 'active' : ''}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({stats.pending})
                </button>
                <button
                    className={filter === 'approved' ? 'active' : ''}
                    onClick={() => setFilter('approved')}
                >
                    Approved ({stats.approved})
                </button>
                <button
                    className={filter === 'rejected' ? 'active' : ''}
                    onClick={() => setFilter('rejected')}
                >
                    Rejected ({stats.rejected})
                </button>
                <button
                    className={filter === '' ? 'active' : ''}
                    onClick={() => setFilter('')}
                >
                    All ({stats.total})
                </button>
            </div>

            {/* Error Message */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Loading State */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading vendors...</p>
                </div>
            ) : vendors.length === 0 ? (
                <div className="empty-state">
                    <p>📭 No vendors found for this filter</p>
                </div>
            ) : (
                <div className="vendors-table-container">
                    <table className="vendors-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Category</th>
                                <th>Niche</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((vendor) => (
                                <tr key={vendor._id}>
                                    <td>{vendor.name}</td>
                                    <td>{vendor.email}</td>
                                    <td><span className="category-tag">{vendor.businessCategory}</span></td>
                                    <td>{vendor.niche || '-'}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(vendor.approvalStatus)}`}>
                                            {vendor.approvalStatus}
                                        </span>
                                    </td>
                                    <td>{new Date(vendor.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            {vendor.approvalStatus === 'pending' && (
                                                <>
                                                    <button
                                                        className="btn-approve"
                                                        onClick={() => handleApprove(vendor._id)}
                                                    >
                                                        ✅ Approve
                                                    </button>
                                                    <button
                                                        className="btn-reject"
                                                        onClick={() => setSelectedVendor(vendor)}
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className="btn-details"
                                                onClick={() => setSelectedVendor(vendor)}
                                            >
                                                👁️ Details
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(vendor._id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Vendor Details Modal */}
            {selectedVendor && (
                <div className="modal-overlay" onClick={() => setSelectedVendor(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Vendor Details</h2>
                            <button className="close-btn" onClick={() => setSelectedVendor(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <strong>Name:</strong>
                                <span>{selectedVendor.name}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Email:</strong>
                                <span>{selectedVendor.email}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Business Category:</strong>
                                <span>{selectedVendor.businessCategory}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Niche:</strong>
                                <span>{selectedVendor.niche || 'Not specified'}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Phone:</strong>
                                <span>{selectedVendor.phone || 'Not provided'}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Website:</strong>
                                <span>{selectedVendor.website || 'Not provided'}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Status:</strong>
                                <span className={`badge ${getStatusBadge(selectedVendor.approvalStatus)}`}>
                                    {selectedVendor.approvalStatus}
                                </span>
                            </div>
                            <div className="detail-row">
                                <strong>Email Verified:</strong>
                                <span>{selectedVendor.isVerified ? '✅ Yes' : '❌ No'}</span>
                            </div>
                            {selectedVendor.rejectionReason && (
                                <div className="detail-row">
                                    <strong>Rejection Reason:</strong>
                                    <span className="rejection-reason">{selectedVendor.rejectionReason}</span>
                                </div>
                            )}
                            <div className="detail-row">
                                <strong>Created At:</strong>
                                <span>{new Date(selectedVendor.createdAt).toLocaleString()}</span>
                            </div>

                            {selectedVendor.approvalStatus === 'pending' && (
                                <div className="modal-actions">
                                    <hr />
                                    <h3>Rejection Reason (if rejecting)</h3>
                                    <textarea
                                        placeholder="Enter reason for rejection..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows="3"
                                        className="form-control mb-3"
                                    />
                                    <div className="button-group">
                                        <button
                                            className="btn-approve btn-lg"
                                            onClick={() => handleApprove(selectedVendor._id)}
                                        >
                                            ✅ Approve Vendor
                                        </button>
                                        <button
                                            className="btn-reject btn-lg"
                                            onClick={() => handleReject(selectedVendor._id)}
                                        >
                                            ❌ Reject Vendor
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVendorManagement;
