import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductListScreen = ({ history }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>STOCK</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
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
                                <td>${product.price}</td>
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
                                        variant="danger"
                                        size="sm"
                                        onClick={() => deleteHandler(product._id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default ProductListScreen;
