import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import ProductScreen from "../components/ProductScreen";
import api from "../utils/api";

const SearchResultScreen = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchSearchResults = async () => {
      const keyword = location.search.split("=")[1];
      if (keyword) {
        try {
          const { data } = await api.get(`/products?keyword=${keyword}`);
          setProducts(data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      }
    };
    fetchSearchResults();
  }, [location.search]);

  return (
    <div className="container mt-4">
      <h1 className="text-center my-4">Search Results</h1>
      {products.length === 0 ? (
        <div className="alert alert-info text-center">No products found.</div>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <ProductScreen product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SearchResultScreen;