/**
 * IntestacyWidget.js
 * Main widget for embedding the intestacy calculator
 */

import IntestacyUI from '../ui/IntestacyUI.js';

class IntestacyWidget {
  /**
   * Create a new IntestacyWidget instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    // Default options
    this.options = {
      container: '#intestacy-calculator',
      theme: 'light',
      contactInfo: 'Please contact us to discuss creating a Will.',
      contactPhone: '0123 456 7890',
      contactEmail: 'info@example.com',
      ...options
    };
    
    // Initialize the widget
    this.init();
  }
  
  /**
   * Initialize the widget
   */
  init() {
    // Ensure styles are loaded
    this.loadStyles();
    
    // Initialize UI
    this.ui = new IntestacyUI(
      this.options.container,
      {
        theme: this.options.theme,
        contactInfo: this.options.contactInfo,
        contactPhone: this.options.contactPhone,
        contactEmail: this.options.contactEmail
      }
    );
  }
  
  /**
   * Load the required styles
   */
  loadStyles() {
    // Check if styles are already loaded
    if (document.getElementById('intestacy-calculator-styles')) {
      return;
    }
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'intestacy-calculator-styles';
    style.textContent = this.getStyles();
    
    // Append to head
    document.head.appendChild(style);
  }
  
  /**
   * Get the CSS styles as a string
   * @returns {string} - CSS styles
   */
  getStyles() {
    return `
      /**
       * Intestacy Calculator Styles
       */
      
      /* Base styles */
      .intestacy-calculator {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        box-sizing: border-box;
      }
      
      .intestacy-calculator * {
        box-sizing: border-box;
      }
      
      /* Cohabiting warning styles */
      .intestacy-cohabiting-warning {
        background-color: #ffebee;
        border: 2px solid #f44336;
        color: #c62828;
        padding: 20px;
        margin: 20px 0;
        border-radius: 6px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
        }
      }
      
      /* Add a left border accent for visual emphasis */
      .intestacy-cohabiting-warning::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 6px;
        background-color: #d32f2f;
      }
      
      .intestacy-cohabiting-warning strong:first-child {
        display: block;
        font-size: 18px;
        margin-bottom: 10px;
        color: #d32f2f;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .intestacy-cohabiting-warning p {
        margin: 10px 0;
        line-height: 1.5;
        font-size: 15px;
      }
      
      .intestacy-contact-highlight {
        background-color: rgba(255, 255, 255, 0.7);
        padding: 12px;
        border-radius: 4px;
        margin-top: 12px;
        font-weight: bold;
        border-left: 3px solid #d32f2f;
      }
      
      .intestacy-contact-highlight strong {
        color: #d32f2f;
      }
      
      /* Header */
      .intestacy-header {
        margin-bottom: 30px;
        text-align: center;
      }
      
      .intestacy-header h1 {
        font-size: 28px;
        margin: 0 0 10px 0;
        color: #333;
      }
      
      .intestacy-header p {
        font-size: 16px;
        margin: 0;
        color: #666;
      }
      
      /* Content sections */
      .intestacy-content {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .intestacy-section {
        margin-bottom: 20px;
      }
      
      /* Form elements */
      .intestacy-calculator label {
        display: block;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #333;
      }
      
      .intestacy-calculator input[type="text"],
      .intestacy-calculator input[type="number"] {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-bottom: 5px;
      }
      
      .intestacy-calculator input[type="text"]:focus,
      .intestacy-calculator input[type="number"]:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }
      
      /* Radio buttons */
      .intestacy-radio-group {
        margin-top: 10px;
      }
      
      .intestacy-radio-group label {
        display: block;
        font-weight: normal;
        margin-bottom: 10px;
        cursor: pointer;
      }
      
      .intestacy-radio-group input[type="radio"] {
        margin-right: 8px;
      }
      
      /* Error messages */
      .intestacy-error {
        color: #dc3545;
        font-size: 14px;
        margin-top: 5px;
        min-height: 20px;
      }
      
      /* Question section */
      .intestacy-question {
        font-size: 18px;
        margin-bottom: 15px;
        color: #333;
      }
      
      /* Result section */
      .intestacy-result {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        margin-bottom: 20px;
        border-left: 4px solid #007bff;
      }
      
      .intestacy-result h2 {
        font-size: 22px;
        margin-top: 0;
        margin-bottom: 15px;
        color: #333;
      }
      
      .intestacy-result p {
        margin-bottom: 15px;
        line-height: 1.5;
      }
      
      .intestacy-next-steps {
        margin-top: 20px;
      }
      
      .intestacy-next-steps h2 {
        font-size: 20px;
        margin-top: 0;
        margin-bottom: 10px;
        color: #333;
      }
      
      /* Buttons */
      .intestacy-buttons {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      
      .intestacy-calculator button {
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      #intestacy-continue {
        background-color: #007bff;
        color: white;
      }
      
      #intestacy-continue:hover {
        background-color: #0069d9;
      }
      
      #intestacy-restart {
        background-color: #6c757d;
        color: white;
      }
      
      #intestacy-restart:hover {
        background-color: #5a6268;
      }
      
      /* Footer */
      .intestacy-footer {
        font-size: 14px;
        color: #666;
        text-align: center;
        margin-top: 30px;
        padding-top: 15px;
        border-top: 1px solid #eee;
      }
      
      /* Light theme (default) */
      .intestacy-theme-light {
        /* Default styles are already light theme */
      }
      
      /* Dark theme */
      .intestacy-theme-dark {
        background-color: #333;
        color: #f5f5f5;
      }
      
      .intestacy-theme-dark .intestacy-header h1 {
        color: #f5f5f5;
      }
      
      .intestacy-theme-dark .intestacy-header p {
        color: #ccc;
      }
      
      .intestacy-theme-dark .intestacy-content {
        background-color: #444;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }
      
      .intestacy-theme-dark .intestacy-calculator label {
        color: #f5f5f5;
      }
      
      .intestacy-theme-dark .intestacy-calculator input[type="text"],
      .intestacy-theme-dark .intestacy-calculator input[type="number"] {
        background-color: #555;
        border-color: #666;
        color: #f5f5f5;
      }
      
      .intestacy-theme-dark .intestacy-question {
        color: #f5f5f5;
      }
      
      .intestacy-theme-dark .intestacy-result {
        background-color: #555;
        border-left-color: #0d6efd;
      }
      
      .intestacy-theme-dark .intestacy-result h2 {
        color: #f5f5f5;
      }
      
      .intestacy-theme-dark .intestacy-next-steps h2 {
        color: #f5f5f5;
      }
      
      .intestacy-theme-dark .intestacy-footer {
        color: #ccc;
        border-top-color: #555;
      }
      
      /* Dark theme adjustments for cohabiting warning */
      .intestacy-theme-dark .intestacy-cohabiting-warning {
        background-color: rgba(244, 67, 54, 0.15);
        border-color: #f44336;
        color: #ff8a80;
      }
      
      .intestacy-theme-dark .intestacy-contact-highlight {
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
      }
      
      /* Responsive styles */
      @media (max-width: 768px) {
        .intestacy-calculator {
          padding: 15px;
        }
        
        .intestacy-header h1 {
          font-size: 24px;
        }
        
        .intestacy-content {
          padding: 15px;
        }
        
        .intestacy-buttons {
          flex-direction: column;
          gap: 10px;
        }
        
        .intestacy-calculator button {
          width: 100%;
        }
      }
      
      @media (max-width: 480px) {
        .intestacy-header h1 {
          font-size: 22px;
        }
        
        .intestacy-question {
          font-size: 16px;
        }
        
        .intestacy-result h2 {
          font-size: 20px;
        }
      }
    `;
  }
  
  /**
   * Reset the calculator to its initial state
   */
  reset() {
    if (this.ui) {
      this.ui.handleRestart();
    }
  }
  
  /**
   * Update widget options
   * @param {Object} options - New options to apply
   */
  updateOptions(options = {}) {
    this.options = {
      ...this.options,
      ...options
    };
    
    // Reinitialize with new options
    this.init();
  }
}

// Make available globally when included via script tag
if (typeof window !== 'undefined') {
  window.IntestacyWidget = IntestacyWidget;
}

export default IntestacyWidget;