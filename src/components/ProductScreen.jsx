
import  React  from 'react';
import {Button, Card} from "react-bootstrap";
import Rating  from './Rating'

import {Link} from "react-router-dom";
import axios from "axios";

const PrductScreen = ({product}) => {
    const env = process.env.NODE_ENV;

    function addToCart(event) {
        event.preventDefault()


        const cartAdded ={
           _id:product._id,
            name: product.name,
            image: product.image,
            price:product.price
        }


            axios.post(`${env === 'production'?process.env.REACT_APP_API_URL_PROD:process.env.REACT_APP_API_URL}/addCart`,cartAdded).then(function(response) {console.log(response)}).catch(function(err) {console.log(err)})
            //window.location= '/'

    }

    return (
        <>
            <Card className="my-3 p-3 rounded">

                <Link to={`${env === 'production'?process.env.REACT_APP_API_URL_PROD:process.env.REACT_APP_API_URL}/product/`+product._id}>
                    <Card.Img src={product.image} variant="top" >

                    </Card.Img>
                </Link>
                <Card.Body>
                    <Link to={`${env === 'production'?process.env.REACT_APP_API_URL_PROD:process.env.REACT_APP_API_URL}/product/`+product._id}>
                        <Card.Title as="div">
                            <strong>{product.name}</strong>
                        </Card.Title>
                    </Link>
                    <Card.Text as="div">
                        <Rating value={product.rating}

                                text={' reviews'} />
                    </Card.Text>
                    <Card.Text as="div">
                        ${product.price}
                    </Card.Text>
                    <Button className="btn btn-dark btn-block" onClick={addToCart}>Cart</Button>
                </Card.Body>
            </Card>
        </>
    )
}

export default PrductScreen;

