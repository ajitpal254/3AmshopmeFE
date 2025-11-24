import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, Form, Badge, Container, Alert } from "react-bootstrap";
import Rating from "../components/Rating";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import notificationService from "../utils/notificationService";

// Hook must be declared outside the component
function useRelatedItems(currentProduct) {
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    if (currentProduct && currentProduct.category) {
      const fetchAllProducts = async () => {
        try {
          const { data } = await api.get('/products');
          // Handle both array and object response formats
          const products = Array.isArray(data) ? data : data.products || [];

          const filtered = products.filter(
            (item) =>
              item.category === currentProduct.category &&
              item._id !== currentProduct._id
          );

          setRelatedItems(filtered);
        } catch (error) {
          console.error("Error fetching related items", error);
        }
      };

      fetchAllProducts();
    }
  }, [currentProduct]);

  return relatedItems;
}

const ProductDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const { user } = useAuth();

  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errorProductReview, setErrorProductReview] = useState("");
  const [successProductReview, setSuccessProductReview] = useState(false);
  const [loadingProductReview, setLoadingProductReview] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product", error);
      notificationService.error("Failed to load product details");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const relatedItems = useRelatedItems(product);

  const addToCartHandler = () => {
    history.push(`/cart/${id}?qty=${qty}`);
    notificationService.success("Added to Cart");
  };

  const addToWishlistHandler = async () => {
    if (!user) {
      notificationService.info("Please login to add to wishlist");
      return;
    }
    try {
      await api.post(`/api/wishlist/${user._id}`, { productId: id });
      notificationService.success("Added to wishlist");
    } catch (error) {
      notificationService.error(error.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoadingProductReview(true);
    try {
      await api.post(`/products/${id}/reviews`, {
        rating,
        comment,
        name: user.name || user.email, // Fallback to email if name is missing
        user: user._id
      });
      setLoadingProductReview(false);
      setSuccessProductReview(true);
      setRating(0);
      setComment("");
      fetchProduct(); // Refresh to show new review
      notificationService.success("Review submitted successfully");
    } catch (error) {
      setLoadingProductReview(false);
      const errorMsg = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
      setErrorProductReview(errorMsg);
      notificationService.error(errorMsg);
    }
  };

  // Calculate discount pricing
  const hasDiscount = product.isOnDiscount && product.discountPercentage > 0;
  const displayPrice = hasDiscount
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price;

  return (
    <Container className="py-5">
      <Link className="btn btn-outline-dark mb-4" to="/">
        <i className="fas fa-arrow-left me-2"></i> Go Back
      </Link>

      <Row className="mb-5">
        <Col md={6} className="mb-4 mb-md-0">
          <div className="p-4 bg-white rounded shadow-sm d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
            <Image src={product.image} alt={product.name} fluid style={{ maxHeight: '500px', objectFit: 'contain' }} />
          </div>
        </Col>

        <Col md={6}>
          <div className="ps-md-4">
            <h1 className="display-5 fw-bold mb-2">{product.name}</h1>
            <div className="mb-3">
              <Rating
                value={product.rating}
                text={`${product.numReviews || 0} reviews`}
              />
            </div>

            <div className="mb-4">
              {hasDiscount ? (
                <div className="d-flex align-items-center">
                  <h2 className="text-success fw-bold me-3 mb-0">${displayPrice}</h2>
                  <span className="text-decoration-line-through text-muted fs-5 me-2">${product.price}</span>
                  <Badge bg="danger" className="fs-6">{product.discountPercentage}% OFF</Badge>
                </div>
              ) : (
                <h2 className="fw-bold">${product.price}</h2>
              )}
            </div>

            <p className="lead text-muted mb-4">{product.description}</p>

            <Card className="border-0 shadow-sm bg-light mb-4">
              <Card.Body>
                <Row className="align-items-center mb-3">
                  <Col xs={6}><strong>Price:</strong></Col>
                  <Col xs={6}>
                    {hasDiscount ? (
                      <span className="text-success fw-bold">${displayPrice}</span>
                    ) : (
                      <span className="fw-bold">${product.price}</span>
                    )}
                  </Col>
                </Row>
                <Row className="align-items-center mb-3">
                  <Col xs={6}><strong>Status:</strong></Col>
                  <Col xs={6}>
                    {product.countInStock > 0 ? (
                      <span className="text-success"><i className="fas fa-check-circle me-1"></i> In Stock</span>
                    ) : (
                      <span className="text-danger"><i className="fas fa-times-circle me-1"></i> Out Of Stock</span>
                    )}
                  </Col>
                </Row>

                {product.countInStock > 0 && (
                  <Row className="align-items-center mb-4">
                    <Col xs={6}><strong>Quantity:</strong></Col>
                    <Col xs={6}>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="form-select"
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                )}

                <div className="d-grid gap-2">
                  <Button
                    onClick={addToCartHandler}
                    className="py-2 fw-bold"
                    variant="primary"
                    size="lg"
                    disabled={product.countInStock === 0}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                  >
                    <i className="fas fa-shopping-cart me-2"></i> Add To Cart
                  </Button>

                  <Button
                    onClick={addToWishlistHandler}
                    className="py-2 fw-bold"
                    variant="outline-danger"
                    size="lg"
                  >
                    <i className="fas fa-heart me-2"></i> Add To Wishlist
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <h3 className="mb-4">Reviews</h3>
          {product.reviews && product.reviews.length === 0 && <Alert variant="info">No Reviews Yet</Alert>}
          <ListGroup variant="flush" className="mb-4">
            {product.reviews && product.reviews.filter(r => r.isApproved !== false).map((review) => (
              <ListGroup.Item key={review._id} className="bg-light rounded mb-3 border-0 p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <strong>{review.name}</strong>
                    {review.isVerifiedPurchase && (
                      <Badge bg="success" className="ms-2">
                        <i className="fas fa-check-circle me-1"></i>
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <Rating value={review.rating} />
                </div>
                <p className="text-muted small mb-2">{review.createdAt && review.createdAt.substring(0, 10)}</p>
                <p className="mb-2">{review.comment}</p>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={async () => {
                      if (!user) {
                        notificationService.info('Please login to vote on reviews');
                        history.push('/app/login');
                        return;
                      }

                      try {
                        await api.post(`/api/reviews/${product._id}/${review._id}/vote`);
                        notificationService.success('Vote recorded!');
                        fetchProduct(); // Refresh to show updated count
                      } catch (error) {
                        console.error('Vote error:', error);
                        notificationService.error(error.response?.data?.message || 'Failed to vote');
                      }
                    }}
                  >
                    <i className="fas fa-thumbs-up me-1"></i>
                    Helpful ({review.helpfulVotes || 0})
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <div className="bg-white p-4 rounded shadow-sm border">
            <h4 className="mb-3">Write a Customer Review</h4>
            {successProductReview && (
              <Alert variant="success">Review submitted successfully</Alert>
            )}
            {loadingProductReview && <Alert variant="info">Submitting...</Alert>}
            {errorProductReview && (
              <Alert variant="danger">{errorProductReview}</Alert>
            )}
            {user ? (
              <Form onSubmit={submitHandler}>
                <Form.Group controlId="rating" className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    as="select"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="comment" className="mb-3">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    row="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Button
                  disabled={loadingProductReview}
                  type="submit"
                  variant="primary"
                >
                  Submit
                </Button>
              </Form>
            ) : (
              <Alert variant="warning">
                Please <Link to="/app/login">sign in</Link> to write a review
              </Alert>
            )}
          </div>
        </Col>
      </Row>

      <RelatedItemsList relatedItems={relatedItems} />
    </Container >
  );
};

// Related items section
export const RelatedItemsList = ({ relatedItems }) => {
  if (!relatedItems || relatedItems.length === 0) return null;

  return (
    <div className="related-items mt-5 pt-5 border-top">
      <h3 className="mb-4">Related Items</h3>
      <div className="d-flex flex-wrap gap-4">
        {relatedItems.map((item) => {
          const hasDiscount = item.isOnDiscount && item.discountPercentage > 0;
          const displayPrice = hasDiscount
            ? (item.price * (1 - item.discountPercentage / 100)).toFixed(2)
            : item.price;

          return (
            <Link
              key={item._id}
              to={`/products/${item._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Card className="shadow-sm border-0 h-100 transition-hover" style={{ width: "16rem" }}>
                {hasDiscount && (
                  <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                    {item.discountPercentage}% OFF
                  </Badge>
                )}
                <div style={{ height: "200px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
                  <Card.Img
                    variant="top"
                    src={item.image}
                    alt={item.name}
                    style={{ maxHeight: "100%", width: "auto", objectFit: "contain" }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-6 mb-2 text-truncate" title={item.name}>
                    {item.name}
                  </Card.Title>
                  <div className="mt-auto">
                    {hasDiscount ? (
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-decoration-line-through text-muted small">
                          ${item.price}
                        </span>
                        <span className="text-success fw-bold">
                          ${displayPrice}
                        </span>
                      </div>
                    ) : (
                      <div className="fw-bold">
                        ${item.price}
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductDetails;
