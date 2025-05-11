import { useState, useEffect } from "react";
import axios from "axios";
import {
  Row,
  Col,
  ListGroup,
  Button,
  Image,
  ListGroupItem,
  Spinner,
} from "react-bootstrap";
import Rating from "./Rating";
import { Link, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";

// Hook must be declared outside the component
function useRelatedItems(currentProduct) {
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    if (currentProduct && currentProduct.category) {
      const fetchAllProducts = async () => {
        try {
          const { data } = await axios.get(
            `${
              process.env.NODE_ENV === "production"
                ? process.env.REACT_APP_API_URL_PROD
                : process.env.REACT_APP_API_URL
            }/products`
          );

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
  const env = process.env.NODE_ENV;
  const { id } = useParams(); // Better than using 'match'
  const [product, setProduct] = useState({});
  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(
        `${env === "production" ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL}/products/${id}`
      );
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  const relatedItems = useRelatedItems(product);


  const addToCart = (event) => {
    event.preventDefault();
    const cartAdded = {
      _id: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
    };

    axios
      .post(
        `${env === "production" ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL}/addCart`,
        cartAdded
      )
      .then(() => {
        const notification = document.createElement("div");
        notification.style.position = "fixed";
        notification.style.top = "20px";
        notification.style.right = "20px";
        notification.style.backgroundColor = "#28a745";
        notification.style.color = "#fff";
        notification.style.padding = "15px 30px";
        notification.style.borderRadius = "5px";
        notification.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        notification.style.zIndex = "1000";
        notification.style.fontFamily = "Arial, sans-serif";
        notification.innerText = "Item added to Cart successfully!";
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.style.transition = "opacity 0.5s ease-out";
          notification.style.opacity = "0";
          setTimeout(() => {
            notification.remove();
            window.location = "/";
          }, 500);
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  if (!product._id) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <Link to="/" className="btn btn-light mb-3">
        <i className="fas fa-arrow-left"></i> &nbsp; Go Back
      </Link>
      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h3>{product.name}</h3>
            </ListGroupItem>
            <ListGroupItem>
              <Rating value={product.rating || 0} text={`${product.numReviews || 0} reviews`} />
            </ListGroupItem>
            <ListGroupItem>Price: ${product.price}</ListGroupItem>
            <ListGroupItem>{product.description}</ListGroupItem>
          </ListGroup>
        </Col>
        <Col md={3}>
          <ListGroupItem>
            <Row>
              <Col>Status:</Col>
              <Col>{product.countInStock > 0 ? "In Stock" : "Out of Stock"}</Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem>
            <Button className="btn-block btn-success w-100" type="button" onClick={addToCart}>
              Add To Cart
            </Button>
          </ListGroupItem>
        </Col>
      </Row>

      <RelatedItemsList relatedItems={relatedItems} />
    </div>
  );
};

export default ProductDetails;

// Related items section
export const RelatedItemsList = ({ relatedItems }) => {
  return (
    <div className="related-items mt-5">
      <h4 className="mb-3">Related Items</h4>
      <div className="d-flex flex-wrap gap-3">
        {relatedItems.map((item) => (
          <Link
            key={item._id}
            to={`/products/${item._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card className="shadow-sm border-0" style={{ width: "12rem" }}>
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
                <Card.Text style={{ color: "#28a745", fontWeight: "bold" }}>
                  ${item.price}
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
