import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button, Form, Badge } from "react-bootstrap";
import Rating from "../components/Rating";
import api from "../utils/api";

// Hook must be declared outside the component
function useRelatedItems(currentProduct) {
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    if (currentProduct && currentProduct.category) {
      const fetchAllProducts = async () => {
        try {
          const { data } = await api.get('/products');

          const filtered = data.filter(
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
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };
    fetchProduct();
  }, [id]);

  const relatedItems = useRelatedItems(product);

  const addToCartHandler = () => {
    history.push(`/cart/${id}?qty=${qty}`);
  };

  // Calculate discount pricing
  const hasDiscount = product.isOnDiscount && product.discountPercentage > 0;
  const displayPrice = hasDiscount
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price;

  return (
    <div className="container">
      <Link className="btn btn-light my-3" to="/">
        <i className="fas fa-arrow-left"></i> Go Back
      </Link>
      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <div className="d-flex align-items-center gap-2">
                <span>Price: </span>
                {hasDiscount ? (
                  <>
                    <Badge bg="danger">{product.discountPercentage}% OFF</Badge>
                    <span style={{ textDecoration: 'line-through', color: '#999' }}>
                      ${product.price}
                    </span>
                    <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      ${displayPrice}
                    </span>
                  </>
                ) : (
                  <span style={{ fontWeight: 'bold' }}>${product.price}</span>
                )}
              </div>
            </ListGroup.Item>
            <ListGroup.Item>Description: {product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    {hasDiscount ? (
                      <div>
                        <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9rem' }}>
                          ${product.price}
                        </div>
                        <strong style={{ color: '#28a745' }}>${displayPrice}</strong>
                      </div>
                    ) : (
                      <strong>${product.price}</strong>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  onClick={addToCartHandler}
                  className="btn-block btn-success w-100"
                  type="button"
                  disabled={product.countInStock === 0}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <RelatedItemsList relatedItems={relatedItems} />
    </div>
  );
};

// Related items section
export const RelatedItemsList = ({ relatedItems }) => {
  return (
    <div className="related-items mt-5">
      <h4 className="mb-3">Related Items</h4>
      <div className="d-flex flex-wrap gap-3">
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
              <Card className="shadow-sm border-0 position-relative" style={{ width: "12rem" }}>
                {hasDiscount && (
                  <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
                    {item.discountPercentage}% OFF
                  </Badge>
                )}
                <Card.Img
                  variant="top"
                  src={item.image}
                  alt={item.name}
                  style={{ height: "160px", objectFit: "cover" }}
                />
                <Card.Body className="text-center">
                  <Card.Title style={{ fontSize: "1rem" }}>
                    {item.name}
                  </Card.Title>
                  <Card.Text>
                    {hasDiscount ? (
                      <>
                        <div style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.85rem' }}>
                          ${item.price}
                        </div>
                        <div style={{ color: "#28a745", fontWeight: "bold" }}>
                          ${displayPrice}
                        </div>
                      </>
                    ) : (
                      <div style={{ color: "#28a745", fontWeight: "bold" }}>
                        ${item.price}
                      </div>
                    )}
                  </Card.Text>
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

