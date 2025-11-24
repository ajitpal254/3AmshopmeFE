import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrency } from '../actions/currencyActions';
import './CurrencySwitcher.css'; // Import custom CSS

const CurrencySwitcher = () => {
    const dispatch = useDispatch();
    const currencyState = useSelector((state) => state.currencyState);
    const { currency } = currencyState;

    const toggleCurrency = () => {
        const newCurrency = currency === 'USD' ? 'CAD' : 'USD';
        dispatch(setCurrency(newCurrency));
    };

    return (
        <div className="currency-toggle-container">
            <label className="switch">
                <input
                    type="checkbox"
                    checked={currency === 'CAD'}
                    onChange={toggleCurrency}
                />
                <span className="slider round"></span>
            </label>
        </div>
    );
};

export default CurrencySwitcher;
