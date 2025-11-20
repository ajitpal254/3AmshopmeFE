import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import api from "../utils/api";

const AdminDeleteScreen = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    const deleteHandler = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/admin/delete/${id}`);
                setProducts(products.filter((product) => product._id !== id));
            } catch (error) {
                console.error("Error deleting product:", error);
            }
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
                                    onClick={() => deleteHandler(product._id)}
                                >
                                    <i className="fas fa-trash"></i>
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default AdminDeleteScreen;
