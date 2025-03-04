/**
 * IntestacyUI.js
 * Main UI controller for the intestacy calculator
 */

import IntestacyCalculator from '../core/IntestacyCalculator.js';
import { validateEstateValue, validateName, stringToBoolean } from '../core/ValidationUtils.js';

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
    
    // Create name input section
    const nameSection = document.createElement('div');
    nameSection.className = 'intestacy-section intestacy-name-section';
    nameSection.id = 'intestacy-name-section';
    
    const nameHeading = document.createElement('h2');
    nameHeading.textContent = 'What is your name?';
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'intestacy-name-input';
    nameInput.id = 'intestacy-name-input';
    nameInput.placeholder = 'Enter your name';
    
    // Add error message for name
    const nameError = document.createElement('div');
    nameError.className = 'intestacy-error intestacy-name-error';
    nameError.id = 'intestacy-name-error';
    nameError.style.display = 'none';
    
    const nameButton = document.createElement('button');
    nameButton.className = 'intestacy-button intestacy-name-button';
    nameButton.id = 'intestacy-name-button';
    nameButton.textContent = 'Continue';
    
    nameSection.appendChild(nameHeading);
    nameSection.appendChild(nameInput);
    nameSection.appendChild(nameError);
    nameSection.appendChild(nameButton);
    
    // Create estate input section
    const estateSection = document.createElement('div');
    estateSection.className = 'intestacy-section intestacy-estate-section';
    estateSection.id = 'intestacy-estate-section';
    estateSection.style.display = 'none';
    
    const estateHeading = document.createElement('h2');
    estateHeading.textContent = 'What is the value of your estate?';
    
    const estateInput = document.createElement('input');
    estateInput.type = 'text';
    estateInput.className = 'intestacy-estate-input';
    estateInput.id = 'intestacy-estate-input';
    estateInput.placeholder = 'Enter estate value (£)';
    
    // Add error message for estate
    const estateError = document.createElement('div');
    estateError.className = 'intestacy-error intestacy-estate-error';
    estateError.id = 'intestacy-estate-error';
    estateError.style.display = 'none';
    
    const estateButton = document.createElement('button');
    estateButton.className = 'intestacy-button intestacy-estate-button';
    estateButton.id = 'intestacy-estate-button';
    estateButton.textContent = 'Continue';
    
    estateSection.appendChild(estateHeading);
    estateSection.appendChild(estateInput);
    estateSection.appendChild(estateError);
    estateSection.appendChild(estateButton);
    
    // Create marital status section
    const statusSection = document.createElement('div');
    statusSection.className = 'intestacy-section intestacy-status-section';
    statusSection.id = 'intestacy-status-section';
    statusSection.style.display = 'none';
    
    const statusHeading = document.createElement('h2');
    statusHeading.textContent = 'What is your marital status?';
    
    const statusOptions = document.createElement('div');
    statusOptions.className = 'intestacy-status-options';
    
    const options = [
      { id: 'married', label: 'Married or in Civil Partnership' },
      { id: 'cohabiting', label: 'Living with Partner (Cohabiting)' },
      { id: 'single', label: 'Single/Divorced/Widowed' }
    ];
    
    options.forEach(option => {
      const optionLabel = document.createElement('label');
      optionLabel.className = 'intestacy-status-option';
      
      const optionInput = document.createElement('input');
      optionInput.type = 'radio';
      optionInput.name = 'marital-status';
      optionInput.value = option.id;
      optionInput.className = 'intestacy-status-input';
      
      const optionText = document.createTextNode(option.label);
      
      optionLabel.appendChild(optionInput);
      optionLabel.appendChild(optionText);
      statusOptions.appendChild(optionLabel);
    });
    
    // Add error message for status
    const statusError = document.createElement('div');
    statusError.className = 'intestacy-error intestacy-status-error';
    statusError.id = 'intestacy-status-error';
    statusError.style.display = 'none';
    
    // Add cohabiting warning
    const cohabitingWarning = document.createElement('div');
    cohabitingWarning.className = 'intestacy-cohabiting-warning';
    cohabitingWarning.id = 'intestacy-cohabiting-warning';
    cohabitingWarning.innerHTML = '<strong>Warning:</strong> As a cohabiting partner, you have no automatic inheritance rights under UK law.';
    cohabitingWarning.style.display = 'none';
    
    const statusButton = document.createElement('button');
    statusButton.className = 'intestacy-button intestacy-status-button';
    statusButton.id = 'intestacy-status-button';
    statusButton.textContent = 'Continue';
    
    statusSection.appendChild(statusHeading);
    statusSection.appendChild(statusOptions);
    statusSection.appendChild(statusError);
    statusSection.appendChild(cohabitingWarning);
    statusSection.appendChild(statusButton);
    
    // Create question section
    const questionSection = document.createElement('div');
    questionSection.className = 'intestacy-section intestacy-question-section';
    questionSection.id = 'intestacy-question-section';
    questionSection.style.display = 'none';
    
    const questionHeading = document.createElement('h2');
    questionHeading.className = 'intestacy-question-heading';
    questionHeading.id = 'intestacy-question-heading';
    questionHeading.textContent = 'Family Information';
    
    const questionText = document.createElement('div');
    questionText.className = 'intestacy-question-text';
    questionText.id = 'intestacy-question-text';
    
    const questionOptions = document.createElement('div');
    questionOptions.className = 'intestacy-question-options';
    questionOptions.id = 'intestacy-question-options';
    
    const questionError = document.createElement('div');
    questionError.className = 'intestacy-error intestacy-question-error';
    questionError.id = 'intestacy-question-error';
    questionError.style.display = 'none';
    
    const questionButtons = document.createElement('div');
    questionButtons.className = 'intestacy-question-buttons';
    
    const yesButton = document.createElement('button');
    yesButton.className = 'intestacy-button intestacy-yes-button';
    yesButton.id = 'intestacy-yes-button';
    yesButton.textContent = 'Yes';
    
    const noButton = document.createElement('button');
    noButton.className = 'intestacy-button intestacy-no-button';
    noButton.id = 'intestacy-no-button';
    noButton.textContent = 'No';
    
    questionButtons.appendChild(yesButton);
    questionButtons.appendChild(noButton);
    
    questionSection.appendChild(questionHeading);
    questionSection.appendChild(questionText);
    questionSection.appendChild(questionOptions);
    questionSection.appendChild(questionError);
    questionSection.appendChild(questionButtons);
    
    // Create result section
    const resultSection = document.createElement('div');
    resultSection.className = 'intestacy-section intestacy-result-section';
    resultSection.id = 'intestacy-result-section';
    resultSection.style.display = 'none';
    
    const resultHeading = document.createElement('h2');
    resultHeading.textContent = 'Inheritance Distribution';
    
    const resultContent = document.createElement('div');
    resultContent.className = 'intestacy-result-content';
    resultContent.id = 'intestacy-result-content';
    
    const restartButton = document.createElement('button');
    restartButton.className = 'intestacy-button intestacy-restart-button';
    restartButton.id = 'intestacy-restart';
    restartButton.textContent = 'Start Again';
    
    resultSection.appendChild(resultHeading);
    resultSection.appendChild(resultContent);
    resultSection.appendChild(restartButton);
    
    // Create footer with legal disclaimer
    const footer = document.createElement('div');
    footer.className = 'intestacy-footer';
    
    const disclaimer = document.createElement('p');
    disclaimer.className = 'intestacy-disclaimer';
    disclaimer.innerHTML = 'This calculator provides a simplified view of intestacy rules in England and Wales. The actual distribution may vary based on specific circumstances. This is not legal advice.';
    
    footer.appendChild(disclaimer);
    
    // Add contact information if provided
    if (this.options.contactInfo) {
      const contactInfo = document.createElement('div');
      contactInfo.className = 'intestacy-contact-info';
      contactInfo.innerHTML = this.options.contactInfo;
      
      footer.appendChild(contactInfo);
    }
    
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
      statusOptions: statusOptions,
      statusInputs: statusOptions.querySelectorAll('input[name="marital-status"]'),
      statusButton: statusButton,
      statusError: statusError,
      cohabitingWarning: cohabitingWarning,
      questionSection: questionSection,
      questionHeading: questionHeading,
      questionText: questionText,
      questionOptions: questionOptions,
      questionError: questionError,
      yesButton: yesButton,
      noButton: noButton,
      resultSection: resultSection,
      resultContent: resultContent,
      restartButton: restartButton
    };
  }
  
  /**
   * Add event listeners to UI elements
   */
  addEventListeners() {
    // Name button click
    this.elements.nameButton.addEventListener('click', () => {
      this.handleNameSubmit();
    });
    
    // Name input enter key
    this.elements.nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleNameSubmit();
      }
    });
    
    // Estate button click
    this.elements.estateButton.addEventListener('click', () => {
      this.handleEstateSubmit();
    });
    
    // Estate input enter key
    this.elements.estateInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleEstateSubmit();
      }
    });
    
    // Status button click
    this.elements.statusButton.addEventListener('click', () => {
      this.handleStatusSubmit();
    });
    
    // Yes button click
    this.elements.yesButton.addEventListener('click', () => {
      this.handleQuestionAnswer(true);
    });
    
    // No button click
    this.elements.noButton.addEventListener('click', () => {
      this.handleQuestionAnswer(false);
    });
    
    // Restart button click
    this.elements.restartButton.addEventListener('click', () => {
      this.reset();
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
      return;
    }
    
    // Store the name
    this.state.name = name;
    this.calculator.state.name = name;
    
    // Clear error
    this.elements.nameError.style.display = 'none';
    
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
    
    // Focus on input
    setTimeout(() => this.elements.estateInput.focus(), 300);
  }
  
  /**
   * Handle estate value input submission
   */
  handleEstateSubmit() {
    const estateValueRaw = this.elements.estateInput.value.trim();
    
    // Remove currency symbols and commas
    const estateValue = estateValueRaw.replace(/[£$,]/g, '');
    
    // Validate
    if (!estateValue) {
      this.elements.estateError.textContent = 'Please enter your estate value';
      this.elements.estateError.style.display = 'block';
      return;
    }
    
    const numValue = parseFloat(estateValue);
    if (isNaN(numValue) || numValue <= 0) {
      this.elements.estateError.textContent = 'Please enter a valid positive number';
      this.elements.estateError.style.display = 'block';
      return;
    }
    
    // Store the estate value
    this.state.estateValue = numValue;
    this.calculator.state.estateValue = numValue;
    
    // Clear error
    this.elements.estateError.style.display = 'none';
    
    // Move to next step
    this.showStatusInput();
  }
  
  /**
   * Show the relationship status input step
   */
  showStatusInput() {
    this.elements.nameSection.style.display = 'none';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'block';
    this.elements.questionSection.style.display = 'none';
    this.elements.resultSection.style.display = 'none';
  }
  
  /**
   * Handle relationship status submission
   */
  handleStatusSubmit() {
    let selectedStatus = '';
    
    // Find selected status
    const statusInputs = this.elements.statusInputs;
    statusInputs.forEach(input => {
      if (input.checked) {
        selectedStatus = input.value;
      }
    });
    
    if (!selectedStatus) {
      this.elements.statusError.textContent = 'Please select your marital status';
      this.elements.statusError.style.display = 'block';
      return;
    }
    
    // Store the status
    this.state.marriageStatus = selectedStatus;
    
    // Clear error
    this.elements.statusError.style.display = 'none';
    
    // Update calculator with the appropriate marital status
    if (selectedStatus === 'married') {
      this.calculator.state.married = true;
      this.calculator.state.cohabiting = false;
      this.elements.cohabitingWarning.style.display = 'none';
    } else if (selectedStatus === 'cohabiting') {
      this.calculator.state.married = false;
      this.calculator.state.cohabiting = true;
      
      // Update and show the cohabiting warning with clearer message
      this.elements.cohabitingWarning.innerHTML = '<strong>Warning:</strong> As a cohabiting partner, you have no automatic inheritance rights under UK law.';
      this.elements.cohabitingWarning.style.display = 'block';
    } else {
      // Single
      this.calculator.state.married = false;
      this.calculator.state.cohabiting = false;
      this.elements.cohabitingWarning.style.display = 'none';
    }
    
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
   * Show a question
   * @param {string} questionId - The ID of the question to show
   */
  showQuestion(questionId) {
    this.state.currentQuestionId = questionId;
    
    // Get the question text from the calculator
    const questionObj = this.calculator.questionMap[questionId];
    const questionText = questionObj ? questionObj.text : "Unknown question";
    
    // Update the question text
    this.elements.questionText.textContent = questionText;
    
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
      // Move the warning to the question section so it's visible
      this.elements.questionSection.insertBefore(this.elements.cohabitingWarning, this.elements.questionHeading);
    }
    
    // Clear any previous error
    this.elements.questionError.style.display = 'none';
  }
  
  /**
   * Show the result
   */
  showResult() {
    // Calculate distribution - now returns object with text and data
    const distribution = this.calculator.calculateDistribution();
    
    // Get estate value for display
    const estateValue = this.calculator.formatCurrency(this.state.estateValue);
    
    // Format result with rich text and structured sections
    // We'll handle the cohabiting warning separately, not in the HTML
    let formattedResult = `
      <h2>Distribution Results for ${this.state.name}</h2>
      
      <div class="intestacy-result-summary">
        <p><strong>Estate Value:</strong> ${estateValue}</p>
      </div>
      
      <div class="intestacy-result-details">
        <h3>Detailed Distribution</h3>
        ${this.formatDistributionDetails(distribution.data)}
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
  }
  
  /**
   * Format distribution details for display
   * @param {Object} distributionData - Distribution data
   * @returns {string} - HTML string with formatted details
   */
  formatDistributionDetails(distributionData) {
    if (!distributionData || !distributionData.shares || distributionData.shares.length === 0) {
      return '<p>No distribution data available.</p>';
    }
    
    // Format as list with percentages and amounts
    const totalValue = distributionData.totalValue || 
      distributionData.shares.reduce((sum, share) => sum + share, 0);
    
    // Include the summary text from the distribution calculation but remove the duplicated warning
    let summaryText = distributionData.text || '';
    
    // Remove any cohabiting warning div from the text to avoid duplication
    summaryText = summaryText.replace(/<div class="intestacy-cohabiting-warning">.*?<\/div>/s, '');
    
    const summaryHtml = `<p>${summaryText}</p>`;
    
    let html = summaryHtml + '<ul class="intestacy-distribution-list">';
    
    for (let i = 0; i < distributionData.shares.length; i++) {
      const share = distributionData.shares[i];
      const label = distributionData.labels[i];
      const percentage = (share / totalValue * 100).toFixed(1);
      const formattedShare = this.calculator.formatCurrency(share);
      
      html += `
        <li>
          <span class="intestacy-recipient">${label}:</span> 
          <span class="intestacy-amount">${formattedShare}</span>
          <span class="intestacy-percentage">(${percentage}%)</span>
        </li>
      `;
    }
    
    html += '</ul>';
    
    // Add disclaimer at the end
    html += `
      <div class="intestacy-result-disclaimer">
        <p>This is a simplified calculation based on the intestacy rules in England and Wales. 
        The actual distribution may be more complex depending on specific circumstances.</p>
        <p>To ensure your assets are distributed according to your wishes, consider creating a Will.</p>
      </div>
    `;
    
    return html;
  }
  
  /**
   * Handle question answer
   * @param {boolean} answer - The user's answer (true for Yes, false for No)
   */
  handleQuestionAnswer(answer) {
    // Process the answer and get the next question or null if done
    const nextQuestionId = this.calculator.processAnswer(this.state.currentQuestionId, answer);
    
    // Store the answer
    this.state.answers[this.state.currentQuestionId] = answer;
    
    // Special handling for siblingsDeceasedWithChildren - ensure it goes to the result if we're stuck
    if (this.state.currentQuestionId === 'siblingsDeceasedWithChildren') {
      this.showResult();
      return;
    }
    
    if (nextQuestionId) {
      // Show the next question
      this.showQuestion(nextQuestionId);
    } else {
      // We have enough information to determine distribution
      this.showResult();
    }
  }
  
  /**
   * Reset the calculator to initial state
   */
  reset() {
    // Reset the state
    this.state = {
      name: '',
      estateValue: 0,
      marriageStatus: '',
      currentQuestionId: '',
      answers: {}
    };
    
    // Reset the calculator
    this.calculator = new IntestacyCalculator();
    
    // Clear inputs
    this.elements.nameInput.value = '';
    this.elements.estateInput.value = '';
    
    // Uncheck all radio buttons
    this.elements.statusInputs.forEach(input => {
      input.checked = false;
    });
    
    // Clear all errors
    this.elements.nameError.style.display = 'none';
    this.elements.estateError.style.display = 'none';
    this.elements.statusError.style.display = 'none';
    this.elements.questionError.style.display = 'none';
    
    // Hide all sections first
    this.hideAllSections();
    
    // Update progress bar
    if (this.elements.progressBar) {
      this.elements.progressBar.style.width = '0%';
    }
    
    // Reset active step in progress indicator
    if (this.elements.steps) {
      const steps = this.elements.steps;
      for (let i = 0; i < steps.length; i++) {
        steps[i].classList.remove('intestacy-step-active');
        steps[i].classList.remove('intestacy-step-complete');
      }
      // Set first step as active
      if (steps.length > 0) {
        steps[0].classList.add('intestacy-step-active');
      }
    }
    
    // Show the name input step
    this.showNameInput();
  }
}

// Export the class for use in other modules
export default IntestacyUI;