import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Row, Col, Modal, Form, Badge, Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import './ProductList.css';

const ProductListScreen = ({ history }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Sorting State
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    
    // Filter State
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStockStatus, setFilterStockStatus] = useState('');
    const [filterDiscount, setFilterDiscount] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // Discount Modal State
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState('');

    // Delete Confirmation Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const { vendor } = useAuth();

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const endpoint = vendor ? '/vendor/products' : '/admin/delete';
            const { data } = await api.get(endpoint);
            setProducts(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch products');
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setProductToDelete(id);
        setShowDeleteModal(true);
    };

    const deleteHandler = async () => {
        if (!productToDelete) return;

        try {
            const endpoint = vendor ? `/vendor/delete/${productToDelete}` : `/admin/delete/${productToDelete}`;
            await api.delete(endpoint);
            toast.success('Product deleted successfully');
            fetchProducts();
            setShowDeleteModal(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete product');
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
            toast.error('Discount must be between 0 and 100');
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

            toast.success('Discount updated successfully');
            setShowDiscountModal(false);
            fetchProducts();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update discount');
        }
    };

    // Handle column header click for sorting
    const handleSort = (field) => {
        if (sortField === field) {
            // Toggle direction if clicking same field
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // New field, default to ascending
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Get unique categories from products
    const categories = useMemo(() => {
        return [...new Set(products.map(p => p.category))].sort();
    }, [products]);

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...products];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (filterCategory) {
            filtered = filtered.filter(product => product.category === filterCategory);
        }

        // Apply stock status filter
        if (filterStockStatus) {
            if (filterStockStatus === 'inStock') {
                filtered = filtered.filter(product => product.countInStock > 0);
            } else if (filterStockStatus === 'outOfStock') {
                filtered = filtered.filter(product => product.countInStock === 0);
            } else if (filterStockStatus === 'lowStock') {
                filtered = filtered.filter(product => product.countInStock > 0 && product.countInStock < 10);
            }
        }

        // Apply discount filter
        if (filterDiscount) {
            if (filterDiscount === 'onDiscount') {
                filtered = filtered.filter(product => product.isOnDiscount && product.discountPercentage > 0);
            } else if (filterDiscount === 'noDiscount') {
                filtered = filtered.filter(product => !product.isOnDiscount || product.discountPercentage === 0);
            }
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortField) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'price':
                    aValue = a.price;
                    bValue = b.price;
                    break;
                case 'category':
                    aValue = a.category.toLowerCase();
                    bValue = b.category.toLowerCase();
                    break;
                case 'brand':
                    aValue = a.brand.toLowerCase();
                    bValue = b.brand.toLowerCase();
                    break;
                case 'stock':
                    aValue = a.countInStock;
                    bValue = b.countInStock;
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [products, searchTerm, filterCategory, filterStockStatus, filterDiscount, sortField, sortDirection]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredAndSortedProducts.slice(indexOfFirstItem, indexOfLastItem);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterCategory, filterStockStatus, filterDiscount, sortField, sortDirection]);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle items per page change
    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page
    };

    // Generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;
        
        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    // Render sort icon
    const renderSortIcon = (field) => {
        if (sortField !== field) {
            return <i className="fas fa-sort ms-1 text-muted"></i>;
        }
        return sortDirection === 'asc' 
            ? <i className="fas fa-sort-up ms-1"></i>
            : <i className="fas fa-sort-down ms-1"></i>;
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterStockStatus('');
        setFilterDiscount('');
    };

    if (loading) {
        return <LoadingSpinner message="Loading products..." />;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-4 product-list-container">
            {/* Enhanced Filter Section with Create Button */}
            <div className="filter-section">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                        <i className="fas fa-filter"></i>
                        Filter & Search
                    </h5>
                    <LinkContainer to="/admin/upload">
                        <Button 
                            variant="light" 
                            size="sm"
                            className="px-3"
                            style={{
                                background: 'white',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                color: '#667eea',
                                fontWeight: '600',
                                borderRadius: '0.5rem',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Create Product
                        </Button>
                    </LinkContainer>
                </div>
                <div className="filter-controls-row">
                    <Row>
                        <Col md={4} className="mb-3 mb-md-0">
                            <div className="filter-input-wrapper">
                                <label>Search Products</label>
                                <div className="position-relative">
                                    <i className="fas fa-search search-icon"></i>
                                    <input
                                        type="text"
                                        className="custom-search-input"
                                        placeholder="Search by name or brand..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col md={2} className="mb-3 mb-md-0">
                            <div className="filter-input-wrapper">
                                <label>Category</label>
                                <select
                                    className="custom-select"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat, idx) => (
                                        <option key={idx} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </Col>
                        <Col md={2} className="mb-3 mb-md-0">
                            <div className="filter-input-wrapper">
                                <label>Stock Status</label>
                                <select
                                    className="custom-select"
                                    value={filterStockStatus}
                                    onChange={(e) => setFilterStockStatus(e.target.value)}
                                >
                                    <option value="">All Stock</option>
                                    <option value="inStock">In Stock</option>
                                    <option value="lowStock">Low Stock (&lt;10)</option>
                                    <option value="outOfStock">Out of Stock</option>
                                </select>
                            </div>
                        </Col>
                        <Col md={2} className="mb-3 mb-md-0">
                            <div className="filter-input-wrapper">
                                <label>Discount Status</label>
                                <select
                                    className="custom-select"
                                    value={filterDiscount}
                                    onChange={(e) => setFilterDiscount(e.target.value)}
                                >
                                    <option value="">All Discounts</option>
                                    <option value="onDiscount">On Sale</option>
                                    <option value="noDiscount">Regular Price</option>
                                </select>
                            </div>
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                            {(searchTerm || filterCategory || filterStockStatus || filterDiscount) && (
                                <button className="clear-filters-btn w-100" onClick={clearFilters}>
                                    <i className="fas fa-undo me-2"></i>
                                    Clear
                                </button>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="stats-section">
                <div className="stat-badge primary">
                    <i className="fas fa-box"></i>
                    <span>{filteredAndSortedProducts.length} of {products.length} Products</span>
                </div>
                {filterStockStatus === 'lowStock' && (
                    <div className="stat-badge warning">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>Low Stock Alert</span>
                    </div>
                )}
                {filterDiscount === 'onDiscount' && (
                    <div className="stat-badge success">
                        <i className="fas fa-tag"></i>
                        <span>Sale Items</span>
                    </div>
                )}
            </div>

            {/* Pagination Controls - Top */}
            {filteredAndSortedProducts.length > 0 && (
                <div className="pagination-controls mb-3">
                    <Row className="align-items-center">
                        <Col md={6} className="mb-3 mb-md-0">
                            <div className="d-flex align-items-center gap-3">
                                <span className="text-muted">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length}
                                </span>
                                <div className="d-flex align-items-center gap-2">
                                    <label className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Per page:</label>
                                    <select 
                                        className="custom-select" 
                                        value={itemsPerPage}
                                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                        style={{ width: 'auto', padding: '0.375rem 2rem 0.375rem 0.75rem' }}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={25}>25</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                            </div>
                        </Col>
                        <Col md={6}>
                            <Pagination className="justify-content-md-end justify-content-center mb-0">
                                <Pagination.First 
                                    onClick={() => handlePageChange(1)} 
                                    disabled={currentPage === 1}
                                />
                                <Pagination.Prev 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1}
                                />
                                {getPageNumbers().map((page, index) => (
                                    page === '...' ? (
                                        <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />
                                    ) : (
                                        <Pagination.Item
                                            key={page}
                                            active={page === currentPage}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </Pagination.Item>
                                    )
                                ))}
                                <Pagination.Next 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage === totalPages}
                                />
                                <Pagination.Last 
                                    onClick={() => handlePageChange(totalPages)} 
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </Col>
                    </Row>
                </div>
            )}

            {filteredAndSortedProducts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <i className="fas fa-box-open"></i>
                    </div>
                    {products.length === 0 ? (
                        <>
                            <h4>No Products Yet</h4>
                            <p className="mb-3">Start by creating your first product</p>
                            <LinkContainer to="/admin/upload">
                                <Button variant="primary">
                                    <i className="fas fa-plus me-2"></i>
                                    Create Product
                                </Button>
                            </LinkContainer>
                        </>
                    ) : (
                        <>
                            <h4>No Products Match Filters</h4>
                            <p className="mb-3">Try adjusting your search criteria</p>
                            <Button variant="primary" onClick={clearFilters}>
                                <i className="fas fa-undo me-2"></i>
                                Clear All Filters
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <Table className="product-table" striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>IMAGE</th>
                            <th 
                                onClick={() => handleSort('name')} 
                                className={`sortable-header ${sortField === 'name' ? 'active' : ''}`}
                            >
                                NAME
                                <span className="sort-icon">{renderSortIcon('name')}</span>
                            </th>
                            <th 
                                onClick={() => handleSort('price')} 
                                className={`sortable-header ${sortField === 'price' ? 'active' : ''}`}
                            >
                                PRICE
                                <span className="sort-icon">{renderSortIcon('price')}</span>
                            </th>
                            <th>DISCOUNT</th>
                            <th 
                                onClick={() => handleSort('category')} 
                                className={`sortable-header ${sortField === 'category' ? 'active' : ''}`}
                            >
                                CATEGORY
                                <span className="sort-icon">{renderSortIcon('category')}</span>
                            </th>
                            <th 
                                onClick={() => handleSort('brand')} 
                                className={`sortable-header ${sortField === 'brand' ? 'active' : ''}`}
                            >
                                BRAND
                                <span className="sort-icon">{renderSortIcon('brand')}</span>
                            </th>
                            <th 
                                onClick={() => handleSort('stock')} 
                                className={`sortable-header ${sortField === 'stock' ? 'active' : ''}`}
                            >
                                STOCK
                                <span className="sort-icon">{renderSortIcon('stock')}</span>
                            </th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product) => {
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
                                        <LinkContainer to={`/product/edit/${product._id}`}>
                                            <Button variant="success" size="sm" className="me-2">
                                                <i className="fas fa-edit"></i>
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
                                            onClick={() => confirmDelete(product._id)}
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

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this product? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={deleteHandler}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductListScreen;
