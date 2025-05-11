import React, {Component} from 'react';
import {Nav, Navbar, Button, Form, FormControl, Container, Dropdown} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'



export default class Header extends React.Component {
    handleLogout = () => {
        console.log("Removing logged in status");
        localStorage.setItem("loggedIn", "false");
        if (this.props.setLoggedIn) {
            this.props.setLoggedIn(false);
        }
    }

    render() {
        const { loggedIn } = this.props;
        return (
            <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect style={{ padding: '0.5rem 1rem' }}>
            <Container>
                <LinkContainer to="/">
                <Navbar.Brand>
                    <img
                    src="/pp_1.jpg"
                    height="40"
                    width="40"
                    className="d-inline-block align-middle rounded-circle"
                    alt="Logo"
                    />{' '}
                    <span style={{ fontWeight: 'bold' }}>3AM Shoppee</span>
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
                    {loggedIn && (
                    <>
                        <LinkContainer to="/products/upload">
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
                    <Form inline className="mr-2">
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-light">Search</Button>
                    </Form>
                    {loggedIn ? (
                    <Button variant="outline-warning" onClick={this.handleLogout}>
                        <i className="fas fa-user"></i> {this.props.username} - Logout
                    </Button>
                    ) : (
                    <Dropdown alignRight>
                        <Dropdown.Toggle
                        variant="outline-success"
                        id="dropdown-login-signup"
                        style={{
                            borderRadius: "50%",
                            backgroundColor: "#28a745",
                            borderColor: "#28a745",
                            padding: "0.4rem 0.6rem",
                        }}
                        >
                        <i className="fas fa-user"></i>
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


