export const EXCHANGE_RATE = 1.35; // 1 USD = 1.35 CAD

export const formatPrice = (price, currency) => {
    if (currency === 'CAD') {
        return (price * EXCHANGE_RATE).toFixed(2);
    }
    return price.toFixed(2);
};

export const getCurrencySymbol = (currency) => {
    return currency === 'CAD' ? 'C$' : '$';
};
