import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

// Function to parse query parameters from URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResultsScreen() {
  const queryParams = useQuery();
  const searchQuery = queryParams.get("q");

  const [allProducts, setAllProducts] = useState([]); // To store all fetched products
  const [results, setResults] = useState([]);         // To store filtered search results
  const [loading, setLoading] = useState(true);      // Combined loading state
  const [error, setError] = useState("");

  // Effect 1: Fetch all products once on component mount
  useEffect(() => {
    const fetchAllInitialProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const env = process.env.NODE_ENV;
        const baseUrl =
          env === "production"
            ? process.env.REACT_APP_API_URL_PROD
            : process.env.REACT_APP_API_URL;
        
        // API URL to fetch ALL products (no search query parameter here)
        const apiUrl = baseUrl + `/products`; 
        
        console.log(`Workspaceing ALL products from: ${apiUrl}`);
        const response = await axios.get(apiUrl);
        
        setAllProducts(response.data.products || response.data || []);
      } catch (err) {
        console.error("Error fetching initial products:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch products. Please try again."
        );
        setAllProducts([]); // Ensure it's an array on error
      } finally {
        setLoading(false); // Finished loading all products (or failed)
      }
    };

    fetchAllInitialProducts();
  }, []); // Empty dependency array: runs once when the component mounts

  // Effect 2: Filter products whenever searchQuery or allProducts change,
  // or when the initial loading of allProducts is complete.
  useEffect(() => {
    // Only proceed with filtering if we are not in the initial loading phase of allProducts
    if (!loading) { 
      if (searchQuery && searchQuery.trim() !== "") {
        const lowercasedQuery = searchQuery.toLowerCase();
        
        const filtered = allProducts.filter(product => {
          // Define which fields to search in.
          // Ensure properties exist before calling toLowerCase() to prevent errors.
          const nameMatch = product.name && product.name.toLowerCase().includes(lowercasedQuery);
          const descriptionMatch = product.description && product.description.toLowerCase().includes(lowercasedQuery);
          // You can add more fields to search, for example:
          // const categoryMatch = product.category && product.category.toLowerCase().includes(lowercasedQuery);
          
          return nameMatch || descriptionMatch; // || categoryMatch;
        });
        setResults(filtered);
      } else {
        // If there's no valid search query on this search results page, show no results.
        // Alternatively, you could show all products if desired, but typically not for a '/search?q=' URL.
        setResults([]); 
      }
    }
  }, [searchQuery, allProducts, loading]); // Re-filter when these dependencies change

  // Display loading message while initial products are being fetched
  if (loading) {
    return (
      <Container>
        <p className="text-center my-4">Loading products...</p>
      </Container>
    );
  }

  // Display error message if fetching failed
  if (error) {
    return (
      <Container>
        <p className="text-center text-danger my-4">Error: {error}</p>
      </Container>
    );
  }

  // Display search results or prompts
  return (
    <Container>
      {searchQuery && searchQuery.trim() !== "" ? (
        <>
          <h1 className="my-4">Search Results for: "{searchQuery}"</h1>
          {results.length === 0 ? (
            <p>No products found matching your search criteria.</p>
          ) : (
            <Row>
              {results.map((product) => (
                <Col
                  key={product._id || product.id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                  className="mb-4"
                >
                  <Card className="h-100">
                    <LinkContainer
                      to={`/products/${product._id || product.id}`}
                    >
                      <Card.Link>
                        <Card.Img
                          variant="top"
                          src={product.image || "/images/placeholder.png"}
                          alt={product.name || "Product Image"}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      </Card.Link>
                    </LinkContainer>
                    <Card.Body className="d-flex flex-column">
                      <LinkContainer
                        to={`/products/${product._id || product.id}`}
                      >
                        <Card.Link className="text-decoration-none text-dark">
                          <Card.Title as="h5">
                            {product.name || "Unnamed Product"}
                          </Card.Title>
                        </Card.Link>
                      </LinkContainer>
                      <Card.Text>
                        {product.description
                          ? `${product.description.substring(0, 100)}...`
                          : "No description available."}
                      </Card.Text>
                      <Card.Text as="h5" className="mt-auto">
                        $
                        {typeof product.price === "number"
                          ? product.price.toFixed(2)
                          : "N/A"}
                      </Card.Text>
                      <LinkContainer
                        to={`/products/${product._id || product.id}`}
                      >
                        <Button variant="primary" className="mt-2 w-100">
                          View Details
                        </Button>
                      </LinkContainer>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      ) : (
        // This message is shown if the user navigates to /search without a ?q= parameter
        // or if the query is empty.
        <h1 className="my-4">Please enter a search term in the header.</h1>
      )}
    </Container>
  );
}

export default SearchResultsScreen;