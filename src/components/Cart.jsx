
import React from 'react';
import {Button, Card} from "react-bootstrap";

import {Link} from "react-router-dom";





const Cart = ({cart}) => {
    return (
        <>
            <Card className="my-3 p-3 rounded">


                    <Card.Img src={cart.image} variant="top" >

                    </Card.Img>

                <Card.Body>

                        <Card.Title as="div">
                            <strong>{cart.name}</strong>
                        </Card.Title>


                    <Card.Text as="div">
                        ${cart.price}
                    </Card.Text>
                    <select>
                        <option value="1">{cart.quantity}</option>
                        <option value="2">{cart.quantity + 1}</option>
                        <option value="3">{cart.quantity + 2}</option>
                        <option value="4">{cart.quantity + 3}</option>
                    </select>
                    <Link to={'/cart/'+cart._id} >
                        &nbsp;<Button className="btn-sm btn-outline-danger" ><i className="fas fa-trash"></i> </Button>
                    </Link>


                </Card.Body>
            </Card>

        </>
    )
}

export default Cart;
