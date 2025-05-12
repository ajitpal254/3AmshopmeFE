import React from "react";
import {
  Nav,
  Navbar,
  Button,
  Form,
  FormControl,
  Container,
  Dropdown,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { withRouter } from "react-router-dom";

class Header extends React.Component {
  state = {
    searchQuery: "",
  };

  handleLogout = () => {
    if (this.props.handleLogout) {
      this.props.handleLogout();
    } else {
      console.error("handleLogout prop not provided to Header");
      // Fallback logout, assuming App.js would ideally handle global state and localStorage
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("isActualAdmin"); // Ensure admin status is also cleared
      this.props.history.push("/app/login"); // Redirect to login
      window.location.reload(); // Force reload as a last resort if state isn't clearing UI
    }
  };

  onSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleSearch = (event) => {
    event.preventDefault();
    const { searchQuery } = this.state;
    if (searchQuery.trim()) {
      this.props.history.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      // this.setState({ searchQuery: "" }); // Optional: Clear search bar
    } else {
      console.log("Search query is empty.");
    }
  };

  render() {
    // Destructure props, including the new isUserAdmin prop
    // isUserAdmin should be a boolean passed from the parent component (e.g., App.js)
    // indicating if the logged-in user has actual admin rights.
    const { loggedIn, username, isUserAdmin } = this.props;
    // console.log("Header props:", this.props); // For debugging

    return (
      <Navbar
        bg="primary"
        variant="dark"
        expand="lg"
        collapseOnSelect
        style={{ padding: "0.5rem 1rem" }}
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                src="/pp_1.jpg" // Ensure this path is correct relative to your public folder
                height="40"
                width="40"
                className="d-inline-block align-middle rounded-circle"
                alt="Logo"
              />{" "}
              <span style={{ fontWeight: "bold" }}>3AM Shoppee</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {/* Common Navigation Links */}
              <LinkContainer to="/">
                <Nav.Link>
                  <i className="fas fa-home"></i> Home
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </LinkContainer>

              {/* Conditional Admin Links */}
              {/* Show these links only if the user is logged in AND is an admin */}
              {loggedIn && isUserAdmin && (
                <>
                  <LinkContainer to="/admin/upload">
                    <Nav.Link>
                      <i className="fas fa-cloud-upload-alt"></i> Admin Upload
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/admin/delete">
                    <Nav.Link>
                      <i className="fas fa-trash-alt"></i> Admin Delete
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
            <Nav className="ml-auto align-items-center">
              {/* Search Form */}
              <Form inline className="mr-2" onSubmit={this.handleSearch}>
                <FormControl
                  type="text"
                  placeholder="Search products..."
                  className="mr-sm-2"
                  value={this.state.searchQuery}
                  onChange={this.onSearchChange}
                  aria-label="Search"
                />
                <Button variant="outline-light" type="submit">
                  Search
                </Button>
              </Form>

              {/* Login/Logout Dropdown */}
              {loggedIn ? (
                <Dropdown alignRight>
                  <Dropdown.Toggle
                    variant="outline-light"
                    id="dropdown-user-options"
                  >
                    <i className="fas fa-user"></i> {username || "User"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      borderRadius: "0.25rem",
                      boxShadow: "0 5px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    {/* Add other user-specific links here if needed, e.g., Profile */}
                    <Dropdown.Item onClick={this.handleLogout}>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Dropdown alignRight>
                  <Dropdown.Toggle
                    variant="outline-success" // Changed for better visibility of login button
                    id="dropdown-login-signup"
                    // Removed inline styles for custom circle to use standard button look
                  >
                    <i className="fas fa-user"></i> Account
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    style={{
                      borderRadius: "0.25rem",
                      boxShadow: "0 5px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    <LinkContainer to="/app/login">
                      <Dropdown.Item>Login</Dropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/app/signup">
                      <Dropdown.Item>Sign Up</Dropdown.Item>
                    </LinkContainer>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(Header);