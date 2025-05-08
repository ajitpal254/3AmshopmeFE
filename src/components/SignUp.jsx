import React,{Component} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";


class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            name:'',
            email:'',
            password:''
        }
        this.changeName = this.changeName.bind(this)
        this.changeEmail = this.changeEmail.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    changeName(event){
        this.setState({
            name:event.target.value
        })
    }
    changeEmail(event){
        this.setState({
            email:event.target.value
        })
    }
    changePassword(event){
        this.setState({
            password:event.target.value
        })
    }
    onSubmit(event){
        event.preventDefault()

        const registered = {
            name:this.state.name,
            email:this.state.email,
            password:this.state.password
        }
        const env = process.env.NODE_ENV;

        axios.post(`${env === 'production'?process.env.REACT_APP_API_URL_PROD:process.env.REACT_APP_API_URL}/app/signup`,registered)
            .then(response =>console.log(response.data))
        window.location= '/'
    }

    render() {
        return(
          <div>
            <div  className="container">
                <div className="form-div">
                    <h3 className="text-center">Register</h3>
                    <form onSubmit={this.onSubmit}>
                        <input type="text" placeholder="Full Name" onChange={this.changeName} value={this.state.name} className="form-control form-group" />

                        <input type="text" placeholder="abc@abc.com" onChange={this.changeEmail} value={this.state.email} className="form-control form-group" />

                        <input type="password" placeholder="password" onChange={this.changePassword} value={this.state.password} className="form-control form-group" />

                        <input type="submit" className="btn btn-danger btn-block" value='Submit' />
                    </form>
                    <Link to="/app/login" className="btn text-center">
                        Already Signed Up? Log In
                    </Link>
                </div>

            </div>
          </div>
        );
    }
}
export default SignUp;
