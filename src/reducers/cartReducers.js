import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_APPLY_COUPON,
    CART_REMOVE_COUPON,
    CART_CLEAR_ITEMS,
    CART_SET_ITEMS,
} from '../constants/cartConstants'

export const cartReducer = (
    state = { cartItems: [], shippingAddress: {}, coupon: null },
    action
) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            const item = action.payload
            const existItem = state.cartItems.find((x) =>
                x.product && item.product && x.product.toString() === item.product.toString()
            )

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x.product && item.product && x.product.toString() === existItem.product.toString() ? item : x
                    ),
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                }
            }
        case CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter((x) => {
                    const productId = x.product ? x.product.toString() : null;
                    const payloadId = action.payload ? action.payload.toString() : null;
                    return productId !== payloadId;
                }),
            }
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload,
            }
        case CART_APPLY_COUPON:
            return {
                ...state,
                coupon: action.payload,
            }
        case CART_REMOVE_COUPON:
            return {
                ...state,
                coupon: null,
            }
        case CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems: [],
                coupon: null,
            }
        case CART_SET_ITEMS:
            return {
                ...state,
                cartItems: action.payload,
            }
        default:
            return state
    }
}
