import  React,{useState,useEffect}  from 'react';

import {Row, Col} from 'react-bootstrap';
import axios from 'axios';
import ProductScreen from "./ProductScreen";

const HomeScreen = () => {
    const [Products,setProducts]= useState([]);
    useEffect(()=>{
        const fetchProducts = async()=>{
            const {data}= await axios.get('/products')
            setProducts(data);
        }
        fetchProducts();
    },[])

    return (
        <div className="container-fluid">
           <Row>
               {
                   Products.map((product) =>(
                     <Col key={product._id} md={3} >
                         <ProductScreen product={product}/>
                     </Col>

                       )
                   )
               }
           </Row>
        </div>
    );
};

export default HomeScreen;
