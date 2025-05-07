import React, {Component} from 'react';
import {Nav, Navbar, Button, NavDropdown, Form, FormControl, Container} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'



export default class Header extends Component {

    render() {


        return (
            <>

                <Navbar bg="dark" expand="lg" variant="dark" collapseOnSelect>
                    <Container>
                        <img
                            src='/pp_1.jpg'
                            height="50"
                            width="50"
                            className="d-inline-block align-top rounded-circle"

                        />  &nbsp;
                        <LinkContainer to="/">

                            <Navbar.Brand>3AM Shoppee</Navbar.Brand>
                        </LinkContainer>

                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ml-auto">
                                <LinkContainer to="/">
                                    <Nav.Link>
                                        <i className="fas fa-home"></i>Home</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/cart">
                                    <Nav.Link>
                                        <i className="fas fa-shopping-cart"></i>Cart</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/app/signup">
                                    <Nav.Link><i className="fas fa-user"></i>signup</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/app/login">
                                    <Nav.Link onClick={() => {
                                        console.log("Removing loggedIn status")
                                        localStorage.setItem("loggedIn", "false")
                                        this.props.setLoggedIn(false)
                                    }}>Logout </Nav.Link>
                                </LinkContainer>
                                {(this.props.loggedIn) ? (
                                    <>
                                        <LinkContainer to="/products/upload">
                                            <Nav.Link><i className="fas fa-admin"></i>Admin Upload</Nav.Link>
                                        </LinkContainer>
                                        <LinkContainer to="/admin/delete">
                                            <Nav.Link><i className="fas fa-admin"></i>Admin Delete</Nav.Link>
                                        </LinkContainer>
                                    </>
                                    ) : ('')
                                }

                                <Form inline>
                                    <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                                    <Button variant="outline-primary">Search</Button>
                                </Form>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>

                </Navbar>
            </>
        );
    }
}


