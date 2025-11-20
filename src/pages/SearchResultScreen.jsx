import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import { ProductScreen } from "../components/ProductScreen";
import api from "../utils/api";

const SearchResultScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    fetchSearchResults();
  }, [location.search]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      const keyword = params.get('keyword') || '';
      const category = params.get('category') || '';
      const deals = params.get('deals') || '';

      const queryParams = new URLSearchParams({
        ...(keyword && { keyword }),
        ...(category && { category }),
        ...(deals && { deals }),
        ...(sortBy && { sortBy }),
      });

      const { data } = await api.get(`/products?${queryParams.toString()}`);

      // Handle both old and new response formats
      if (data.products) {
        setProducts(data.products);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Trigger refetch with new sort option
    setTimeout(() => fetchSearchResults(), 0);
  };

  const getSearchKeyword = () => {
    const params = new URLSearchParams(location.search);
    if (params.get('deals')) return 'Special Deals';
    return params.get('keyword') || params.get('category') || '';
  };

  return (
    <div className="container mt-4 mb-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>
            {new URLSearchParams(location.search).get('deals') ? 'Special Deals' : 'Search Results'}
            {getSearchKeyword() && !new URLSearchParams(location.search).get('deals') && (
              <span className="text-muted fs-5"> for "{getSearchKeyword()}"</span>
            )}
          </h2>
          <p className="text-muted mb-0">
            {loading ? 'Searching...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Sort Dropdown */}
        {products.length > 0 && (
          <Form.Control
            as="select"
            value={sortBy}
            onChange={handleSortChange}
            style={{ width: '200px' }}
            className="shadow-sm"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </Form.Control>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Searching products...</p>
        </div>
      ) : products.length === 0 ? (
        /* No Results */
        <div className="text-center py-5">
          <i className="fas fa-search fa-4x text-muted mb-3"></i>
          <h4>No products found</h4>
          <p className="text-muted mb-4">
            Try searching with different keywords or browse all products
          </p>
          <Button
            variant="primary"
            onClick={() => history.push('/')}
          >
            <i className="fas fa-home me-2"></i>
            Go to Homepage
          </Button>
        </div>
      ) : (
        /* Product Grid */
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <ProductScreen product={product} />
            </Col>
          ))}
        </Row>
      )}

      {/* Search Tips */}
      {!loading && products.length === 0 && (
        <div className="mt-5 p-4 bg-light rounded">
          <h5 className="mb-3">
            <i className="fas fa-lightbulb text-warning me-2"></i>
            Search Tips:
          </h5>
          <ul className="mb-0">
            <li>Check your spelling</li>
            <li>Try more general keywords</li>
            <li>Try different keywords</li>
            <li>Browse by category instead</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResultScreen;