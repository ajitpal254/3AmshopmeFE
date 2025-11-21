import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Table, Button, Modal, Form, Alert, Badge, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const VendorDashboard = () => {
    const [activeTab, setActiveTab] = useState('coupons');
    const [coupons, setCoupons] = useState([]);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user, vendor } = useAuth();

    const [couponForm, setCouponForm] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        description: '',
        maxUses: '',
        minPurchaseAmount: '',
        endDate: ''
    });

    useEffect(() => {
        if (activeTab === 'coupons') {
            fetchCoupons();
        }
    }, [activeTab]);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const endpoint = vendor ? '/api/discount/vendor/my-coupons' : '/api/discount/all';
            const { data } = await api.get(endpoint);
            setCoupons(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleCouponFormChange = (e) => {
        setCouponForm({
            ...couponForm,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!couponForm.code || !couponForm.discountValue) {
            setError('Please fill in required fields');
            return;
        }

        try {
            const payload = {
                code: couponForm.code.toUpperCase(),
                discountType: couponForm.discountType,
                discountValue: parseFloat(couponForm.discountValue),
                description: couponForm.description,
                maxUses: couponForm.maxUses ? parseInt(couponForm.maxUses) : undefined,
                minPurchaseAmount: couponForm.minPurchaseAmount ? parseFloat(couponForm.minPurchaseAmount) : undefined,
                endDate: couponForm.endDate || undefined,
                isActive: true
            };

            const endpoint = vendor ? '/api/discount/vendor/create' : '/api/discount/create';
            await api.post(endpoint, payload);
            setSuccess('Coupon created successfully!');
            setShowCouponModal(false);
            fetchCoupons();

            setCouponForm({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                description: '',
                maxUses: '',
                minPurchaseAmount: '',
                endDate: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create coupon');
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const endpoint = vendor ? `/api/discount/vendor/${id}` : `/api/discount/${id}`;
            await api.delete(endpoint);
            setSuccess('Coupon deleted successfully');
            fetchCoupons();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete coupon');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Vendor Dashboard</h2>

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="products" title={<><i className="fas fa-box me-2"></i>Products</>}>
                    <div className="text-center py-5">
                        <p>Go to <a href="/vendor/products">Product List</a> to manage your products</p>
                    </div>
                </Tab>

                <Tab eventKey="coupons" title={<><i className="fas fa-ticket-alt me-2"></i>Coupon Codes</>}>
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3>My Coupon Codes</h3>
                            <Button variant="primary" onClick={() => setShowCouponModal(true)}>
                                <i className="fas fa-plus me-2"></i>
                                Create Coupon
                            </Button>
                        </div>

                        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
                        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

                        {loading ? (
                            <div className="text-center my-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : coupons.length === 0 ? (
                            <Alert variant="info">
                                You haven't created any coupon codes yet. Click "Create Coupon" to get started!
                            </Alert>
                        ) : (
                            <>
                                <Row className="mb-4">
                                    <Col md={3}>
                                        <Card className="text-center">
                                            <Card.Body>
                                                <h2>{coupons.length}</h2>
                                                <p className="text-muted mb-0">Total Coupons</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={3}>
                                        <Card className="text-center">
                                            <Card.Body>
                                                <h2>{coupons.filter(c => c.isActive).length}</h2>
                                                <p className="text-muted mb-0">Active Coupons</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={3}>
                                        <Card className="text-center">
                                            <Card.Body>
                                                <h2>{coupons.reduce((acc, c) => acc + (c.currentUses || 0), 0)}</h2>
                                                <p className="text-muted mb-0">Total Uses</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={3}>
                                        <Card className="text-center">
                                            <Card.Body>
                                                <h2>{coupons.filter(c => c.discountType === 'percentage').length}</h2>
                                                <p className="text-muted mb-0">% Discounts</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Type</th>
                                            <th>Value</th>
                                            <th>Description</th>
                                            <th>Uses</th>
                                            <th>Status</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {coupons.map((coupon) => (
                                            <tr key={coupon._id}>
                                                <td><strong>{coupon.code}</strong></td>
                                                <td>
                                                    <Badge bg={coupon.discountType === 'percentage' ? 'primary' : 'success'}>
                                                        {coupon.discountType}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                                                </td>
                                                <td>{coupon.description || '-'}</td>
                                                <td>
                                                    {coupon.currentUses || 0}
                                                    {coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                                                </td>
                                                <td>
                                                    {coupon.isActive ? (
                                                        <Badge bg="success">Active</Badge>
                                                    ) : (
                                                        <Badge bg="secondary">Inactive</Badge>
                                                    )}
                                                </td>
                                                <td>{new Date(coupon.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <Button variant="danger" size="sm" onClick={() => handleDeleteCoupon(coupon._id)}>
                                                        <i className="fas fa-trash"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </>
                        )}

                        <Modal show={showCouponModal} onHide={() => setShowCouponModal(false)} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Create New Coupon</Modal.Title>
                            </Modal.Header>
                            <Form onSubmit={handleCreateCoupon}>
                                <Modal.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Coupon Code *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="code"
                                                    value={couponForm.code}
                                                    onChange={handleCouponFormChange}
                                                    placeholder="e.g., SAVE20"
                                                    required
                                                    style={{ textTransform: 'uppercase' }}
                                                />
                                                <Form.Text className="text-muted">
                                                    Letters and numbers only, will be converted to uppercase
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Discount Type *</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="discountType"
                                                    value={couponForm.discountType}
                                                    onChange={handleCouponFormChange}
                                                    required
                                                >
                                                    <option value="percentage">Percentage (%)</option>
                                                    <option value="fixed">Fixed Amount ($)</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Discount Value *</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="discountValue"
                                                    value={couponForm.discountValue}
                                                    onChange={handleCouponFormChange}
                                                    placeholder={couponForm.discountType === 'percentage' ? '20' : '10.00'}
                                                    step={couponForm.discountType === 'percentage' ? '1' : '0.01'}
                                                    min="0"
                                                    max={couponForm.discountType === 'percentage' ? '100' : undefined}
                                                    required
                                                />
                                                <Form.Text className="text-muted">
                                                    {couponForm.discountType === 'percentage' ? 'Enter percentage (0-100)' : 'Enter dollar amount'}
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Maximum Uses</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="maxUses"
                                                    value={couponForm.maxUses}
                                                    onChange={handleCouponFormChange}
                                                    placeholder="Leave empty for unlimited"
                                                    min="1"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Minimum Purchase Amount</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="minPurchaseAmount"
                                                    value={couponForm.minPurchaseAmount}
                                                    onChange={handleCouponFormChange}
                                                    placeholder="e.g., 50.00"
                                                    step="0.01"
                                                    min="0"
                                                />
                                                <Form.Text className="text-muted">
                                                    Minimum cart value required
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Expiry Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="endDate"
                                                    value={couponForm.endDate}
                                                    onChange={handleCouponFormChange}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                                <Form.Text className="text-muted">
                                                    Leave empty for no expiry
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="description"
                                            value={couponForm.description}
                                            onChange={handleCouponFormChange}
                                            placeholder="e.g., 20% off entire store"
                                            rows={2}
                                        />
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowCouponModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Create Coupon
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                    </div>
                </Tab>

                <Tab eventKey="orders" title={<><i className="fas fa-shopping-bag me-2"></i>Orders</>}>
                    <div className="text-center py-5">
                        <p className="mb-3">View and manage orders for your products.</p>
                        <Button href="/vendor/orders" variant="primary">
                            <i className="fas fa-external-link-alt me-2"></i>
                            Go to Orders
                        </Button>
                    </div>
                </Tab>
            </Tabs>
        </div >
    );
};

export default VendorDashboard;
