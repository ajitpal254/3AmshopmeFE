import React, { useEffect, useState } from "react";
import { Form, FormControl } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = ({ className, onSearch }) => {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setKeyword(params.get("keyword") || "");
    }, [location.search]);

    const submitHandler = (e) => {
        e.preventDefault();

        const trimmedKeyword = keyword.trim();

        if (trimmedKeyword) {
            navigate(`/search?keyword=${encodeURIComponent(trimmedKeyword)}`);
        } else {
            navigate("/search");
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
