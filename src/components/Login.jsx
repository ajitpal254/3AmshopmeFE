import React,{useState} from "react";
import axios from "axios";

const Login =(props)=>{
    const [user,setUser] =useState({
        email:"",
        password:"",
        isAdmin:false

    }
    )
    const {email,password,isAdmin} = user;
    const onChange = e=>
        setUser({
            ...user,
            [e.target.name]:e.target.value
        });

    const submitForm = (event) => {
        event.preventDefault()

        axios({
            url: `${env === 'production'?process.env.REACT_APP_API_URL_PROD:process.env.REACT_APP_API_URL}/app/login`,
            dataType: "JSON",
            data: {
                email: email,
                password: password
            },
            method: "POST"
        }).then((response) => {
            if ( response.data ) {
                if ( response.data.status === 200 ) {
                    localStorage.setItem('loggedIn', "true")
                    props.setLoggedIn(true)

                } else {}
                if ( localStorage.getItem('loggedIn') ) {
                    localStorage.removeItem('loggedIn')
                }
            }
        }).catch(err => {
            console.error(err)
        })
    }

    return(
        <div>
            <div  className="container">
                <div className="form-div">
                    <h3 className="text-center">Login</h3>
                    <form onSubmit={submitForm}>

                        <input type="text" name="email" placeholder="abc@abc.com" onChange={onChange} value={email} className="form-control form-group" />

                        <input type="password" name="password" placeholder="password" onChange={onChange} value={password} className="form-control form-group" />

                        <input type="checkbox" name="IsAdmin" onChange={onChange} value={isAdmin} className="form-control form-" />
                        <input type="submit" className="btn btn-danger btn-block" value='Submit' />
                    </form>

                </div>

            </div>
        </div>
    )
}

export default Login;
