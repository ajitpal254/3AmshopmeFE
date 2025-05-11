import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";

const DeleteConfirm = ({ match }) => {
  const env = process.env.NODE_ENV;
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `${
          env === "production"
            ? process.env.REACT_APP_API_URL_PROD
            : process.env.REACT_APP_API_URL
        }/cart/` + match.params.id
      );
      setCart(data);
      console.log(data);
    };
    fetchData();
  }, [match]);

  function deleteFromCart() {
    axios
      .delete(
        `${
          env === "production"
            ? process.env.REACT_APP_API_URL_PROD
            : process.env.REACT_APP_API_URL
        }/cart/` + match.params.id
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    window.location = "/cart";
  }

  return (
    <div>
      <Link to="/cart" className="btn btn-light">
        <i class="fas fa-arrow-left"></i> &nbsp; Go Back
      </Link>
      <Row>
        <Col md={6}>
          <Image src={cart.image} alt={cart.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroupItem>
              <h3> {cart.name} </h3>
            </ListGroupItem>

            <ListGroupItem>Price: $ {cart.price}</ListGroupItem>
            <ListGroupItem>Quantity: {cart.quantity}</ListGroupItem>
            <Button className="btn btn-dark btn-block" onClick={deleteFromCart}>
              Confirm Delete
            </Button>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
};

export default DeleteConfirm;
