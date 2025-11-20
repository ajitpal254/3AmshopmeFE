import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Button,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
  Modal,
} from "react-bootstrap";
import api from "../utils/api";

const DeleteConfirm = () => {
  const history = useHistory();
  const { id } = useParams();
  const [cart, setCart] = useState({});
  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/cart/${id}`);
        setCart(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  const handleClose = () => {
    setShow(false);
    history.push("/cart");
  };

  const deleteFromCart = async () => {
    try {
      await api.delete(`/cart/${id}`);
      handleClose();
    } catch (error) {
      console.log(error);
    }
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
