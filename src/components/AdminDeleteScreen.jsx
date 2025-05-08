import  React,{useState,useEffect}  from 'react';

import {Row, Col} from 'react-bootstrap';
import axios from 'axios';

import AdminDelete from "./AdminDelete";


const AdminDeleteScreen = () => {
    const [AdminProduct, setAdminProduct] = useState([]);
    useEffect(()=>{
        const env = process.env.NODE_ENV;
        axios.get(`${env === 'production' ? process.env.REACT_APP_API_URL_PROD : process.env.REACT_APP_API_URL}/admin/delete`)
            .then(response => {
            setAdminProduct(response.data);
            })
            .catch(error => {
            console.log(error);
            });
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
