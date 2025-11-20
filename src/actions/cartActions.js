import api from '../utils/api'
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_APPLY_COUPON,
    CART_REMOVE_COUPON,
    CART_CLEAR_ITEMS,
    CART_SET_ITEMS,
} from '../constants/cartConstants'

// Fetch cart from DB
export const getCart = () => async (dispatch) => {
    try {
        const { data } = await api.get('/cart')

        if (!data || !Array.isArray(data)) {
            console.error('Invalid cart data received:', data)
            return
        }

        // Map backend cart to frontend format
        const cartItems = data.map(item => ({
            product: item.product,
            name: item.name,
            image: item.image,
            price: item.price,
            countInStock: 10, // Default since backend doesn't return it
            qty: item.quantity,
            cartId: item._id // Store DB ID for deletion
        }))

        dispatch({
            type: CART_SET_ITEMS,
            payload: cartItems,
        })
    } catch (error) {
        console.error('Failed to fetch cart', error)
    }
}

export const addToCart = (id, qty) => async (dispatch, getState) => {
    console.log('ACTION: addToCart', id, qty);
    const { data } = await api.get(`/products/${id}`)

    // Check if item exists to handle DB sync
    const { cart: { cartItems } } = getState()
    const existingItem = cartItems.find(x => x.product && data._id && x.product.toString() === data._id.toString())

    let newCartId = null

    // Sync with DB if user is logged in
    const token = localStorage.getItem('token')
    if (token) {
        try {
            // If exists, delete old entry first (since backend only supports add/delete)
            if (existingItem && existingItem.cartId) {
                console.log('ACTION: Deleting existing DB item', existingItem.cartId);
                await api.delete(`/cart/${existingItem.cartId}`)
            }

            // Add new entry
            console.log('ACTION: Adding new DB item');
            const res = await api.post('/addCart', {
                id: data._id,
                name: data.name,
                image: data.image,
                price: data.price,
                quantity: qty
            })
            newCartId = res.data._id
            console.log('ACTION: New DB item created', newCartId);
        } catch (error) {
            console.error('Failed to sync add to cart', error)
        }
    }

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty,
            cartId: newCartId // Store the new DB ID
        },
    })
}

export const removeFromCart = (id) => async (dispatch, getState) => {
    console.log('ACTION: removeFromCart', id);
    // Sync with DB if user is logged in
    const { cart: { cartItems } } = getState()
    const item = cartItems.find(x => x.product && id && x.product.toString() === id.toString())

    if (item && item.cartId) {
        console.log('ACTION: Deleting DB item', item.cartId);
        try {
            await api.delete(`/cart/${item.cartId}`)
        } catch (error) {
            console.error('Failed to delete from DB', error)
        }
    } else {
        console.log('ACTION: Item not found or no cartId', item);
    }

    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    })
}

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    })
}

export const applyCoupon = (code) => async (dispatch) => {
    try {
        const { data } = await api.post('/api/discount/validate', { code })

        dispatch({
            type: CART_APPLY_COUPON,
            payload: data,
        })

        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Invalid coupon code'
        }
    }
}

export const removeCoupon = () => (dispatch) => {
    dispatch({
        type: CART_REMOVE_COUPON,
    })
}

export const clearCart = () => async (dispatch, getState) => {
    // Sync with DB - delete all items
    const { cart: { cartItems } } = getState()

    for (const item of cartItems) {
        if (item.cartId) {
            try {
                await api.delete(`/cart/${item.cartId}`)
            } catch (error) {
                console.error('Failed to clear item from DB', error)
            }
        }
    }

    dispatch({
        type: CART_CLEAR_ITEMS,
    })
}
