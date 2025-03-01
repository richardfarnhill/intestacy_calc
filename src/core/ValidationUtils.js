/**
 * ValidationUtils.js
 * Utility functions for input validation
 */

/**
 * Validate an estate value
 * @param {number|string} value - The estate value to validate
 * @returns {Object} - Object with isValid and errorMessage properties
 */
export function validateEstateValue(value) {
  try {
    if (value === null || value === undefined || value === '') {
      return { isValid: false, errorMessage: "Please enter your estate value" };
    }
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      return { isValid: false, errorMessage: "Please enter a valid number" };
    }
    
    if (numValue <= 0) {
      return { isValid: false, errorMessage: "Your estate value must be greater than £0" };
    }
    
    return { isValid: true, errorMessage: "" };
  } catch (error) {
    return { isValid: false, errorMessage: "Please enter a valid number" };
  }
}

/**
 * Validate a name input
 * @param {string} value - The name to validate
 * @returns {Object} - Object with isValid and errorMessage properties
 */
export function validateName(value) {
  if (!value || value.trim() === '') {
    return { isValid: false, errorMessage: "Please enter your name" };
  }
  
  if (value.trim().length < 2) {
    return { isValid: false, errorMessage: "Name must be at least 2 characters" };
  }
  
  return { isValid: true, errorMessage: "" };
}

/**
 * Format a number as currency with £ symbol
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GB', { 
    style: 'currency', 
    currency: 'GBP' 
  }).format(amount);
}

/**
 * Convert a string value to a boolean
 * @param {string} value - The value to convert (e.g., "Yes", "No")
 * @returns {boolean|null} - true for "Yes", false for "No", null for invalid values
 */
export function stringToBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'yes' || normalized === 'true' || normalized === '1') {
      return true;
    }
    if (normalized === 'no' || normalized === 'false' || normalized === '0') {
      return false;
    }
  }
  
  return null;
}

/**
 * Convert a boolean value to a string
 * @param {boolean} value - The boolean value to convert
 * @returns {string} - "Yes" for true, "No" for false
 */
export function booleanToString(value) {
  return value === true ? "Yes" : "No";
}