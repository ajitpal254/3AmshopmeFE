import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch cart from backend on mount
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const { data } = await api.get("/cart");
                // Transform backend cart format to frontend format
                const formattedItems = data.map((item) => ({
                    product: item._id,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    qty: item.quantity || 1,
                    countInStock: 999, // Backend doesn't store this, default high value
                    backendId: item._id, // Store backend ID for deletion
                }));
                setCartItems(formattedItems);
            } catch (error) {
                console.error("Error fetching cart:", error);
                // Fallback to localStorage if backend fails
                const storedCart = localStorage.getItem("cartItems");
                if (storedCart) {
                    setCartItems(JSON.parse(storedCart));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    // Sync to localStorage whenever cart changes
    useEffect(() => {
        if (!loading) {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems, loading]);

    const addToCart = useCallback(async (id, qty) => {
        try {
            const { data } = await api.get(`/products/${id}`);

            // Add to backend
            await api.post("/addCart", {
                id: data._id,
                name: data.name,
                image: data.image,
                price: data.price,
                quantity: Number(qty),
            });

            // Refresh cart from backend
            const { data: cartData } = await api.get("/cart");
            const formattedItems = cartData.map((item) => ({
                product: item._id,
                name: item.name,
                image: item.image,
                price: item.price,
                qty: item.quantity || 1,
                countInStock: data.countInStock || 999,
                backendId: item._id,
            }));
            setCartItems(formattedItems);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }, []);

    const removeFromCart = useCallback(async (backendId) => {
        try {
            await api.delete(`/cart/${backendId}`);
            setCartItems((prevItems) => prevItems.filter((x) => x.backendId !== backendId));
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
        localStorage.removeItem("cartItems");
    }, []);

    const createOrder = useCallback(async () => {
        try {
            const { data } = await api.post("/orders");
            // Cart is cleared on backend, now clear frontend
            setCartItems([]);
            localStorage.removeItem("cartItems");
            return data; // Return created order
        } catch (error) {
            console.error("Error creating order:", error);
            throw error; // Propagate error to caller
        }
    }, []);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        createOrder,
        loading,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
