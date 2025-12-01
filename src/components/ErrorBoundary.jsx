import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
          <div className="mb-4">
            <i className="fas fa-exclamation-triangle fa-5x text-warning"></i>
          </div>
          <h1 className="fw-bold mb-3">Oops! Something went wrong.</h1>
          <p className="text-muted mb-4 lead">
            We're sorry, but an unexpected error has occurred.<br />
            Our team has been notified. Please try refreshing the page.
          </p>
          <div className="d-flex gap-3">
            <Button variant="primary" onClick={this.handleReload} className="px-4 py-2 fw-bold rounded-pill">
              Refresh Page
            </Button>
            <Button variant="outline-secondary" href="/" className="px-4 py-2 fw-bold rounded-pill">
              Go to Home
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="mt-5 text-start w-100 p-3 bg-light rounded border overflow-auto" style={{ maxHeight: '300px' }}>
              <h5 className="text-danger">Error Details (Dev Only):</h5>
              <pre className="text-danger small">{this.state.error.toString()}</pre>
              <pre className="text-muted small">{this.state.errorInfo.componentStack}</pre>
            </div>
          )}
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
