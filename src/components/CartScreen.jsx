import React,{useState,useEffect} from 'react'
import axios from "axios";
import {Row, Col, Button} from 'react-bootstrap';
import Cart from "./Cart";


const CartScreen = () =>{
    const [Cartdata,setCart] = useState([])
    useEffect(()=>{
        const fetchData = async ()=>{
            const {data} = await axios.get('/cart')
            setCart(data)
            console.log(data)
        }
        fetchData()
    },[])
    function bill() {
        alert("Thank You, Your Order has been placed")
        axios.delete('/cart')
        window.location='/'

    }

    return (
        <div>
            <Row>
                {
                    Cartdata.map((cart) =>(
                            <Col key={cart._id} md={3}>
                                <Cart cart={cart}/>
                            </Col>
                        )
                    )
                }
            </Row>
            <Button className="btn btn-primary btn-dark" onClick={bill}>Proceed to Check Out</Button>
        </div>
    )
}

export default CartScreen;
