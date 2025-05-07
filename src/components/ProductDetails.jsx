import React,{useState,useEffect} from 'react';

import axios from "axios";
import {Row, Col, ListGroup, Button, Image, ListGroupItem} from 'react-bootstrap'
import Rating from "./Rating";
import {Link} from "react-router-dom";
const ProductDetails = ({match})=> {
    const [product,setProduct]= useState([])
    useEffect(()=>{
        const fetchProduct = async ()=>{
            const {data}= await axios.get('/products/'+match.params.id)
            setProduct(data)
        };
        fetchProduct();
    },[match])
    function addToCart(event) {
        event.preventDefault()


        const cartAdded ={
            _id:product._id,
            name: product.name,
            image: product.image,
            price:product.price
        }

        axios.post(`${process.env.REACT_APP_API_URL}/addCart`, cartAdded)
          .then(function(response) { console.log(response) })
          .catch(function(err) { console.log(err) })
        window.location= '/'

    }
    return (
        <div>
            <Link to="/" className="btn btn-light">
                <i class="fas fa-arrow-left"></i>  &nbsp;  Go Back
            </Link>
            <Row>
                <Col md={6}>
                    <Image src = {product.image} alt={product.name} fluid/>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <h3> {product.name} </h3>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Rating value={product.rating} text={product.numReviews+ 'reviews'}/>

                        </ListGroupItem>
                        <ListGroupItem>
                            Price: $ {product.price}
                        </ListGroupItem>
                        <ListGroupItem>
                            {product.description}
                        </ListGroupItem>
                    </ListGroup>

                </Col>
                <Col md={3}>
                    <ListGroupItem>
                        <Row>
                            <Col>
                                Status:
                            </Col>
                            <Col>
                                {product.countInStock > 0? "In Stock" : "Out of Stock"}
                            </Col>
                        </Row>
                    </ListGroupItem>
                    <ListGroupItem>
                        <Button className="btn block " type="button" onClick={addToCart} >
                            Add To Cart
                        </Button>
                    </ListGroupItem>
                </Col>
            </Row>

        </div>
    )
}

export default ProductDetails;
