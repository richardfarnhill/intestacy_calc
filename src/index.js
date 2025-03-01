/**
 * UK Intestacy Calculator Widget
 * Main entry point for the package
 */

import IntestacyWidget from './integration/IntestacyWidget.js';

// Export the widget class
export default IntestacyWidget;

// Also export individual components for advanced usage
export { default as IntestacyCalculator } from './core/IntestacyCalculator.js';
export { default as IntestacyUI } from './ui/IntestacyUI.js';