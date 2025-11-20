import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Modal, Form, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const ProductListScreen = ({ history }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState('');
    const { user, vendor } = useAuth();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const endpoint = vendor ? '/vendor/products' : '/admin/delete';
            const { data } = await api.get(endpoint);
            setProducts(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const endpoint = vendor ? `/vendor/delete/${id}` : `/admin/delete/${id}`;
                await api.delete(endpoint);
                fetchProducts();
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete product');
            }
        }
    };

    const openDiscountModal = (product) => {
        setSelectedProduct(product);
        setDiscountPercentage(product.discountPercentage || '');
        setShowDiscountModal(true);
    };

    const handleDiscountSubmit = async () => {
        if (!selectedProduct) return;

        const discount = parseFloat(discountPercentage);
        if (discount < 0 || discount > 100) {
            alert('Discount must be between 0 and 100');
            return;
        }

        try {
            const endpoint = vendor
                ? `/vendor/products/${selectedProduct._id}/discount`
                : `/admin/products/${selectedProduct._id}/discount`;

            await api.put(endpoint, {
                discountPercentage: discount,
                isOnDiscount: discount > 0
            });

            setShowDiscountModal(false);
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update discount');
        }
    };

    if (loading) {
        return <LoadingSpinner message="Loading products..." />;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <Row className="align-items-center mb-4">
                <Col>
                    <h1>{vendor ? 'My Products' : 'All Products'}</h1>
                </Col>
                <Col className="text-end">
                    <LinkContainer to="/admin/upload">
                        <Button variant="primary">
                            <i className="fas fa-plus me-2"></i>
                            Create Product
                        </Button>
                    </LinkContainer>
                </Col>
            </Row>

            {products.length === 0 ? (
                <div className="alert alert-info">
                    No products found. <LinkContainer to="/admin/upload"><Button variant="link">Create one now</Button></LinkContainer>
                </div>
            ) : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>IMAGE</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>DISCOUNT</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>STOCK</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => {
                            const hasDiscount = product.isOnDiscount && product.discountPercentage > 0;
                            const discountedPrice = hasDiscount
                                ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
                                : product.price;

                            return (
                                <tr key={product._id}>
                                    <td>{product._id.substring(0, 8)}...</td>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>
                                        {hasDiscount ? (
                                            <>
                                                <span style={{ textDecoration: 'line-through', color: '#999' }}>
                                                    ${product.price}
                                                </span>
                                                <br />
                                                <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                                                    ${discountedPrice}
                                                </span>
                                            </>
                                        ) : (
                                            `$${product.price}`
                                        )}
                                    </td>
                                    <td>
                                        {hasDiscount ? (
                                            <Badge bg="success">{product.discountPercentage}% OFF</Badge>
                                        ) : (
                                            <Badge bg="secondary">No Discount</Badge>
                                        )}
                                    </td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.countInStock}</td>
                                    <td>
                                        <LinkContainer to={`/products/${product._id}`}>
                                            <Button variant="info" size="sm" className="me-2">
                                                <i className="fas fa-eye"></i>
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => openDiscountModal(product)}
                                        >
                                            <i className="fas fa-percent"></i>
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => deleteHandler(product._id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}

            {/* Discount Modal */}
            <Modal show={showDiscountModal} onHide={() => setShowDiscountModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Set Discount</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduct && (
                        <>
                            <p><strong>Product:</strong> {selectedProduct.name}</p>
                            <p><strong>Original Price:</strong> ${selectedProduct.price}</p>
                            <Form.Group>
                                <Form.Label>Discount Percentage (0-100)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={discountPercentage}
                                    onChange={(e) => setDiscountPercentage(e.target.value)}
                                    placeholder="Enter discount percentage"
                                />
                                {discountPercentage > 0 && (
                                    <Form.Text className="text-success">
                                        New Price: ${(selectedProduct.price * (1 - discountPercentage / 100)).toFixed(2)}
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDiscountModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleDiscountSubmit}>
                        Apply Discount
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductListScreen;
