import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {Button, Col, Image, ListGroup, ListGroupItem, Row} from "react-bootstrap";



const AdminDeleteConfirm = ({match})=> {
    const [AdminProduct,setAdminProduct] = useState([])
    useEffect(()=>{
        const fetchData = async ()=>{
            const {data} = await axios.get('/admin/delete/'+match.params.id);
            setAdminProduct(data)
            console.log(data)
        }
        fetchData()
    },[match])


    function deleteProduct() {
        axios.delete('/admin/delete/'+match.params.id).then(response => {console.log(response.data)}).catch(error => {console.log(error)})
        window.location = '/admin/delete'
    }

    return(

        <div>
            <Link to="/admin/delete" className="btn btn-light">
                <i class="fas fa-arrow-left"></i>  &nbsp;  Go Back
            </Link>
            <Row>
                <Col md={6}>
                    <Image src = {AdminProduct.image} alt={AdminProduct.name} fluid/>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroupItem>
                            <h3> {AdminProduct.name} </h3>
                        </ListGroupItem>

                        <ListGroupItem>
                            Price: $ {AdminProduct.price}

                        </ListGroupItem>

                        <Button className="btn btn-dark btn-block" onClick={deleteProduct}>Confirm Delete</Button>
                    </ListGroup>
                </Col>
            </Row>



        </div>

    )


}


export default AdminDeleteConfirm;
