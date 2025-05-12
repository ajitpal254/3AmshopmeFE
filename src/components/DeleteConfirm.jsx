import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  Button,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
  Modal,
} from "react-bootstrap";

const DeleteConfirm = ({ match }) => {
  const history = useHistory();
  const env = process.env.NODE_ENV;
  const [cart, setCart] = useState({});
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${
            env === "production"
              ? process.env.REACT_APP_API_URL_PROD
              : process.env.REACT_APP_API_URL
          }/cart/${match.params.id}`
        );
        setCart(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [env, match.params.id]);

  const handleClose = () => {
    setShow(false);
    history.push("/cart");
  };

  const deleteFromCart = () => {
    axios
      .delete(
        `${
          env === "production"
            ? process.env.REACT_APP_API_URL_PROD
            : process.env.REACT_APP_API_URL
        }/cart/${match.params.id}`
      )
      .then((response) => {
        console.log(response.data);
        handleClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <Image src={cart.image} alt={cart.name} fluid />
          </Col>
          <Col md={6}>
            <ListGroup variant="flush">
              <ListGroupItem>
                <h3>{cart.name}</h3>
              </ListGroupItem>
              <ListGroupItem>Price: $ {cart.price}</ListGroupItem>
              <ListGroupItem>Quantity: {cart.quantity}</ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
        <p className="mt-3">Are you sure you want to delete this item from your cart?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="dark" onClick={deleteFromCart}>
          Confirm Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirm;
