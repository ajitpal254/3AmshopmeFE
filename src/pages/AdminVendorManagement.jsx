import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../utils/api';
import '../components/css/AdminVendorManagement.css';

const AdminVendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal States
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        action: null,
        variant: 'primary'
    });
    
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
                toast.error('You do not have admin access.');
                setTimeout(() => history.push('/'), 2000);
            } else {
                setError('Failed to load vendors');
                toast.error('Failed to load vendors');
            }
        } finally {
            setLoading(false);
        }
    };

    const openConfirmModal = (title, message, action, variant = 'primary') => {
        setModalConfig({ title, message, action, variant });
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        if (modalConfig.action) {
            await modalConfig.action();
        }
        setShowConfirmModal(false);
    };

    const handleApprove = (vendorId) => {
        openConfirmModal(
            'Approve Vendor',
            'Are you sure you want to approve this vendor?',
            async () => {
                try {
                    const token = localStorage.getItem('token');
                    await api.put(`/api/admin/vendors/${vendorId}/approve`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    toast.success('Vendor approved successfully!');
                    fetchVendors();
                    fetchStats();
                    setShowDetailsModal(false);
                } catch (err) {
                    console.error('Error approving vendor:', err);
                    toast.error('Failed to approve vendor');
                }
            },
            'success'
        );
    };

    const handleReject = (vendorId) => {
        if (!rejectionReason.trim()) {
            toast.warning('Please provide a reason for rejection');
            return;
        }

        openConfirmModal(
            'Reject Vendor',
            'Are you sure you want to reject this vendor?',
            async () => {
                try {
                    const token = localStorage.getItem('token');
                    await api.put(`/api/admin/vendors/${vendorId}/reject`,
                        { reason: rejectionReason },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    toast.info('Vendor rejected');
                    fetchVendors();
                    fetchStats();
                    setShowDetailsModal(false);
                    setRejectionReason('');
                } catch (err) {
                    console.error('Error rejecting vendor:', err);
                    toast.error('Failed to reject vendor');
                }
            },
            'danger'
        );
    };

    const handleDelete = (vendorId) => {
        openConfirmModal(
            'Delete Vendor',
            'Are you sure you want to permanently delete this vendor? This action cannot be undone.',
            async () => {
                try {
                    const token = localStorage.getItem('token');
                    await api.delete(`/api/admin/vendors/${vendorId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    toast.success('Vendor deleted successfully');
                    fetchVendors();
                    fetchStats();
                } catch (err) {
                    console.error('Error deleting vendor:', err);
                    toast.error('Failed to delete vendor');
                }
            },
            'danger'
        );
    };

    const openDetails = (vendor) => {
        setSelectedVendor(vendor);
        setShowDetailsModal(true);
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
                                                        onClick={() => {
                                                            setSelectedVendor(vendor);
                                                            setShowDetailsModal(true);
                                                        }}
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                className="btn-details"
                                                onClick={() => openDetails(vendor)}
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

            {/* Vendor Details Modal (Bootstrap) */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Vendor Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedVendor && (
                        <div className="vendor-details-content">
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Name:</div>
                                <div className="col-md-8">{selectedVendor.name}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Email:</div>
                                <div className="col-md-8">{selectedVendor.email}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Business Category:</div>
                                <div className="col-md-8">{selectedVendor.businessCategory}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Niche:</div>
                                <div className="col-md-8">{selectedVendor.niche || 'Not specified'}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Phone:</div>
                                <div className="col-md-8">{selectedVendor.phone || 'Not provided'}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Website:</div>
                                <div className="col-md-8">{selectedVendor.website || 'Not provided'}</div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Status:</div>
                                <div className="col-md-8">
                                    <span className={`badge ${getStatusBadge(selectedVendor.approvalStatus)}`}>
                                        {selectedVendor.approvalStatus}
                                    </span>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Email Verified:</div>
                                <div className="col-md-8">{selectedVendor.isVerified ? '✅ Yes' : '❌ No'}</div>
                            </div>
                            {selectedVendor.rejectionReason && (
                                <div className="row mb-2">
                                    <div className="col-md-4 fw-bold">Rejection Reason:</div>
                                    <div className="col-md-8 text-danger">{selectedVendor.rejectionReason}</div>
                                </div>
                            )}
                            <div className="row mb-2">
                                <div className="col-md-4 fw-bold">Created At:</div>
                                <div className="col-md-8">{new Date(selectedVendor.createdAt).toLocaleString()}</div>
                            </div>

                            {selectedVendor.approvalStatus === 'pending' && (
                                <div className="mt-4 pt-3 border-top">
                                    <h5>Review Application</h5>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Rejection Reason (if rejecting)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Enter reason for rejection..."
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                        />
                                    </Form.Group>
                                    <div className="d-flex gap-2">
                                        <Button variant="success" onClick={() => handleApprove(selectedVendor._id)}>
                                            ✅ Approve Vendor
                                        </Button>
                                        <Button variant="danger" onClick={() => handleReject(selectedVendor._id)}>
                                            ❌ Reject Vendor
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Confirmation Modal */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalConfig.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalConfig.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancel
                    </Button>
                    <Button variant={modalConfig.variant} onClick={handleConfirmAction}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AdminVendorManagement;
