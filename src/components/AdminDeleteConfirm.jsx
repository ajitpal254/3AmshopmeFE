import React, { useEffect, useState } from "react";
import { Modal, Button, Col, Image, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { getStorage, ref, deleteObject } from "firebase/storage";

const AdminDeleteConfirm = () => {
    const history = useHistory();
    const { id } = useParams();
    const [adminProduct, setAdminProduct] = useState({});
    const [show, setShow] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`/admin/delete/${id}`);
            setAdminProduct(data);
        };
        fetchData();
    }, [id]);

    const handleClose = () => {
        setShow(false);
        history.push("/admin/delete"); // Adjust route as needed
    };

    const deleteProduct = async () => {
        // Delete image from Firebase Storage
        const storage = getStorage();
        // Assume adminProduct.image contains the Firebase storage path (e.g., 'images/products/filename.jpg')
        const imageRef = ref(storage, adminProduct.image);
        try {
            await deleteObject(imageRef);
            console.log("Image deleted from Firebase Storage");
        } catch (error) {
            console.error("Error deleting image from Firebase:", error);
        }

        // Delete the product from the backend
        try {
            const response = await axios.delete(`/admin/delete/${id}`);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
        window.location.href = "/";
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <Image src={adminProduct.image} alt={adminProduct.name} fluid />
                    </Col>
                    <Col md={6}>
                        <ListGroup variant="flush">
                            <ListGroupItem>
                                <h3>{adminProduct.name}</h3>
                            </ListGroupItem>
                            <ListGroupItem>
                                Price: $ {adminProduct.price}
                            </ListGroupItem>
                        </ListGroup>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={deleteProduct}>
                    Confirm Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdminDeleteConfirm;
