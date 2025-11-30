import React from "react";
import { Container, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import ProductFormEnhanced from "../components/form/ProductFormEnhanced";
import "../components/css/ProductUpload.css";

// Common product categories
const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Accessories',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Beauty & Personal Care',
  'Food & Beverages',
  'Health & Wellness',
  'Automotive',
  'Office Supplies',
  'Pet Supplies',
  'Music & Instruments',
  'Art & Crafts',
  'Jewelry',
  'Shoes',
  'Bags & Luggage',
  'Furniture',
  'Kitchen & Dining'
];

const Admin = () => {
  const { vendor } = useAuth();
  const navigate = useNavigate();

  const handleCreateProduct = async (productData) => {
    try {
      const endpoint = vendor ? "/vendor/upload" : "/admin/upload";
      await api.post(endpoint, productData);
      toast.success("Product uploaded successfully!");
      
      // Navigate to product list after successful creation
      setTimeout(() => {
        navigate(vendor ? '/vendor/products' : '/admin/productlist');
      }, 1500);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to upload product");
    }
  };

  return (
    <div className="product-upload-container py-4">
      <Container>
        <Card className="mb-4 shadow-sm">
          <div className="product-upload-header p-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-2">
                  <i className="fas fa-cloud-upload-alt me-2"></i>
                  Upload Product
                </h2>
                <p className="text-muted mb-0">Add a new product to your store</p>
              </div>
              <Link 
                to={vendor ? "/vendor/products" : "/admin/productlist"} 
                className="btn btn-light"
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to List
              </Link>
            </div>
          </div>
        </Card>

        <ProductFormEnhanced
          onSubmit={handleCreateProduct}
          categories={PRODUCT_CATEGORIES}
          isEditing={false}
        />
      </Container>
    </div>
  );
};

export default Admin;
