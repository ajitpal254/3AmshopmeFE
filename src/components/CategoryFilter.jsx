import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import api from '../utils/api';
import './CategoryFilter.css';

const CategoryFilter = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(['All', ...data]);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        onSelectCategory(category);
    };

    return (
        <div className="category-filter-container">
            <h5 className="category-filter-title">Shop by Category</h5>
            <div className="category-chips">
                {categories.map((category) => (
                    <Badge
                        key={category}
                        pill
                        bg={selectedCategory === category ? 'primary' : 'light'}
                        text={selectedCategory === category ? 'white' : 'dark'}
                        className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </Badge>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
