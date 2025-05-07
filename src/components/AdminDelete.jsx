import React from "react";
import {Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";

const AdminDelete = ({admin})=>{

    return(
        <div>
            <Card className="my-3 p-3 rounded">

                <Link to={'/admin/delete/'+admin._id}>
                    <Card.Img src={admin.image} variant="top" >

                    </Card.Img>
                </Link>
                <Card.Body>
                        <Card.Title as="div">
                            <strong>{admin.name}</strong>
                        </Card.Title>
                </Card.Body>
                <Link to={'/admin/delete/'+admin._id}>
                <Button className="btn-sm btn-outline-danger" ><i className="fas fa-trash"></i> Delete this Product? </Button>
                </Link>
            </Card>

        </div>

    )
}


export default AdminDelete;
