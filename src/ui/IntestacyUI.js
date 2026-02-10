/**
 * IntestacyUI.js
 * Main UI controller for the intestacy calculator
 */

import IntestacyCalculator from '../core/IntestacyCalculator.js';
import { validateEstateValue, validateName } from '../core/ValidationUtils.js';

class IntestacyUI {
  /**
   * Create a new IntestacyUI instance
   * @param {HTMLElement|string} container - The container element or selector
   * @param {Object} options - Configuration options
   */
  constructor(container, options = {}) {
    // Get the container element
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    if (!this.container) {
      throw new Error('Container element not found');
    }
    
    // Default options
    this.options = {
      theme: 'light',
      contactInfo: 'Please contact us to discuss creating a Will.',
      contactPhone: '0123 456 7890',
      contactEmail: 'info@example.com',
      ...options
    };
    
    // Create calculator instance
    this.calculator = new IntestacyCalculator();
    
    // State object
    this.state = {
      name: '',
      estateValue: 0,
      marriageStatus: '',
      currentQuestionId: '',
      answers: {}
    };
    
    // UI elements
    this.elements = {};
    
    // Initialize the UI
    this.init();
  }
  
  /**
   * Initialize the UI
   */
  init() {
    // Create the UI structure
    this.createUIStructure();

    // Add event listeners
    this.addEventListeners();
    
    // Apply theme
    this.applyTheme(this.options.theme);
    
    // Show the name input step
    this.showNameInput();
  }
  
  /**
   * Create the UI structure
   */
  createUIStructure() {
    // Create the main calculator container
    const calculatorElement = document.createElement('div');
    calculatorElement.className = 'intestacy-calculator';
    calculatorElement.id = 'intestacy-calculator';
    calculatorElement.setAttribute('role', 'application');
    calculatorElement.setAttribute('aria-label', 'UK Intestacy Calculator');
    
    // Create name input section
    const nameSection = document.createElement('form');
    nameSection.className = 'intestacy-section intestacy-name-section';
    nameSection.id = 'intestacy-name-section';
    nameSection.setAttribute('role', 'form');
    nameSection.setAttribute('novalidate', 'true');
    nameSection.setAttribute('aria-labelledby', 'intestacy-name-heading');
    
    const nameHeading = document.createElement('h2');
    nameHeading.textContent = 'What is your name?';
    nameHeading.id = 'intestacy-name-heading';
    
    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('for', 'intestacy-name-input');
    nameLabel.textContent = 'Full Name';
    nameLabel.className = 'intestacy-label';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'intestacy-name-input';
    nameInput.id = 'intestacy-name-input';
    nameInput.placeholder = 'Enter your name';
    nameInput.setAttribute('aria-required', 'true');
    nameInput.setAttribute('aria-describedby', 'intestacy-name-error');
    nameInput.setAttribute('autocomplete', 'name');
    
    // Add error message for name
    const nameError = document.createElement('div');
    nameError.className = 'intestacy-error intestacy-name-error';
    nameError.id = 'intestacy-name-error';
    nameError.style.display = 'none';
    nameError.setAttribute('role', 'alert');
    nameError.setAttribute('aria-live', 'assertive');
    
    const nameButton = document.createElement('button');
    nameButton.className = 'intestacy-button intestacy-name-button';
    nameButton.id = 'intestacy-name-button';
    nameButton.textContent = 'Continue';
    nameButton.type = 'submit';
    nameButton.setAttribute('aria-label', 'Continue to next step');
    
    nameSection.appendChild(nameHeading);
    nameSection.appendChild(nameLabel);
    nameSection.appendChild(nameInput);
    nameSection.appendChild(nameError);
    nameSection.appendChild(nameButton);
    
    // Create estate input section
    const estateSection = document.createElement('form');
    estateSection.className = 'intestacy-section intestacy-estate-section';
    estateSection.id = 'intestacy-estate-section';
    estateSection.style.display = 'none';
    estateSection.setAttribute('role', 'form');
    estateSection.setAttribute('novalidate', 'true');
    estateSection.setAttribute('aria-labelledby', 'intestacy-estate-heading');
    
    const estateHeading = document.createElement('h2');
    estateHeading.textContent = 'What is the value of your estate?';
    estateHeading.id = 'intestacy-estate-heading';
    
    const estateLabel = document.createElement('label');
    estateLabel.setAttribute('for', 'intestacy-estate-input');
    estateLabel.textContent = 'Estate Value (£)';
    estateLabel.className = 'intestacy-label';
    
    const estateInput = document.createElement('input');
    estateInput.type = 'text';
    estateInput.className = 'intestacy-estate-input';
    estateInput.id = 'intestacy-estate-input';
    estateInput.placeholder = 'Enter estate value (£)';
    estateInput.setAttribute('aria-required', 'true');
    estateInput.setAttribute('aria-describedby', 'intestacy-estate-error');
    estateInput.setAttribute('inputmode', 'numeric');
    estateInput.setAttribute('pattern', '[0-9]*');
    
    // Add error message for estate
    const estateError = document.createElement('div');
    estateError.className = 'intestacy-error intestacy-estate-error';
    estateError.id = 'intestacy-estate-error';
    estateError.style.display = 'none';
    estateError.setAttribute('role', 'alert');
    estateError.setAttribute('aria-live', 'assertive');
    
    const estateButton = document.createElement('button');
    estateButton.className = 'intestacy-button intestacy-estate-button';
    estateButton.id = 'intestacy-estate-button';
    estateButton.textContent = 'Continue';
    estateButton.type = 'submit';
    estateButton.setAttribute('aria-label', 'Continue to next step');
    
    estateSection.appendChild(estateHeading);
    estateSection.appendChild(estateLabel);
    estateSection.appendChild(estateInput);
    estateSection.appendChild(estateError);
    estateSection.appendChild(estateButton);
    
    // Create marital status section
    const statusSection = document.createElement('form');
    statusSection.className = 'intestacy-section intestacy-status-section';
    statusSection.id = 'intestacy-status-section';
    statusSection.style.display = 'none';
    statusSection.setAttribute('role', 'form');
    statusSection.setAttribute('novalidate', 'true');
    statusSection.setAttribute('aria-labelledby', 'intestacy-status-heading');
    
    const statusHeading = document.createElement('h2');
    statusHeading.textContent = 'What is your marital status?';
    statusHeading.id = 'intestacy-status-heading';
    
    // Create fieldset for radio buttons
    const statusFieldset = document.createElement('fieldset');
    statusFieldset.className = 'intestacy-status-fieldset';
    
    const statusLegend = document.createElement('legend');
    statusLegend.textContent = 'Select your marital status';
    statusLegend.className = 'intestacy-visuallyhidden'; // Visually hidden but accessible to screen readers
    
    statusFieldset.appendChild(statusLegend);
    
    const statusOptions = document.createElement('div');
    statusOptions.className = 'intestacy-status-options';
    statusOptions.setAttribute('role', 'radiogroup');
    statusOptions.setAttribute('aria-required', 'true');
    statusOptions.setAttribute('aria-describedby', 'intestacy-status-error');
    
    const options = [
      { id: 'married', label: 'Married or in Civil Partnership' },
      { id: 'cohabiting', label: 'Living with Partner (Cohabiting)' },
      { id: 'single', label: 'Single/Divorced/Widowed' }
    ];
    
    options.forEach((option, index) => {
      const optionLabel = document.createElement('label');
      optionLabel.className = 'intestacy-status-option';
      optionLabel.setAttribute('for', `intestacy-status-${option.id}`);
      
      const optionInput = document.createElement('input');
      optionInput.type = 'radio';
      optionInput.name = 'marital-status';
      optionInput.value = option.id;
      optionInput.id = `intestacy-status-${option.id}`;
      optionInput.className = 'intestacy-status-input';
      if (index === 0) {
        optionInput.setAttribute('tabindex', '0');
      } else {
        optionInput.setAttribute('tabindex', '-1');
      }
      optionInput.setAttribute('aria-checked', 'false');
      
      const optionText = document.createTextNode(option.label);
      
      optionLabel.appendChild(optionInput);
      optionLabel.appendChild(optionText);
      statusOptions.appendChild(optionLabel);
    });
    
    statusFieldset.appendChild(statusOptions);
    
    // Add error message for status
    const statusError = document.createElement('div');
    statusError.className = 'intestacy-error intestacy-status-error';
    statusError.id = 'intestacy-status-error';
    statusError.style.display = 'none';
    statusError.setAttribute('role', 'alert');
    statusError.setAttribute('aria-live', 'assertive');
    
    // Add cohabiting warning
    const cohabitingWarning = document.createElement('div');
    cohabitingWarning.className = 'intestacy-cohabiting-warning';
    cohabitingWarning.id = 'intestacy-cohabiting-warning';
    cohabitingWarning.innerHTML = '<strong>Warning:</strong> As a cohabiting partner, you have no automatic inheritance rights under UK law.';
    cohabitingWarning.style.display = 'none';
    cohabitingWarning.setAttribute('role', 'alert');
    cohabitingWarning.setAttribute('aria-live', 'polite');
    
    const statusButton = document.createElement('button');
    statusButton.className = 'intestacy-button intestacy-status-button';
    statusButton.id = 'intestacy-status-button';
    statusButton.textContent = 'Continue';
    statusButton.type = 'submit';
    statusButton.setAttribute('aria-label', 'Continue to next step');
    
    statusSection.appendChild(statusHeading);
    statusSection.appendChild(statusFieldset);
    statusSection.appendChild(statusError);
    statusSection.appendChild(cohabitingWarning);
    statusSection.appendChild(statusButton);
    
    // Create question section
    const questionSection = document.createElement('form');
    questionSection.className = 'intestacy-section intestacy-question-section';
    questionSection.id = 'intestacy-question-section';
    questionSection.style.display = 'none';
    questionSection.setAttribute('role', 'form');
    questionSection.setAttribute('novalidate', 'true');
    questionSection.setAttribute('aria-labelledby', 'intestacy-question-heading');
    
    const questionHeading = document.createElement('h2');
    questionHeading.className = 'intestacy-question-heading';
    questionHeading.id = 'intestacy-question-heading';
    questionHeading.textContent = 'Family Information';
    
    const questionText = document.createElement('div');
    questionText.className = 'intestacy-question-text';
    questionText.id = 'intestacy-question-text';
    questionText.setAttribute('aria-live', 'polite');
    
    // Create fieldset for question options
    const questionFieldset = document.createElement('fieldset');
    questionFieldset.className = 'intestacy-question-fieldset';
    
    const questionLegend = document.createElement('legend');
    questionLegend.className = 'intestacy-visuallyhidden';
    // Add inline styles to ensure the legend does not affect layout
    questionLegend.style.cssText = 'display: none !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important;';
    
    questionFieldset.appendChild(questionLegend);
    
    const questionError = document.createElement('div');
    questionError.className = 'intestacy-error intestacy-question-error';
    questionError.id = 'intestacy-question-error';
    questionError.style.display = 'none';
    questionError.setAttribute('role', 'alert');
    questionError.setAttribute('aria-live', 'assertive');
    
    const questionButtons = document.createElement('div');
    questionButtons.className = 'intestacy-question-buttons';
    
    const yesButton = document.createElement('button');
    yesButton.className = 'intestacy-button intestacy-yes-button';
    yesButton.id = 'intestacy-yes-button';
    yesButton.textContent = 'Yes';
    yesButton.type = 'button';
    yesButton.setAttribute('aria-label', 'Yes to the question');
    
    const noButton = document.createElement('button');
    noButton.className = 'intestacy-button intestacy-no-button';
    noButton.id = 'intestacy-no-button';
    noButton.textContent = 'No';
    noButton.type = 'button';
    noButton.setAttribute('aria-label', 'No to the question');
    
    // Append buttons to their container
    questionButtons.appendChild(yesButton);
    questionButtons.appendChild(noButton);

    // Append elements to the question section
    questionSection.appendChild(questionHeading);
    questionSection.appendChild(questionText);
    questionSection.appendChild(questionFieldset);
    questionSection.appendChild(questionError);
    questionSection.appendChild(questionButtons);
    
    // Create result section
    const resultSection = document.createElement('div');
    resultSection.className = 'intestacy-section intestacy-result-section';
    resultSection.id = 'intestacy-result-section';
    resultSection.style.display = 'none';
    resultSection.setAttribute('role', 'region');
    resultSection.setAttribute('aria-labelledby', 'intestacy-result-heading');
    
    const resultHeading = document.createElement('h2');
    resultHeading.textContent = 'Inheritance Distribution';
    resultHeading.id = 'intestacy-result-heading';
    
    const resultContent = document.createElement('div');
    resultContent.className = 'intestacy-result-content';
    resultContent.id = 'intestacy-result-content';
    resultContent.setAttribute('tabindex', '0'); // Make focusable to help screen reader users
    resultContent.setAttribute('aria-live', 'polite');
    
    const restartButton = document.createElement('button');
    restartButton.className = 'intestacy-button intestacy-restart-button';
    restartButton.id = 'intestacy-restart';
    restartButton.textContent = 'Start Again';
    restartButton.type = 'button';
    restartButton.setAttribute('aria-label', 'Start calculator again from beginning');
    
    resultSection.appendChild(resultHeading);
    resultSection.appendChild(resultContent);
    resultSection.appendChild(restartButton);
    
    // Create footer with legal disclaimer
    const footer = document.createElement('footer');
    footer.className = 'intestacy-footer';
    footer.setAttribute('role', 'contentinfo');
    
    const disclaimer = document.createElement('p');
    disclaimer.className = 'intestacy-disclaimer';
    disclaimer.innerHTML = 'This calculator provides a simplified view of intestacy rules in England and Wales. The actual distribution may vary based on specific circumstances. This is not legal advice.';
    
    footer.appendChild(disclaimer);
    
    // Add contact information if provided
    if (this.options.contactInfo) {
      const contactInfo = document.createElement('div');
      contactInfo.className = 'intestacy-contact-info';
      contactInfo.setAttribute('aria-label', 'Contact Information');
      
      // Add basic contact info text without duplicating phone/email that will be added below
      const contactText = document.createElement('p');
      contactText.innerHTML = this.options.contactInfo;
      contactInfo.appendChild(contactText);
      
      // If phone number is provided, make it accessible
      if (this.options.contactPhone) {
        const phoneLink = document.createElement('a');
        phoneLink.href = `tel:${this.options.contactPhone.replace(/\s+/g, '')}`;
        phoneLink.className = 'intestacy-contact-phone';
        phoneLink.innerHTML = this.options.contactPhone;
        phoneLink.setAttribute('aria-label', `Phone: ${this.options.contactPhone}`);
        
        contactInfo.appendChild(document.createElement('br'));
        contactInfo.appendChild(phoneLink);
      }
      
      // If email is provided, make it accessible
      if (this.options.contactEmail) {
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${this.options.contactEmail}`;
        emailLink.className = 'intestacy-contact-email';
        emailLink.innerHTML = this.options.contactEmail;
        emailLink.setAttribute('aria-label', `Email: ${this.options.contactEmail}`);
        
        contactInfo.appendChild(document.createElement('br'));
        contactInfo.appendChild(emailLink);
      }
      
      footer.appendChild(contactInfo);
    }
    
    // Add copyright notice
    const copyrightNotice = document.createElement('p');
    copyrightNotice.className = 'intestacy-copyright';
    copyrightNotice.textContent = '© WillSolicitor.co.uk (a trading style of McHale Legal Limited) 2025. All Rights Reserved.';
    
    footer.appendChild(copyrightNotice);
    
    // Add all sections to calculator
    calculatorElement.appendChild(nameSection);
    calculatorElement.appendChild(estateSection);
    calculatorElement.appendChild(statusSection);
    calculatorElement.appendChild(questionSection);
    calculatorElement.appendChild(resultSection);
    calculatorElement.appendChild(footer);
    
    // Replace container contents with calculator
    this.container.innerHTML = '';
    this.container.appendChild(calculatorElement);
    
    // Store references to UI elements
    this.elements = {
      calculator: calculatorElement,
      nameSection: nameSection,
      nameInput: nameInput,
      nameButton: nameButton,
      nameError: nameError,
      estateSection: estateSection,
      estateInput: estateInput,
      estateButton: estateButton,
      estateError: estateError,
      statusSection: statusSection,
      statusFieldset: statusFieldset,
      statusOptions: statusOptions,
      statusInputs: statusOptions.querySelectorAll('input[name="marital-status"]'),
      statusButton: statusButton,
      statusError: statusError,
      cohabitingWarning: cohabitingWarning,
      questionSection: questionSection,
      questionHeading: questionHeading,
      questionText: questionText,
      questionError: questionError,
      questionButtons: questionButtons,
      yesButton: yesButton,
      noButton: noButton,
      resultSection: resultSection,
      resultContent: resultContent,
      restartButton: restartButton
    };

    // Cache copyright element
    this.elements.copyrightNotice = this.elements.calculator.querySelector('.intestacy-copyright');
  }

  /**
   * Add event listeners to UI elements
   */
  addEventListeners() {
    // Name button click
    this.elements.nameButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleNameSubmit();
    });
    
    // Name form submission
    this.elements.nameSection.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleNameSubmit();
    });
    
    // Name input Enter key
    this.elements.nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleNameSubmit();
      }
    });
    
    // Estate button click
    this.elements.estateButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleEstateSubmit();
    });
    
    // Estate form submission
    this.elements.estateSection.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleEstateSubmit();
    });
    
    // Estate input Enter key
    this.elements.estateInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleEstateSubmit();
      }
    });
    
    // Status button click
    this.elements.statusButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleStatusSubmit();
    });
    
    // Status form submission
    this.elements.statusSection.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleStatusSubmit();
    });
    
    // Status radio button keyboard navigation
    Array.from(this.elements.statusInputs).forEach((input, index) => {
      input.addEventListener('keydown', (e) => {
        const inputs = Array.from(this.elements.statusInputs);
        let nextIndex;
        
        // Arrow up/down navigation for radio buttons
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          nextIndex = (index + 1) % inputs.length;
          inputs[nextIndex].checked = true;
          inputs[nextIndex].focus();
          this.updateRadioGroupTabindex(nextIndex);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          nextIndex = (index - 1 + inputs.length) % inputs.length;
          inputs[nextIndex].checked = true;
          inputs[nextIndex].focus();
          this.updateRadioGroupTabindex(nextIndex);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.handleStatusSubmit();
        }
      });
      
      // Update ARIA state when radio changes
      input.addEventListener('change', () => {
        Array.from(this.elements.statusInputs).forEach((radio, i) => {
          radio.setAttribute('aria-checked', radio.checked.toString());
          
          // Update tabindex to make only the checked radio tabbable
          if (radio.checked) {
            this.updateRadioGroupTabindex(i);
          }
        });
      });
    });
    
    // Yes button click
    this.elements.yesButton.addEventListener('click', () => {
      this.handleQuestionAnswer(true);
    });
    
    // Yes button keyboard accessibility
    this.elements.yesButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleQuestionAnswer(true);
      }
    });
    
    // No button click
    this.elements.noButton.addEventListener('click', () => {
      this.handleQuestionAnswer(false);
    });
    
    // No button keyboard accessibility
    this.elements.noButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleQuestionAnswer(false);
      }
    });
    
    // Restart button click
    this.elements.restartButton.addEventListener('click', () => {
      this.reset();
    });
    
    // Restart button keyboard accessibility
    this.elements.restartButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.reset();
      }
    });
  }
  
  /**
   * Update tabindex attributes for radio button group
   * @param {number} selectedIndex - The index of the selected radio button
   */
  updateRadioGroupTabindex(selectedIndex) {
    Array.from(this.elements.statusInputs).forEach((radio, i) => {
      radio.setAttribute('tabindex', i === selectedIndex ? '0' : '-1');
      radio.setAttribute('aria-checked', radio.checked.toString());
    });
  }
  
  /**
   * Apply theme to calculator
   * @param {string} theme - The theme to apply ('light' or 'dark')
   */
  applyTheme(theme) {
    this.container.classList.add(`intestacy-theme-${theme}`);
  }
  
  /**
   * Hide all sections
   */
  hideAllSections() {
    const sections = [
      'intestacy-name-section',
      'intestacy-estate-section',
      'intestacy-status-section',
      'intestacy-question-section',
      'intestacy-result-section'
    ];
    
    sections.forEach(section => {
      const element = this.elements.calculator.querySelector(`.${section}`);
      if (element) {
        element.style.display = 'none';
      }
    });
  }
  
  /**
   * Handle name input submission
   */
  handleNameSubmit() {
    const name = this.elements.nameInput.value.trim();
    
    if (!name) {
      this.elements.nameError.textContent = 'Please enter your name';
      this.elements.nameError.style.display = 'block';
      // Set aria-invalid on the input
      this.elements.nameInput.setAttribute('aria-invalid', 'true');
      // Set focus back to the input for correction
      this.elements.nameInput.focus();
      return;
    }
    
    // Store the name
    this.state.name = name;
    this.calculator.state.name = name;
    
    // Clear error and reset aria attributes
    this.elements.nameError.style.display = 'none';
    this.elements.nameInput.setAttribute('aria-invalid', 'false');
    
    // Show estate input
    this.showEstateInput();
  }
  
  /**
   * Show the estate value input step
   */
  showEstateInput() {
    this.elements.nameSection.style.display = 'none';
    this.elements.estateSection.style.display = 'block';
    this.elements.statusSection.style.display = 'none';
    this.elements.questionSection.style.display = 'none';
    this.elements.resultSection.style.display = 'none';
    
    // Clear any previous error state
    this.elements.estateError.style.display = 'none';
    this.elements.estateError.textContent = '';
    this.elements.estateInput.setAttribute('aria-invalid', 'false');
    
    // Focus on heading first for screen readers to announce the section
    const estateHeading = this.elements.estateSection.querySelector('h2');
    if (estateHeading) {
      estateHeading.setAttribute('tabindex', '-1');
      estateHeading.focus();
      // Then move focus to the input after announcing
      setTimeout(() => {
        estateHeading.removeAttribute('tabindex');
        this.elements.estateInput.focus();
      }, 100);
    } else {
      // Fallback to direct focus on input
      setTimeout(() => this.elements.estateInput.focus(), 300);
    }
  }
  
  /**
   * Show the name input step
   */
  showNameInput() {
    this.elements.nameSection.style.display = 'block';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'none';
    this.elements.questionSection.style.display = 'none';
    this.elements.resultSection.style.display = 'none';
    
    // Focus on heading first for screen readers to announce the section
    const nameHeading = this.elements.nameSection.querySelector('h2');
    if (nameHeading) {
      nameHeading.setAttribute('tabindex', '-1');
      nameHeading.focus();
      // Then move focus to the input after announcing
      setTimeout(() => {
        nameHeading.removeAttribute('tabindex');
        this.elements.nameInput.focus();
      }, 100);
    } else {
      // Fallback to direct focus on input
      setTimeout(() => this.elements.nameInput.focus(), 300);
    }
  }
  
  /**
   * Handle estate value input submission
   */
  handleEstateSubmit() {
    const estateValueRaw = this.elements.estateInput.value.trim();
    
    // Remove currency symbols and commas
    const estateValue = estateValueRaw.replace(/[£$,]/g, '');
    
    // Clear previous error state
    this.elements.estateError.style.display = 'none';
    this.elements.estateError.textContent = '';
    this.elements.estateInput.setAttribute('aria-invalid', 'false');
    
    // Validate empty value
    if (!estateValue) {
      this.elements.estateError.textContent = 'Please enter your estate value';
      this.elements.estateError.style.display = 'block';
      this.elements.estateError.setAttribute('role', 'alert');
      this.elements.estateInput.setAttribute('aria-invalid', 'true');
      this.elements.estateInput.focus();
      return;
    }
    
    // Validate estate value is a number
    const isValid = /^\d+$/.test(estateValue.replace(/[,.]/g, ''));
    if (!isValid) {
      this.elements.estateError.textContent = 'Please enter a valid number';
      this.elements.estateError.style.display = 'block';
      this.elements.estateError.setAttribute('role', 'alert');
      this.elements.estateInput.setAttribute('aria-invalid', 'true');
      this.elements.estateInput.focus();
      return;
    }
    
    // Store the estate value
    const estateValueNumber = parseFloat(estateValue);
    this.state.estateValue = estateValueNumber;
    this.calculator.state.estateValue = estateValueNumber;
    
    // Show marital status input
    this.showStatusInput();
  }
  
  /**
   * Show marital status input
   */
  showStatusInput() {
    this.elements.nameSection.style.display = 'none';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'block';
    this.elements.questionSection.style.display = 'none';
    this.elements.resultSection.style.display = 'none';
    
    // Focus on heading first for screen readers to announce the section
    const statusHeading = this.elements.statusSection.querySelector('h2');
    if (statusHeading) {
      statusHeading.setAttribute('tabindex', '-1');
      statusHeading.focus();
      // Then move focus to the first radio button after announcing
      setTimeout(() => {
        statusHeading.removeAttribute('tabindex');
        // Focus the first radio button in the group
        const firstRadio = this.elements.statusInputs[0];
        if (firstRadio) {
          firstRadio.focus();
          // Ensure only the first radio is in the tab order initially
          this.updateRadioGroupTabindex(0);
        }
      }, 100);
    }
  }
  
  /**
   * Handle marital status submission
   */
  handleStatusSubmit() {
    // Get selected status
    let selectedStatus = null;
    
    for (const input of this.elements.statusInputs) {
      if (input.checked) {
        selectedStatus = input.value;
        break;
      }
    }
    
    // Validate selection
    if (!selectedStatus) {
      this.elements.statusError.textContent = 'Please select your marital status';
      this.elements.statusError.style.display = 'block';
      
      // Set focus on the error message for screen readers
      this.elements.statusError.setAttribute('tabindex', '-1');
      this.elements.statusError.focus();
      
      // Reset focus to the first radio
      setTimeout(() => {
        this.elements.statusError.removeAttribute('tabindex');
        const firstRadio = this.elements.statusInputs[0];
        if (firstRadio) {
          firstRadio.focus();
        }
      }, 1000);
      
      return;
    }
    
    // Store marital status
    this.state.marriageStatus = selectedStatus;
    this.calculator.state.marriageStatus = selectedStatus;
    
    // Clear error
    this.elements.statusError.style.display = 'none';
    
    // Map the radio button selection to calculator state
    if (selectedStatus === 'married') {
      this.calculator.state.married = true;
      this.calculator.state.cohabiting = false;
      this.elements.cohabitingWarning.style.display = 'none';
      this.moveToQuestions();
    } else if (selectedStatus === 'cohabiting') {
      this.calculator.state.married = false;
      this.calculator.state.cohabiting = true;
      this.elements.cohabitingWarning.style.display = 'block';

      // Announce the warning to screen readers
      this.elements.cohabitingWarning.setAttribute('tabindex', '-1');
      this.elements.cohabitingWarning.focus();

      // Move on after the warning has been read (or after a delay)
      setTimeout(() => {
        this.elements.cohabitingWarning.removeAttribute('tabindex');
        this.moveToQuestions();
      }, 2000);
    } else {
      // single/divorced/widowed
      this.calculator.state.married = false;
      this.calculator.state.cohabiting = false;
      this.elements.cohabitingWarning.style.display = 'none';
      this.moveToQuestions();
    }
  }
  
  /**
   * Show a question
   * @param {string} questionId - The ID of the question to show
   */
  showQuestion(questionId) {
    this.state.currentQuestionId = questionId;
    
    // Get the question text from the calculator
    const questionObj = this.calculator.questionMap[questionId];
    const questionTextContent = questionObj ? questionObj.text : "Unknown question";
    
    // Update the question text element's content
    this.elements.questionText.textContent = questionTextContent; // Use textContent to avoid potential HTML injection if question text changes
    
    // Ensure the visually hidden legend is correctly classed and empty if it's somehow rendering content
    const questionLegend = this.elements.questionSection.querySelector('.intestacy-visuallyhidden');
    if (questionLegend) {
        questionLegend.classList.add('intestacy-visuallyhidden'); // Ensure class is present
        // Text content is set in createUIStructure for accessibility, rely on CSS to hide visually
    }

    // Adjust styling for spacing - adding inline styles as a temporary measure
    // This is not ideal and should be handled by CSS classes
    
    // Add a defensive check before accessing style
    if (this.elements.questionButtons) {
        // Spacing should be handled by CSS classes, removing temporary inline style
    }

    // Hide other sections
    this.elements.nameSection.style.display = 'none';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'none';
    this.elements.resultSection.style.display = 'none';
    
    // Show question section
    this.elements.questionSection.style.display = 'block';
    
    // Ensure cohabiting warning remains visible if applicable
    if (this.calculator.state.cohabiting) {
      this.elements.cohabitingWarning.style.display = 'block';
      // Move the warning to the question section so it\'s visible
      this.elements.questionSection.insertBefore(this.elements.cohabitingWarning, this.elements.questionHeading);
    }
    
    // Clear any previous error
    this.elements.questionError.style.display = 'none';
    
    // Accessibility enhancements
    // Set focus to the question heading for screen readers to announce it
    this.elements.questionHeading.setAttribute('tabindex', '-1');
    this.elements.questionHeading.focus();
    // Remove tabindex after focus to avoid keyboard navigation issues
    setTimeout(() => {
      this.elements.questionHeading.removeAttribute('tabindex');
    }, 100);
    
    // Announce the question to screen readers
    // The aria-live region in questionText will announce the change automatically
    
    // Ensure yes/no buttons are properly enabled and have appropriate roles
    this.elements.yesButton.disabled = false;
    this.elements.noButton.disabled = false;
    this.elements.yesButton.setAttribute('aria-pressed', 'false');
    this.elements.noButton.setAttribute('aria-pressed', 'false');
  }
  
  /**
   * Show the result
   */
  showResult() {
    // Calculate distribution - now returns object with text and data
    const distribution = this.calculator.calculateDistribution();
    
    // Get estate value for display
    const estateValue = this.calculator.formatCurrency(this.state.estateValue);
    
    // Format result with rich text and structured sections with enhanced semantics for accessibility
    let formattedResult = `
      <h2>Distribution Results for ${this.state.name}</h2>
      
      <div class="intestacy-result-summary" role="region" aria-label="Estate Summary">
        <p><strong>Estate Value:</strong> <span aria-label="Estate Value: ${estateValue}">${estateValue}</span></p>
      </div>
      
      <div class="intestacy-result-details" role="region" aria-label="Detailed Distribution">
        <h3>Detailed Distribution</h3>
        ${this.formatDistributionDetails(distribution.data, distribution.text)}
      </div>
    `;
    
    // Update result text
    this.elements.resultContent.innerHTML = formattedResult;
    
    // Hide other sections
    this.elements.nameSection.style.display = 'none';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'none';
    this.elements.questionSection.style.display = 'none';
    
    // Show result section
    this.elements.resultSection.style.display = 'block';
    
    // Ensure cohabiting warning remains visible if applicable
    if (this.calculator.state.cohabiting) {
      this.elements.cohabitingWarning.style.display = 'block';
      // Move the warning to the result section so it's visible at the top
      this.elements.resultSection.insertBefore(this.elements.cohabitingWarning, this.elements.resultContent);
    }
    
    // Accessibility enhancements
    // Set focus to the result heading for screen readers to announce it
    const resultHeading = this.elements.resultSection.querySelector('h2');
    if (resultHeading) {
      resultHeading.setAttribute('tabindex', '-1');
      resultHeading.focus();
      // Remove tabindex after focus to avoid keyboard navigation issues
      setTimeout(() => {
        resultHeading.removeAttribute('tabindex');
      }, 100);
    } else {
      // Fall back to setting focus on the result content
      this.elements.resultContent.focus();
    }
    
    // Ensure all links and interactive elements in the results are keyboard accessible
    const interactiveElements = this.elements.resultContent.querySelectorAll('a, button');
    interactiveElements.forEach(element => {
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    });
  }
  
  /**
   * Format distribution details for display
   * @param {Object} distributionData - Distribution data
   * @returns {string} - HTML string with formatted details
   */
  formatDistributionDetails(distributionData, summaryText = '') {
    if (!distributionData || !distributionData.shares || distributionData.shares.length === 0 || !distributionData.beneficiaries) {
      return '<p>No distribution data available.</p>';
    }
    
    // Format as list with percentages and amounts
    const totalValue = distributionData.totalValue || 
      distributionData.shares.reduce((sum, share) => sum + share, 0);
    
    // Remove any cohabiting warning div from the summary text to avoid duplication
    summaryText = summaryText.replace(/<div class="intestacy-cohabiting-warning">.*?<\/div>/s, '');
    
    const summaryHtml = `<p>${summaryText}</p>`;
    
    let html = summaryHtml + '<ul class="intestacy-distribution-list" role="list" aria-label="Distribution Breakdown">';
    
    // Ensure beneficiaries array exists and matches shares length
    if (distributionData.beneficiaries.length !== distributionData.shares.length) {
      return summaryHtml + '<p>Invalid distribution data.</p>';
    }
    
    for (let i = 0; i < distributionData.beneficiaries.length; i++) {
      const beneficiary = distributionData.beneficiaries[i];
      const share = distributionData.shares[i];
      
      // Convert share to percentage of total
      const percentage = Math.round((share / totalValue) * 100);
      
      // Format share as currency
      const shareFormatted = this.calculator.formatCurrency(share);
      
      html += `
        <li class="intestacy-beneficiary" role="listitem">
          <div class="intestacy-beneficiary-details">
            <span class="intestacy-beneficiary-name">${beneficiary}</span>
            <span class="intestacy-beneficiary-share" aria-label="${beneficiary} receives ${shareFormatted}, which is ${percentage}% of the estate">
              <span class="intestacy-beneficiary-amount">${shareFormatted}</span>
              <span class="intestacy-beneficiary-percentage">(${percentage}%)</span>
            </span>
          </div>
        </li>
      `;
    }
    
    html += '</ul>';
    
    // Add an accessible explanation for screen readers
    if (distributionData.beneficiaries && distributionData.beneficiaries.length > 0) {
      const formattedTotalValue = this.calculator.formatCurrency(totalValue);
      // Join the list of beneficiaries for the accessible text
      const beneficiaryList = distributionData.beneficiaries.join(' and ');

      html += `
        <div class="intestacy-distribution-summary sr-only" aria-live="polite">
          The estate valued at ${formattedTotalValue} will be distributed to: ${beneficiaryList}.
        </div>
      `;
    }
    
    return html;
  }
  
  /**
   * Move to questions section after marital status
   */
  moveToQuestions() {
    // Check if we can determine distribution already or need to ask more questions
    if (this.calculator.canDetermineDistribution()) {
      this.showResult();
    } else {
      // Get the first question and show it
      const firstQuestionId = 'children'; // Start with the children question
      if (firstQuestionId) {
        this.showQuestion(firstQuestionId);
      } else {
        console.error('No questions defined');
      }
    }
  }
  
  /**
   * Handle question answer
   * @param {boolean} answer - The answer (true for yes, false for no)
   */
  handleQuestionAnswer(answer) {
    // Make sure we have a current question
    if (!this.state.currentQuestionId) {
      console.error('No current question');
      return;
    }
    
    // Update calculator with the answer
    this.calculator.answerQuestion(this.state.currentQuestionId, answer);
    
    // Update button aria states for screen readers
    if (answer) {
      this.elements.yesButton.setAttribute('aria-pressed', 'true');
      this.elements.noButton.setAttribute('aria-pressed', 'false');
    } else {
      this.elements.yesButton.setAttribute('aria-pressed', 'false');
      this.elements.noButton.setAttribute('aria-pressed', 'true');
    }
    
    // Temporarily disable buttons to prevent double-clicking
    this.elements.yesButton.disabled = true;
    this.elements.noButton.disabled = true;
    
    // Add a brief delay for screen readers to announce the selection
    setTimeout(() => {
      // Get the next question or show results
      const nextQuestionId = this.calculator.getNextQuestionId();
      
      if (nextQuestionId) {
        this.showQuestion(nextQuestionId);
      } else {
        // No more questions, show the result
        this.showResult();
      }
      
      // Reset button states
      this.elements.yesButton.disabled = false;
      this.elements.noButton.disabled = false;
      this.elements.yesButton.setAttribute('aria-pressed', 'false');
      this.elements.noButton.setAttribute('aria-pressed', 'false');
    }, 300);
  }
  
  /**
   * Reset the calculator
   */
  reset() {
    // Reset calculator state
    this.calculator = new IntestacyCalculator();
    
    // Reset UI state
    this.state = {
      name: '',
      estateValue: 0,
      marriageStatus: '',
      currentQuestionId: '',
      answers: {}
    };
    
    // Reset inputs
    this.elements.nameInput.value = '';
    this.elements.estateInput.value = '';
    
    // Reset marital status
    for (const input of this.elements.statusInputs) {
      input.checked = false;
      input.setAttribute('aria-checked', 'false');
    }
    
    // Reset first radio tabindex for keyboard accessibility
    this.updateRadioGroupTabindex(0);
    
    // Reset ARIA states
    this.elements.nameInput.setAttribute('aria-invalid', 'false');
    this.elements.estateInput.setAttribute('aria-invalid', 'false');
    
    // Hide errors
    this.elements.nameError.style.display = 'none';
    this.elements.estateError.style.display = 'none';
    this.elements.statusError.style.display = 'none';
    this.elements.questionError.style.display = 'none';
    
    // Hide warning
    this.elements.cohabitingWarning.style.display = 'none';
    
    // Show the name input section
    this.showNameInput();
    
    // Announce to screen readers that the calculator has been reset
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'assertive');
    announcement.textContent = 'Calculator has been reset. Please enter your information again.';
    this.elements.calculator.appendChild(announcement);
    
    // Remove the announcement after it's been read
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 3000);
  }
}

// Export the class for use in other modules
export default IntestacyUI;