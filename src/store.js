import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { cartReducer } from './reducers/cartReducers'
import { currencyReducer } from './reducers/currencyReducers'

const reducer = combineReducers({
    cart: cartReducer,
    currencyState: currencyReducer,
})

const cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : []

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {}

const couponFromStorage = localStorage.getItem('coupon')
    ? JSON.parse(localStorage.getItem('coupon'))
    : null

const currencyFromStorage = localStorage.getItem('currency')
    ? localStorage.getItem('currency')
    : 'USD'

const initialState = {
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage,
        coupon: couponFromStorage,
    },
    currencyState: {
        currency: currencyFromStorage,
    }
}

const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

// Automatically save cart to localStorage whenever state changes
store.subscribe(() => {
    const state = store.getState()
    // console.log('STORE SUBSCRIBE: Saving to localStorage', state.cart.cartItems.length, 'items');
    localStorage.setItem('cartItems', JSON.stringify(state.cart.cartItems))
    localStorage.setItem('shippingAddress', JSON.stringify(state.cart.shippingAddress))
    if (state.cart.coupon) {
        localStorage.setItem('coupon', JSON.stringify(state.cart.coupon))
    } else {
        localStorage.removeItem('coupon')
    }
})

export default store

