import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from 'react-toastify';
import api from "../utils/api";

const AdminDeleteScreen = () => {
    const [products, setProducts] = useState([]);
    
    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to fetch products");
            }
        };
        fetchProducts();
    }, []);

    const confirmDelete = (id) => {
        setProductToDelete(id);
        setShowDeleteModal(true);
    };

    const deleteHandler = async () => {
        if (!productToDelete) return;
        
        try {
            await api.delete(`/admin/delete/${productToDelete}`);
            setProducts(products.filter((product) => product._id !== productToDelete));
            toast.success("Product deleted successfully");
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Products List</h2>
            <Table striped bordered hover responsive className="table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>PRICE</th>
                        <th>CATEGORY</th>
                        <th>BRAND</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                    <Button variant="light" className="btn-sm">
                                        <i className="fas fa-edit"></i>
                                    </Button>
                                </LinkContainer>
                                <Button
                                    variant="danger"
                                    className="btn-sm"
                                    onClick={() => confirmDelete(product._id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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

export default AdminDeleteScreen;
