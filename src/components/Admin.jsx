import React, {Component} from "react";
import axios from "axios";


class Admin extends Component {
    constructor() {
        super();

        this.state = {
            image: null,
            name: '',
            price: '',
            description: '',
            brand: '',
            numReviews: '',
            rating: '',
            countInStock: '',
            category: '',
            user: '',


        }

        this.changeName = this.changeName.bind(this)
        this.changePrice = this.changePrice.bind(this)
        this.changeDescription = this.changeDescription.bind(this)
        this.changeRating = this.changeRating.bind(this)
        this.changeStock = this.changeStock.bind(this)
        //this.changeReviews = this.changeReviews.bind(this)
        this.changeBrand = this.changeBrand.bind(this)
        this.changeCategory = this.changeCategory.bind(this)

        this.filSelectedHandler = this.filSelectedHandler.bind(this)


        //this.changeUserId=this.changeUserId.bind(this)
    }
        changePrice(event)
        {
            this.setState({
                price: event.target.value
            })
        }

        changeDescription(event)
        {
            this.setState({
                description: event.target.value
            })
        }

        changeBrand(event)
        {
            this.setState({
                brand: event.target.value
            })
        }

        //changeReviews(event)
       // {
          //  this.setState({
              //  numReviews: event.target.value
            //})
        //}

        changeRating(event)
        {
            this.setState({
                rating: event.target.value
            })
        }

        changeStock(event)
        {
            this.setState({
                countInStock: event.target.value
            })
        }
        changeName(event)
        {
            this.setState({
                name: event.target.value
            })
        }

        changeCategory(event){
        this.setState({
            category: event.target.value
        })
        }
   // changeUserId(event) {
      //  this.setState({
       //     user: event.target.value
      //  })

    //}

        filSelectedHandler = event => {
            this.setState({

                image: URL.createObjectURL(event.target.files[0])
            })
        }
        fileUploadHandler = (event) => {
        event.preventDefault()
        const uploadData={
            name:this.state.name,
            price:this.state.price,
            description:this.state.description,
            brand:this.state.brand,
            //numReviews:this.state.reviews,
            rating:this.state.rating,
            countInStock:this.state.countInStock,
            image:this.state.image,
            category:this.state.category,
           // users:this.state.users

        }




            axios.post(`${env === 'production'?process.env.REACT_APP_API_URL_PROD:process.env.REACT_APP_API_URL}/products/upload`, uploadData).then(res => {
                console.log(res);
            }).catch=e=>{
            console.log(e)
            }

        }


render() {


    return(
        <div>
            <form onSubmit={this.fileUploadHandler}>
                <input type="file" onChange={this.filSelectedHandler}  />
                <input type="text" placeholder="Product Name" onChange={this.changeName} value={this.state.name} className="form-control form-group" />
                <input type="text" placeholder="Product Price" onChange={this.changePrice} value={this.state.price} className="form-control form-group" />
                <input type="text" placeholder="Product Description" onChange={this.changeDescription} value={this.state.description} className="form-control form-group" />
                <input type="text" placeholder="Product Brand" onChange={this.changeBrand} value={this.state.brand} className="form-control form-group" />

                <input type="text" placeholder="Product Rating" onChange={this.changeRating} value={this.state.rating} className="form-control form-group" />
                <input type="text" placeholder="Product Stock" onChange={this.changeStock} value={this.state.countInStock} className="form-control form-group" />
                <input type="text" placeholder="Product Category" onChange={this.changeCategory} value={this.state.category} className="form-control form-group" />





                <input type="submit" className="btn btn-danger btn-block" value='Submit' />
            </form>

        </div>
    )
}


    changeUser(event) {

    }
}
export default Admin;
