import React, { Component } from "react";
import axios from "axios";
import { storage } from "../firebaseconfig"; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

class Admin extends Component {
  constructor() {
    super();

    this.state = {
      image: null,
      name: "",
      price: "",
      description: "",
      brand: "",
      numReviews: "",
      rating: "",
      countInStock: "",
      category: "",
      user: "",
    };

    this.changeName = this.changeName.bind(this);
    this.changePrice = this.changePrice.bind(this);
    this.changeDescription = this.changeDescription.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.changeStock = this.changeStock.bind(this);
    this.changeBrand = this.changeBrand.bind(this);
    this.changeCategory = this.changeCategory.bind(this);

    this.filSelectedHandler = this.filSelectedHandler.bind(this);
  }

  changePrice(event) {
    this.setState({
      price: event.target.value,
    });
  }

  changeDescription(event) {
    this.setState({
      description: event.target.value,
    });
  }

  changeBrand(event) {
    this.setState({
      brand: event.target.value,
    });
  }

  changeRating(event) {
    this.setState({
      rating: event.target.value,
    });
  }

  changeStock(event) {
    this.setState({
      countInStock: event.target.value,
    });
  }

  changeName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  changeCategory(event) {
    this.setState({
      category: event.target.value,
    });
  }

  // File selected handler: Upload image to Firebase
  filSelectedHandler = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor the upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can monitor upload progress here (optional)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          // Get the download URL when the upload is complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            this.setState({ image: downloadURL });
          });
        }
      );
    }
  };

  // Form submission: Upload product details and image URL to backend
fileUploadHandler = (event) => {
  event.preventDefault();

  const uploadData = {
    name: this.state.name,
    price: this.state.price,
    description: this.state.description,
    brand: this.state.brand,
    rating: this.state.rating,
    countInStock: this.state.countInStock,
    image: this.state.image,
    category: this.state.category,
  };

  const env = process.env.NODE_ENV;
  axios
    .post(
      `${
        env === "production"
          ? process.env.REACT_APP_API_URL_PROD
          : process.env.REACT_APP_API_URL
      }/admin/upload`,
      uploadData
    )
    .then((res) => {
      console.log("Upload successful:", res.data);
      window.location.href = "/"; // Redirect to homepage
    })
    .catch((e) => {
      console.error("Upload failed:", e);
      alert("Failed to submit product. Please try again."); // Popup on error
    });
};

  render() {
    return (
      <div>
        <form onSubmit={this.fileUploadHandler}>
          <input type="file" onChange={this.filSelectedHandler} />
          <input
            type="text"
            placeholder="Product Name"
            onChange={this.changeName}
            value={this.state.name}
            className="form-control form-group"
          />
          <input
            type="text"
            placeholder="Product Price"
            onChange={this.changePrice}
            value={this.state.price}
            className="form-control form-group"
          />
          <input
            type="text"
            placeholder="Product Description"
            onChange={this.changeDescription}
            value={this.state.description}
            className="form-control form-group"
          />
          <input
            type="text"
            placeholder="Product Brand"
            onChange={this.changeBrand}
            value={this.state.brand}
            className="form-control form-group"
          />
          <input
            type="text"
            placeholder="Product Rating"
            onChange={this.changeRating}
            value={this.state.rating}
            className="form-control form-group"
          />
          <input
            type="text"
            placeholder="Product Stock"
            onChange={this.changeStock}
            value={this.state.countInStock}
            className="form-control form-group"
          />
          <input
            type="text"
            placeholder="Product Category"
            onChange={this.changeCategory}
            value={this.state.category}
            className="form-control form-group"
          />
          <input
            type="submit"
            className="btn btn-danger btn-block"
            value="Submit"
          />
        </form>
      </div>
    );
  }
}

export default Admin;
