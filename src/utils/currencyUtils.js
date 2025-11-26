export const EXCHANGE_RATE = 1.35; // 1 USD = 1.35 CAD

export const formatPrice = (price, currency) => {
    const numericPrice = Number(price) || 0;
    if (currency === 'CAD') {
        return (numericPrice * EXCHANGE_RATE).toFixed(2);
    }
    return numericPrice.toFixed(2);
};

export const getCurrencySymbol = (currency) => {
    return currency === 'CAD' ? 'C$' : '$';
};
