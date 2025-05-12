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
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("isActualAdmin");
      this.props.history.push("/app/login");
      window.location.reload();
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
    }
  };

  render() {
    const { loggedIn, username, isUserAdmin } = this.props;

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
                src="/pp_1.jpg"
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

              <Dropdown alignRight>
                <Dropdown.Toggle
                  variant={loggedIn ? "outline-light" : "outline-success"}
                  id="dropdown-account"
                >
                  <i className="fas fa-user"></i> {loggedIn ? username || "User" : "Account"}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{
                    borderRadius: "0.25rem",
                    boxShadow: "0 5px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  {loggedIn ? (
                    <>
                      <Dropdown.Item onClick={this.handleLogout}>
                        Logout
                      </Dropdown.Item>
                    </>
                  ) : (
                    <>
                      <LinkContainer to="/app/login">
                        <Dropdown.Item>User Login</Dropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/app/signup">
                        <Dropdown.Item>User Sign Up</Dropdown.Item>
                      </LinkContainer>
                      <Dropdown.Divider />
                      <LinkContainer to="/vendor/login">
                        <Dropdown.Item>Vendor Login</Dropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/vendor/signup">
                        <Dropdown.Item>Vendor Sign Up</Dropdown.Item>
                      </LinkContainer>
                    </>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default withRouter(Header);
