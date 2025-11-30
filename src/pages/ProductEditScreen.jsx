import React, { useState, useEffect } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ProductFormEnhanced from '../components/form/ProductFormEnhanced';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// Common product categories
const PRODUCT_CATEGORIES = [
    'Electronics',
    'Clothing',
    'Accessories',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Toys & Games',
    'Beauty & Personal Care',
    'Food & Beverages',
    'Health & Wellness',
    'Automotive',
    'Office Supplies',
    'Pet Supplies',
    'Music & Instruments',
    'Art & Crafts',
    'Jewelry',
    'Shoes',
    'Bags & Luggage',
    'Furniture',
    'Kitchen & Dining'
];

const ProductEditScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { vendor } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            setProduct(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch product');
            toast.error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProduct = async (productData) => {
        try {
            const endpoint = vendor 
                ? `/vendor/products/${id}` 
                : `/admin/products/${id}`;
            
            await api.put(endpoint, productData);
            toast.success('Product updated successfully!');
            
            // Navigate back to product list
            setTimeout(() => {
                navigate(vendor ? '/vendor/products' : '/admin/productlist');
            }, 1500);
        } catch (err) {
            throw new Error(err.response?.data?.message || 'Failed to update product');
        }
    };

    const handleCancel = () => {
        navigate(vendor ? '/vendor/products' : '/admin/productlist');
    };

    if (loading) {
        return <LoadingSpinner message="Loading product..." />;
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    <Alert.Heading>Error Loading Product</Alert.Heading>
                    <p>{error}</p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Link 
                            to={vendor ? '/vendor/products' : '/admin/productlist'}
                            className="btn btn-outline-danger"
                        >
                            Go Back
                        </Link>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <div className="product-upload-container py-4">
            <Container>
                <Card className="mb-4 shadow-sm">
                    <div className="product-upload-header p-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="mb-2">
                                    <i className="fas fa-edit me-2"></i>
                                    Edit Product
                                </h2>
                                <p className="text-muted mb-0">Update product information and images</p>
                            </div>
                            <Link 
                                to={vendor ? '/vendor/products' : '/admin/productlist'} 
                                className="btn btn-light"
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Back to List
                            </Link>
                        </div>
                    </div>
                </Card>

                <ProductFormEnhanced
                    initialData={product}
                    onSubmit={handleUpdateProduct}
                    onCancel={handleCancel}
                    categories={PRODUCT_CATEGORIES}
                    isEditing={true}
                />
            </Container>
         </div>
    );
};

export default ProductEditScreen;
