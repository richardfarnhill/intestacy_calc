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
      contactPhone: '0161 348 7581',
      contactEmail: 'hello@WillSolicitor.co.uk',
      contactWebsite: 'https://www.willsolicitor.co.uk',
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
      this.getContainer(),
      {
        theme: this.options.theme,
        contactInfo: this.options.contactInfo,
        contactPhone: this.options.contactPhone,
        contactEmail: this.options.contactEmail,
        contactWebsite: this.options.contactWebsite
      }
    );
  }
  
  /**
   * Get the container element
   * @returns {HTMLElement} Container element
   */
  getContainer() {
    if (typeof this.options.container === 'string') {
      return document.querySelector(this.options.container);
    }
    return this.options.container;
  }
  
  /**
   * Load the required CSS styles
   */
  loadStyles() {
    if (!document.getElementById('intestacy-calculator-styles')) {
      const styles = this.options.theme === 'none'
        ? this.getMinimalStyles()
        : this.getStyles();
      const styleElement = document.createElement('style');
      styleElement.id = 'intestacy-calculator-styles';
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }
  }
  
  /**
   * Get minimal structural CSS for theme: 'none' mode.
   * Only includes layout and accessibility rules needed for the widget to function.
   * Host page provides all visual styling.
   * @returns {string} - Minimal CSS styles
   */
  getMinimalStyles() {
    return `
      /* Accessibility: Visually Hidden */
      .intestacy-visuallyhidden {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
        white-space: nowrap;
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }

      .intestacy-question-fieldset {
        display: none !important;
      }

      /* Error hidden by default */
      .intestacy-error {
        display: none;
      }

      /* Structural flexbox layouts */
      .intestacy-question-buttons {
        display: flex;
        gap: 15px;
      }

      .intestacy-buttons {
        display: flex;
        gap: 30px;
      }

      .intestacy-estate-badge {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
      }

      .intestacy-beneficiary-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .intestacy-beneficiary-share {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      /* List resets */
      .intestacy-distribution-list,
      .intestacy-advice-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      /* Responsive stacking */
      @media (max-width: 768px) {
        .intestacy-buttons {
          flex-direction: column;
        }

        .intestacy-beneficiary-details {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      /* Respect reduced motion preferences */
      @media (prefers-reduced-motion: reduce) {
        .intestacy-calculator * {
          transition: none !important;
          animation: none !important;
        }
      }
    `;
  }

  /**
   * Get the CSS styles as a string
   * @returns {string} - CSS styles
   */
  getStyles() {
    return `
      /**
       * Intestacy Calculator Styles
       * GitHub Primer Light Theme
       * @primer/primitives light color tokens
       */

      /* ========================================
         BASE STYLES & DESIGN TOKENS (LIGHT)
         ======================================== */
      .intestacy-calculator {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 24px;
        box-sizing: border-box;
        background-color: #ffffff;
        color: #1f2328;
        border-radius: 12px;
        --primer-bgColor-default: #ffffff;
        --primer-bgColor-muted: #f6f8fa;
        --primer-bgColor-inset: #f6f8fa;
        --primer-bgColor-emphasis: #25292e;
        --primer-fgColor-default: #1f2328;
        --primer-fgColor-muted: #59636e;
        --primer-fgColor-accent: #0969da;
        --primer-borderColor-default: #d1d9e0;
        --primer-borderColor-muted: rgba(209, 217, 224, 0.7);
        --primer-btn-green: #1f883d;
        --primer-btn-green-hover: #1a7f37;
        --primer-btn-red: #cf222e;
        --primer-btn-red-hover: #a40e26;
        --primer-btn-secondary-bg: #f6f8fa;
        --primer-btn-secondary-border: #d1d9e0;
        --primer-btn-secondary-text: #25292e;
        --primer-btn-secondary-hover: #eaeef2;
        --primer-focus: #0969da;
        --primer-input-bg: #ffffff;
        --primer-input-border: #d1d9e0;
        --primer-input-text: #1f2328;
        --section-transition: all 0.3s ease-in-out;
      }

      .intestacy-calculator * {
        box-sizing: border-box;
        transition: var(--section-transition);
      }

      /* ========================================
         ACCESSIBILITY: FOCUS STYLES
         ======================================== */
      .intestacy-calculator a:focus,
      .intestacy-calculator button:focus,
      .intestacy-calculator input:focus,
      .intestacy-calculator select:focus,
      .intestacy-calculator textarea:focus,
      .intestacy-calculator [tabindex]:focus {
        outline: 2px solid #0969da;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
        transition: outline 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
      }

      /* ========================================
         ACCESSIBILITY: VISUALLY HIDDEN
         ======================================== */
      .intestacy-visuallyhidden {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        border: 0;
        white-space: nowrap;
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      /* ========================================
         HEADER
         ======================================== */
      .intestacy-header {
        text-align: center;
        margin-bottom: 32px;
        padding-bottom: 20px;
        border-bottom: 1px solid #d1d9e0;
      }

      .intestacy-header h1 {
        font-size: 28px;
        margin-top: 0;
        margin-bottom: 10px;
        color: #1f2328;
        font-weight: 600;
        letter-spacing: -0.5px;
      }

      .intestacy-header p {
        font-size: 16px;
        color: #59636e;
        margin-top: 0;
        margin-bottom: 0;
        line-height: 1.5;
      }

      /* ========================================
         CONTENT CARD
         ======================================== */
      .intestacy-content {
        border-radius: 12px;
        background-color: #f6f8fa;
        padding: 28px;
        border: 1px solid #d1d9e0;
        box-shadow: 0 1px 3px rgba(31, 35, 40, 0.04);
        margin-bottom: 24px;
      }

      /* ========================================
         SECTIONS
         ======================================== */
      .intestacy-section {
        margin-bottom: 24px;
        opacity: 1;
        transform: translateY(0);
        transition: var(--section-transition);
      }

      /* ========================================
         LABELS
         ======================================== */
      .intestacy-calculator label {
        display: block;
        margin-bottom: 8px;
        font-weight: 600;
        color: #1f2328;
        font-size: 14px;
      }

      /* ========================================
         INPUTS
         ======================================== */
      .intestacy-calculator input[type="text"],
      .intestacy-calculator input[type="number"],
      .intestacy-calculator input[type="email"] {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d1d9e0;
        border-radius: 6px;
        margin-bottom: 16px;
        font-size: 14px;
        background-color: #ffffff;
        color: #1f2328;
        font-family: inherit;
        line-height: 1.5;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .intestacy-calculator input[type="text"]:focus,
      .intestacy-calculator input[type="number"]:focus,
      .intestacy-calculator input[type="email"]:focus {
        border-color: #0969da;
        background-color: #ffffff;
      }

      .intestacy-calculator input[type="text"]::placeholder,
      .intestacy-calculator input[type="number"]::placeholder,
      .intestacy-calculator input[type="email"]::placeholder {
        color: #59636e;
      }

      /* ========================================
         RADIO GROUP
         ======================================== */
      .intestacy-radio-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin: 20px 0;
      }

      .intestacy-radio-group label {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border: 1px solid #d1d9e0;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin: 0;
        background-color: #ffffff;
        color: #1f2328;
        font-size: 14px;
      }

      .intestacy-radio-group label:hover {
        background-color: #f6f8fa;
        border-color: #bbc0c7;
      }

      .intestacy-radio-group input[type="radio"] {
        margin-right: 12px;
        cursor: pointer;
        accent-color: #0969da;
        width: 16px;
        height: 16px;
      }

      /* ========================================
         ERROR STATES
         ======================================== */
      .intestacy-error {
        color: #d1242f;
        font-size: 13px;
        padding: 10px 12px;
        display: none;
        margin-bottom: 16px;
        border-left: 3px solid #cf222e;
        padding-left: 12px;
        background-color: rgba(207, 34, 46, 0.05);
        border-radius: 0 6px 6px 0;
      }

      .intestacy-error[style*="display: block"] {
        display: block;
      }

      .intestacy-error::before {
        content: "\\26A0  ";
      }

      /* ========================================
         STATUS OPTIONS
         ======================================== */
      .intestacy-status-option {
        display: block;
        margin-bottom: 12px;
        padding: 12px 12px 12px 42px;
        border: 1px solid #d1d9e0;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s ease, border-color 0.2s ease;
        position: relative;
        background-color: #ffffff;
        color: #1f2328;
      }

      .intestacy-status-option:hover {
        background-color: #f6f8fa;
        border-color: #bbc0c7;
      }

      .intestacy-status-input {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
      }

      .intestacy-status-input:checked + .intestacy-status-option {
        background-color: rgba(9, 105, 218, 0.06);
        border-color: #0969da;
      }

      /* ========================================
         COHABITING WARNING
         ======================================== */
      .intestacy-cohabiting-warning {
        background-color: #fff8c5;
        color: #6f5300;
        padding: 12px 16px;
        margin-bottom: 20px;
        border-radius: 6px;
        border-left: 4px solid #d4a72c;
        font-weight: 500;
        font-size: 14px;
      }

      /* ========================================
         BUTTONS: BASE (all buttons in calculator)
         ======================================== */
      .intestacy-calculator button {
        padding: 10px 20px;
        border: 1px solid #d1d9e0;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        font-weight: 600;
        font-family: inherit;
        transition: background-color 0.2s ease, border-color 0.2s ease;
        min-width: 140px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 5px;
        background-color: #f6f8fa;
        color: #25292e;
        line-height: 1.5;
      }

      .intestacy-calculator button:hover {
        background-color: #eaeef2;
        border-color: #bbc0c7;
      }

      .intestacy-calculator button:active {
        background-color: #dce1e6;
      }

      /* ========================================
         BUTTONS: PRIMARY (CONTINUE / .intestacy-button)
         ======================================== */
      .intestacy-button {
        background-color: #1f883d;
        color: #ffffff;
        border: 1px solid rgba(31, 35, 40, 0.15);
        border-radius: 6px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
        margin-right: 10px;
        margin-top: 15px;
        position: relative;
        overflow: hidden;
      }

      .intestacy-button:hover {
        background-color: #1a7f37;
      }

      .intestacy-button:active {
        background-color: #187733;
        transform: translateY(1px);
      }

      #intestacy-continue {
        background-color: #1f883d;
        color: #ffffff;
        border-color: rgba(31, 35, 40, 0.15);
      }

      #intestacy-continue:hover {
        background-color: #1a7f37;
        border-color: rgba(31, 35, 40, 0.15);
      }

      /* ========================================
         BUTTONS: YES / NO
         ======================================== */
      .intestacy-yes-button,
      .intestacy-no-button {
        min-width: 100px;
        text-align: center;
      }

      .intestacy-yes-button {
        background-color: #1f883d;
        color: #ffffff;
        border-color: rgba(31, 35, 40, 0.15);
      }

      .intestacy-yes-button:hover {
        background-color: #1a7f37;
      }

      .intestacy-yes-button:active {
        background-color: #187733;
      }

      .intestacy-no-button {
        background-color: #cf222e;
        color: #ffffff;
        border-color: rgba(31, 35, 40, 0.15);
      }

      .intestacy-no-button:hover {
        background-color: #a40e26;
      }

      .intestacy-no-button:active {
        background-color: #930c21;
      }

      /* ========================================
         BUTTONS: RESTART
         ======================================== */
      #intestacy-restart {
        background-color: #f6f8fa;
        color: #25292e;
        border-color: #d1d9e0;
      }

      #intestacy-restart:hover {
        background-color: #eaeef2;
        border-color: #bbc0c7;
      }

      .intestacy-restart-button {
        background-color: #f6f8fa !important;
        border-color: #d1d9e0 !important;
        color: #25292e !important;
        display: block;
        margin: 20px auto 0 !important;
      }

      .intestacy-restart-button:hover {
        background-color: #eaeef2 !important;
        border-color: #bbc0c7 !important;
      }

      /* ========================================
         BUTTON CONTAINERS
         ======================================== */
      .intestacy-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        gap: 30px;
      }

      .intestacy-question-buttons {
        display: flex;
        gap: 12px;
        margin-top: 20px;
      }

      /* ========================================
         FOOTER
         ======================================== */
      .intestacy-footer {
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #d1d9e0;
        font-size: 13px;
        color: #59636e;
        line-height: 1.5;
      }

      .intestacy-disclaimer {
        margin-bottom: 15px;
      }

      .intestacy-contact-info {
        margin-top: 15px;
      }

      .intestacy-contact-phone,
      .intestacy-contact-email {
        display: inline-block;
        margin-top: 5px;
        color: #0969da;
        text-decoration: none;
        transition: color 0.2s ease;
      }

      .intestacy-contact-phone:hover,
      .intestacy-contact-email:hover {
        color: #0550ae;
        text-decoration: underline;
      }

      /* ========================================
         QUESTION STYLES
         ======================================== */
      .intestacy-question {
        display: none;
        margin-bottom: 20px;
        padding: 16px;
        border-left: 4px solid #0969da;
        background-color: #f6f8fa;
        border-radius: 0 6px 6px 0;
      }

      .intestacy-question-text {
        margin-bottom: 15px;
        color: #1f2328;
        font-size: 14px;
        line-height: 1.5;
      }

      .intestacy-question-section fieldset {
        border: none;
        margin: 0;
        padding: 0;
      }

      .intestacy-question-section legend {
        padding: 0;
      }

      .intestacy-question-section input,
      .intestacy-question-options {
        display: none !important;
      }

      .intestacy-question-fieldset {
        display: none !important;
      }

      /* ========================================
         FORM SECTION HEADINGS
         ======================================== */
      .intestacy-section h2 {
        margin-bottom: 20px;
        color: #1f2328;
        font-weight: 600;
        font-size: 20px;
      }

      .intestacy-section .intestacy-label {
        margin-bottom: 8px;
      }

      /* ========================================
         RESULT HEADER
         ======================================== */
      .intestacy-result-header {
        text-align: center;
        margin-bottom: 10px;
      }

      .intestacy-result-header h2 {
        margin-bottom: 15px;
        color: #1f2328;
        font-weight: 600;
      }

      /* ========================================
         ESTATE BADGE (INVERTED / EMPHASIS)
         ======================================== */
      .intestacy-estate-badge {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        background-color: #25292e;
        color: #ffffff;
        padding: 14px 32px;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(31, 35, 40, 0.12);
      }

      .intestacy-estate-badge-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        opacity: 0.85;
        font-weight: 500;
      }

      .intestacy-estate-badge-value {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }

      /* ========================================
         DIVIDER
         ======================================== */
      .intestacy-divider {
        border: none;
        border-top: 1px solid #d1d9e0;
        margin: 24px 0;
      }

      /* ========================================
         ADVICE SECTION
         ======================================== */
      .intestacy-advice-section {
        background-color: #f6f8fa;
        border: 1px solid #d1d9e0;
        border-radius: 6px;
        padding: 20px;
      }

      .intestacy-advice-text {
        margin: 0 0 10px 0;
        line-height: 1.6;
        color: #1f2328;
        font-size: 14px;
      }

      .intestacy-advice-text:last-child {
        margin-bottom: 0;
      }

      .intestacy-advice-list {
        list-style: none;
        padding: 0;
        margin: 10px 0;
      }

      .intestacy-advice-list li {
        position: relative;
        padding: 6px 0 6px 20px;
        line-height: 1.5;
        color: #1f2328;
        font-size: 14px;
      }

      .intestacy-advice-list li::before {
        content: "\\2022";
        color: #0969da;
        font-weight: bold;
        position: absolute;
        left: 0;
      }

      .intestacy-advice-subitem {
        margin-left: 20px;
        font-size: 0.95em;
      }

      .intestacy-advice-subitem::before {
        content: "\\2013" !important;
        color: #59636e !important;
      }

      /* ========================================
         BENEFICIARY BREAKDOWN
         ======================================== */
      .intestacy-breakdown-heading {
        font-size: 14px;
        font-weight: 600;
        color: #1f2328;
        margin: 0 0 10px 0;
      }

      .intestacy-distribution-list {
        list-style: none;
        padding: 0;
        margin: 20px 0;
        border: 1px solid #d1d9e0;
        border-radius: 6px;
        overflow: hidden;
      }

      .intestacy-beneficiary {
        padding: 12px 16px;
        border-bottom: 1px solid #d1d9e0;
        background-color: #ffffff;
      }

      .intestacy-beneficiary:last-child {
        border-bottom: none;
      }

      .intestacy-beneficiary:hover {
        background-color: #f6f8fa;
      }

      .intestacy-beneficiary-details {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .intestacy-beneficiary-color {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 10px;
        flex-shrink: 0;
      }

      .intestacy-beneficiary-name {
        font-weight: 600;
        color: #1f2328;
        font-size: 14px;
      }

      .intestacy-beneficiary-share {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .intestacy-beneficiary-amount {
        font-weight: 600;
        color: #0969da;
        font-size: 14px;
      }

      .intestacy-beneficiary-percentage {
        color: #59636e;
        font-size: 13px;
      }

      /* ========================================
         CTA SECTION
         ======================================== */
      .intestacy-cta-section {
        background-color: #dafbe1;
        border: 1px solid #82e596;
        border-radius: 6px;
        padding: 16px 20px;
        margin-top: 20px;
        text-align: center;
      }

      .intestacy-cta-text {
        margin: 0;
        color: #116329;
        line-height: 1.5;
        font-size: 14px;
      }

      .intestacy-cta-link {
        color: #0969da;
        text-decoration: underline;
        font-weight: 600;
      }

      .intestacy-cta-link:hover {
        color: #0550ae;
      }

      .intestacy-contact-website {
        display: inline-block;
        margin-top: 5px;
        color: #0969da;
        text-decoration: none;
        transition: color 0.2s ease;
      }

      .intestacy-contact-website:hover {
        color: #0550ae;
        text-decoration: underline;
      }

      /* ========================================
         SCREEN READER ONLY
         ======================================== */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }

      /* ========================================
         DARK THEME OVERRIDES
         Primer Dark theme (@primer/primitives)
         ======================================== */
      .intestacy-theme-dark {
        background-color: #0d1117;
        color: #f0f6fc;
        --primer-bgColor-default: #0d1117;
        --primer-bgColor-muted: #161b22;
        --primer-bgColor-inset: #010409;
        --primer-bgColor-emphasis: #f0f6fc;
        --primer-fgColor-default: #f0f6fc;
        --primer-fgColor-muted: #8b949e;
        --primer-fgColor-accent: #58a6ff;
        --primer-borderColor-default: #30363d;
        --primer-borderColor-muted: rgba(48, 54, 61, 0.7);
        --primer-btn-green: #238636;
        --primer-btn-green-hover: #2ea043;
        --primer-btn-red: #da3633;
        --primer-btn-red-hover: #f85149;
        --primer-btn-secondary-bg: #21262d;
        --primer-btn-secondary-border: #30363d;
        --primer-btn-secondary-text: #c9d1d9;
        --primer-btn-secondary-hover: #292e36;
        --primer-focus: #58a6ff;
        --primer-input-bg: #0d1117;
        --primer-input-border: #30363d;
        --primer-input-text: #c9d1d9;
      }

      .intestacy-theme-dark .intestacy-header {
        border-bottom-color: #30363d;
      }

      .intestacy-theme-dark .intestacy-header h1 {
        color: #f0f6fc;
      }

      .intestacy-theme-dark .intestacy-header p {
        color: #8b949e;
      }

      .intestacy-theme-dark .intestacy-content {
        background-color: #161b22;
        border-color: #30363d;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.5);
      }

      .intestacy-theme-dark .intestacy-calculator label {
        color: #f0f6fc;
      }

      .intestacy-theme-dark .intestacy-calculator input[type="text"],
      .intestacy-theme-dark .intestacy-calculator input[type="number"],
      .intestacy-theme-dark .intestacy-calculator input[type="email"] {
        background-color: #0d1117;
        border-color: #30363d;
        color: #c9d1d9;
      }

      .intestacy-theme-dark .intestacy-calculator input[type="text"]::placeholder,
      .intestacy-theme-dark .intestacy-calculator input[type="number"]::placeholder,
      .intestacy-theme-dark .intestacy-calculator input[type="email"]::placeholder {
        color: #8b949e;
      }

      .intestacy-theme-dark .intestacy-calculator input[type="text"]:focus,
      .intestacy-theme-dark .intestacy-calculator input[type="number"]:focus,
      .intestacy-theme-dark .intestacy-calculator input[type="email"]:focus {
        border-color: #58a6ff;
        background-color: #0d1117;
      }

      .intestacy-theme-dark .intestacy-question {
        background-color: #21262d;
        border-left-color: #58a6ff;
      }

      .intestacy-theme-dark .intestacy-question-text {
        color: #f0f6fc;
      }

      .intestacy-theme-dark .intestacy-radio-group label {
        border-color: #30363d;
        background-color: #21262d;
        color: #f0f6fc;
      }

      .intestacy-theme-dark .intestacy-radio-group label:hover {
        background-color: #292e36;
        border-color: #484f58;
      }

      .intestacy-theme-dark .intestacy-radio-group input[type="radio"] {
        accent-color: #58a6ff;
      }

      .intestacy-theme-dark .intestacy-status-option {
        background-color: #21262d;
        border-color: #30363d;
        color: #f0f6fc;
      }

      .intestacy-theme-dark .intestacy-status-option:hover {
        background-color: #292e36;
        border-color: #484f58;
      }

      .intestacy-theme-dark .intestacy-status-input:checked + .intestacy-status-option {
        background-color: rgba(88, 166, 255, 0.1);
        border-color: #58a6ff;
      }

      .intestacy-theme-dark .intestacy-error {
        color: #f85149;
        border-left-color: #da3633;
        background-color: rgba(218, 54, 51, 0.1);
      }

      .intestacy-theme-dark .intestacy-cohabiting-warning {
        background-color: rgba(210, 153, 34, 0.15);
        color: #d29922;
        border-left-color: #d29922;
      }

      .intestacy-theme-dark .intestacy-calculator button {
        background-color: #21262d;
        color: #c9d1d9;
        border-color: #30363d;
      }

      .intestacy-theme-dark .intestacy-calculator button:hover {
        background-color: #292e36;
        border-color: #484f58;
      }

      .intestacy-theme-dark .intestacy-button,
      .intestacy-theme-dark #intestacy-continue {
        background-color: #238636;
        color: #ffffff;
        border-color: rgba(240, 246, 252, 0.1);
      }

      .intestacy-theme-dark .intestacy-button:hover,
      .intestacy-theme-dark #intestacy-continue:hover {
        background-color: #2ea043;
      }

      .intestacy-theme-dark .intestacy-yes-button {
        background-color: #238636;
        color: #ffffff;
        border-color: rgba(240, 246, 252, 0.1);
      }

      .intestacy-theme-dark .intestacy-yes-button:hover {
        background-color: #2ea043;
      }

      .intestacy-theme-dark .intestacy-no-button {
        background-color: #da3633;
        color: #ffffff;
        border-color: rgba(240, 246, 252, 0.1);
      }

      .intestacy-theme-dark .intestacy-no-button:hover {
        background-color: #f85149;
      }

      .intestacy-theme-dark #intestacy-restart,
      .intestacy-theme-dark .intestacy-restart-button {
        background-color: #21262d !important;
        color: #c9d1d9 !important;
        border-color: #30363d !important;
      }

      .intestacy-theme-dark #intestacy-restart:hover,
      .intestacy-theme-dark .intestacy-restart-button:hover {
        background-color: #292e36 !important;
        border-color: #484f58 !important;
      }

      .intestacy-theme-dark .intestacy-section h2 {
        color: #f0f6fc;
      }

      .intestacy-theme-dark .intestacy-result-header h2 {
        color: #f0f6fc;
      }

      .intestacy-theme-dark .intestacy-estate-badge {
        background-color: #f0f6fc;
        color: #0d1117;
        box-shadow: 0 4px 14px rgba(88, 166, 255, 0.25);
      }

      .intestacy-theme-dark .intestacy-divider {
        border-top-color: #30363d;
      }

      .intestacy-theme-dark .intestacy-beneficiary {
        background-color: #161b22;
        border-bottom-color: #30363d;
      }

      .intestacy-theme-dark .intestacy-beneficiary:hover {
        background-color: #21262d;
      }

      .intestacy-theme-dark .intestacy-beneficiary-name {
        color: #f0f6fc;
      }

      .intestacy-theme-dark .intestacy-beneficiary-amount {
        color: #58a6ff;
      }

      .intestacy-theme-dark .intestacy-beneficiary-percentage {
        color: #8b949e;
      }

      .intestacy-theme-dark .intestacy-distribution-list {
        border-color: #30363d;
      }

      .intestacy-theme-dark .intestacy-breakdown-heading {
        color: #f0f6fc;
      }

      .intestacy-theme-dark .intestacy-advice-section {
        background-color: #21262d;
        border-color: #30363d;
      }

      .intestacy-theme-dark .intestacy-advice-text {
        color: #f0f6fc;
      }

      .intestacy-theme-dark .intestacy-advice-list li {
        color: #f0f6fc;
      }

      .intestacy-theme-dark .intestacy-advice-list li::before {
        color: #58a6ff;
      }

      .intestacy-theme-dark .intestacy-advice-subitem::before {
        color: #8b949e !important;
      }

      .intestacy-theme-dark .intestacy-cta-section {
        background-color: rgba(35, 134, 54, 0.15);
        border-color: rgba(46, 160, 67, 0.3);
      }

      .intestacy-theme-dark .intestacy-cta-text {
        color: #3fb950;
      }

      .intestacy-theme-dark .intestacy-cta-link {
        color: #58a6ff;
      }

      .intestacy-theme-dark .intestacy-cta-link:hover {
        color: #79c0ff;
      }

      .intestacy-theme-dark .intestacy-footer {
        border-top-color: #30363d;
        color: #8b949e;
      }

      .intestacy-theme-dark .intestacy-contact-phone,
      .intestacy-theme-dark .intestacy-contact-email,
      .intestacy-theme-dark .intestacy-contact-website {
        color: #58a6ff;
      }

      .intestacy-theme-dark .intestacy-contact-phone:hover,
      .intestacy-theme-dark .intestacy-contact-email:hover,
      .intestacy-theme-dark .intestacy-contact-website:hover {
        color: #79c0ff;
      }

      .intestacy-theme-dark a:focus,
      .intestacy-theme-dark button:focus,
      .intestacy-theme-dark input:focus,
      .intestacy-theme-dark select:focus,
      .intestacy-theme-dark textarea:focus,
      .intestacy-theme-dark [tabindex]:focus {
        outline-color: #58a6ff;
        box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.4);
      }

      /* ========================================
         RESPONSIVE: TABLET (768px)
         ======================================== */
      @media (max-width: 768px) {
        .intestacy-calculator {
          padding: 16px;
          border-radius: 8px;
        }

        .intestacy-header h1 {
          font-size: 24px;
        }

        .intestacy-content {
          padding: 16px;
        }

        .intestacy-buttons {
          flex-direction: column;
        }

        .intestacy-calculator button {
          width: 100%;
        }

        .intestacy-beneficiary-details {
          flex-direction: column;
          align-items: flex-start;
        }

        .intestacy-beneficiary-details span {
          margin-top: 5px;
        }
      }

      /* ========================================
         RESPONSIVE: MOBILE (480px)
         ======================================== */
      @media (max-width: 480px) {
        .intestacy-header h1 {
          font-size: 20px;
        }

        .intestacy-question {
          padding: 12px;
        }

        .intestacy-result h2 {
          font-size: 20px;
        }

        .intestacy-estate-badge {
          padding: 10px 20px;
        }

        .intestacy-estate-badge-value {
          font-size: 24px;
        }
      }

      /* ========================================
         REDUCED MOTION
         ======================================== */
      @media (prefers-reduced-motion: reduce) {
        .intestacy-calculator * {
          transition: none !important;
          animation: none !important;
        }
      }
    `;
  }
  
  /**
   * Reset the calculator to its initial state
   */
  reset() {
    if (this.ui) {
      this.ui.reset();
    }
  }
  
  /**
   * Update the widget options
   * @param {Object} newOptions - New options to apply
   */
  updateOptions(newOptions = {}) {
    this.options = {
      ...this.options,
      ...newOptions
    };
    
    // Re-initialize with new options
    this.init();
  }
}

// Make available globally when included via script tag
if (typeof window !== 'undefined') {
  window.IntestacyWidget = IntestacyWidget;
}

export default IntestacyWidget;