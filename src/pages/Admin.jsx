import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { uploadProductImage } from "../utils/cloudinaryUpload";
import ImageUploader from "../components/form/ImageUploader";
import "../components/css/ProductUpload.css";

const Admin = () => {
  const { vendor } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    brand: "",
    category: "",
    countInStock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size too large (max 10MB)");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, (progress) => {
          setUploadProgress(progress);
        });
      } else {
        setError("Please upload a product image");
        setLoading(false);
        return;
      }

      const productData = {
        ...formData,
        image: imageUrl,
        rating: 0, // Default rating
      };

      const endpoint = vendor ? "/vendor/upload" : "/admin/upload";
      await api.post(endpoint, productData);
      setSuccess("Product uploaded successfully!");
      setFormData({
        name: "",
        price: "",
        description: "",
        brand: "",
        category: "",
        countInStock: "",
      });
      handleRemoveImage();
      setUploadProgress(0);
      window.scrollTo(0, 0);

    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.response?.data?.message || "Failed to upload product");
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-upload-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="product-upload-card">
              <div className="product-upload-header">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="mb-0"><i className="fas fa-cloud-upload-alt me-2"></i>Upload Product</h2>
                  <Link to={vendor ? "/vendor/products" : "/admin/productlist"} className="btn btn-light btn-sm text-primary fw-bold">
                    <i className="fas fa-arrow-left me-1"></i> Back
                  </Link>
                </div>
                <p className="mb-0 mt-2 opacity-75">Add a new product to your store</p>
              </div>
              <div className="product-upload-body">
                {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
                {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <ImageUploader
                    imagePreview={imagePreview}
                    onImageChange={handleImageChange}
                    onRemove={handleRemoveImage}
                    uploadProgress={uploadProgress}
                  />

                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Wireless Headphones"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Price ($)</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Stock Count</Form.Label>
                        <Form.Control
                          type="number"
                          name="countInStock"
                          value={formData.countInStock}
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          placeholder="e.g., Sony"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          type="text"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          placeholder="e.g., Electronics"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Detailed product description..."
                      rows={4}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-upload"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2"></i>
                        Submit Product
                      </>
                    )}
                  </Button>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Admin;
