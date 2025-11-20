import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Button, Modal, Row, Col, Image, ListGroup } from "react-bootstrap";
import api from "../utils/api";

const AdminDeleteConfirm = () => {
    const { id } = useParams();
    const history = useHistory();
    const [product, setProduct] = useState({});
    const [show, setShow] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/admin/delete/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleClose = () => {
        setShow(false);
        history.push("/admin/delete");
    };

    const deleteHandler = async () => {
        try {
            await api.delete(`/admin/delete/${id}`);
            history.push("/admin/delete");
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>
                    <Col md={6}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
                <p className="mt-3">Are you sure you want to delete this product?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={deleteHandler}>
                    Confirm Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdminDeleteConfirm;
