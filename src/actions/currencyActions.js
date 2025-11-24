import { CURRENCY_SET_CURRENCY } from '../constants/currencyConstants';

export const setCurrency = (currency) => (dispatch) => {
    dispatch({
        type: CURRENCY_SET_CURRENCY,
        payload: currency,
    });
    localStorage.setItem('currency', currency);
};
