import  React,{useState,useEffect}  from 'react';

import {Row, Col} from 'react-bootstrap';
import axios from 'axios';

import AdminDelete from "./AdminDelete";


const AdminDeleteScreen = () => {
    const [AdminProduct, setAdminProduct] = useState([]);
    useEffect(()=>{
        axios.get('/admin/delete').then(data=>{
            setAdminProduct(data.data)
        }).catch(err=>{console.log(err)})
    })

    // const products = () => {
    //     return AdminProduct.map(product => {
    //         return (
    //                 <Col key={product._id} md={3}>
    //                     <AdminDelete admin={product}/>
    //                 </Col>
    //             )
    //         }
    //     )
    // }

    return (
        <div>
            <Row>
                {AdminProduct.map(prod => {
                    return (
                        <Col key={prod._id} md={3}>
                            <AdminDelete admin={prod} />
                        </Col>
                    )
                })}
            </Row>
        </div>
    );
};

export default AdminDeleteScreen;
