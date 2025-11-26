import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ className, onSearch }) => {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search?keyword=${keyword}`);
        } else {
            navigate("/");
        }
        if (onSearch) {
            onSearch();
        }
    };

    return (
        <Form onSubmit={submitHandler} className={`search-form ${className || ""}`}>
            <FormControl
                type="text"
                placeholder="Search for products..."
                className="search-input"
                onChange={(e) => setKeyword(e.target.value)}
                value={keyword}
            />
            <button type="submit" className="search-btn">
                <i className="fas fa-search"></i>
            </button>
        </Form>
    );
};

export default SearchBar;
