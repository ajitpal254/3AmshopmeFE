import { CURRENCY_SET_CURRENCY } from '../constants/currencyConstants';

export const currencyReducer = (state = { currency: 'USD' }, action) => {
    switch (action.type) {
        case CURRENCY_SET_CURRENCY:
            return { ...state, currency: action.payload };
        default:
            return state;
    }
};
