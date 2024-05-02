/**
 * This formats a value as currency.
 * 
 * @param {mixed} value 
 * @returns {string}
 */
export const FormatCurrency = (value) => {
    return Number(value.toFixed(2));
};