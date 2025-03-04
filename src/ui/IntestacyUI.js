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
      ...options
    };
    
    // Create calculator instance
    this.calculator = new IntestacyCalculator();
    
    // UI state
    this.state = {
      currentStep: 'name',
      questionId: null,
      name: '',
      estateValue: null
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
    this.applyTheme();
    
    // Show the first step (name input)
    this.showNameInput();
  }
  
  /**
   * Create the UI structure
   */
  createUIStructure() {
    // Clear the container
    this.container.innerHTML = '';
    
    // Add CSS class to container
    this.container.classList.add('intestacy-calculator');
    
    // Set contact info
    this.options.contactPhone = this.options.contactPhone || '0123 456 7890';
    this.options.contactEmail = this.options.contactEmail || 'info@example.com';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'intestacy-header';
    header.innerHTML = `
      <h1>UK Intestacy Calculator</h1>
      <p>Find out how your estate would be distributed if you die without a will</p>
    `;
    this.container.appendChild(header);
    
    
    // Create cohabiting warning (hidden by default)
    const cohabitingWarning = document.createElement('div');
    cohabitingWarning.className = 'intestacy-cohabiting-warning';
    cohabitingWarning.style.display = 'none';
    cohabitingWarning.innerHTML = `
      <strong>WARNING:</strong> As a cohabiting partner, you have NO automatic inheritance rights under UK law.
      <p>Your partner will NOT automatically inherit anything from your estate if you die without a will.</p>
      <p>To protect your partner, you should create a valid Will as soon as possible.</p>
      <p class="intestacy-contact-highlight">Contact our firm at <strong>${this.options.contactPhone}</strong> or <strong>${this.options.contactEmail}</strong> to discuss creating a Will.</p>
    `;
    this.container.appendChild(cohabitingWarning);
    this.elements.cohabitingWarning = cohabitingWarning;
    // Create main content area
    const content = document.createElement('div');
    content.className = 'intestacy-content';
    this.container.appendChild(content);
    this.elements.content = content;
    
    // Create name input
    const nameSection = document.createElement('div');
    nameSection.className = 'intestacy-section intestacy-name-section';
    nameSection.innerHTML = `
      <label for="intestacy-name">What is your name?</label>
      <input type="text" id="intestacy-name" placeholder="Enter your full name">
      <div class="intestacy-error" id="intestacy-name-error"></div>
    `;
    content.appendChild(nameSection);
    this.elements.nameSection = nameSection;
    this.elements.nameInput = nameSection.querySelector('#intestacy-name');
    this.elements.nameError = nameSection.querySelector('#intestacy-name-error');
    
    // Create estate value input
    const estateSection = document.createElement('div');
    estateSection.className = 'intestacy-section intestacy-estate-section';
    estateSection.innerHTML = `
      <label for="intestacy-estate">What is the approximate value of your estate (£)?</label>
      <input type="number" id="intestacy-estate" placeholder="Enter value in pounds">
      <div class="intestacy-error" id="intestacy-estate-error"></div>
    `;
    content.appendChild(estateSection);
    this.elements.estateSection = estateSection;
    this.elements.estateInput = estateSection.querySelector('#intestacy-estate');
    this.elements.estateError = estateSection.querySelector('#intestacy-estate-error');
    
    // Create status input
    const statusSection = document.createElement('div');
    statusSection.className = 'intestacy-section intestacy-status-section';
    statusSection.innerHTML = `
      <label>What is your relationship status?</label>
      <div class="intestacy-radio-group">
        <label>
          <input type="radio" name="intestacy-status" value="single"> Single
        </label>
        <label>
          <input type="radio" name="intestacy-status" value="married"> Married/Civil Partnership
        </label>
        <label>
          <input type="radio" name="intestacy-status" value="cohabiting"> Co-habiting
        </label>
        <label>
          <input type="radio" name="intestacy-status" value="divorced"> Divorced
        </label>
        <label>
          <input type="radio" name="intestacy-status" value="widowed"> Widowed
        </label>
      </div>
    `;
    content.appendChild(statusSection);
    this.elements.statusSection = statusSection;
    this.elements.statusInputs = statusSection.querySelectorAll('input[name="intestacy-status"]');
    
    // Create question section
    const questionSection = document.createElement('div');
    questionSection.className = 'intestacy-section intestacy-question-section';
    questionSection.innerHTML = `
      <div class="intestacy-question" id="intestacy-question-text"></div>
      <div class="intestacy-radio-group">
        <label>
          <input type="radio" name="intestacy-answer" value="Yes"> Yes
        </label>
        <label>
          <input type="radio" name="intestacy-answer" value="No"> No
        </label>
      </div>
    `;
    content.appendChild(questionSection);
    this.elements.questionSection = questionSection;
    this.elements.questionText = questionSection.querySelector('#intestacy-question-text');
    this.elements.answerInputs = questionSection.querySelectorAll('input[name="intestacy-answer"]');
    
    // Create result section
    const resultSection = document.createElement('div');
    resultSection.className = 'intestacy-section intestacy-result-section';
    resultSection.innerHTML = `
      <div class="intestacy-result" id="intestacy-result"></div>
      <div class="intestacy-next-steps">
        <h2>What Next?</h2>
        <p>Having a proper Will is the only way to ensure your estate is distributed according to your wishes.</p>
        <div id="intestacy-contact-info"></div>
      </div>
    `;
    content.appendChild(resultSection);
    this.elements.resultSection = resultSection;
    this.elements.result = resultSection.querySelector('#intestacy-result');
    this.elements.contactInfo = resultSection.querySelector('#intestacy-contact-info');
    
    // Create buttons
    const buttonSection = document.createElement('div');
    buttonSection.className = 'intestacy-buttons';
    buttonSection.innerHTML = `
      <button type="button" id="intestacy-continue">Continue</button>
      <button type="button" id="intestacy-restart">Start Again</button>
    `;
    this.container.appendChild(buttonSection);
    this.elements.continueButton = buttonSection.querySelector('#intestacy-continue');
    this.elements.restartButton = buttonSection.querySelector('#intestacy-restart');
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'intestacy-footer';
    footer.innerHTML = `
      <p><strong>Legal Disclaimer:</strong> This calculator provides guidance based on UK intestacy rules. 
      For legal advice, please consult a qualified professional.</p>
    `;
    this.container.appendChild(footer);
    
    // Hide sections initially
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'none';
    this.elements.questionSection.style.display = 'none';
    this.elements.resultSection.style.display = 'none';
  }
  
  /**
   * Add event listeners to UI elements
   */
  addEventListeners() {
    // Continue button
    this.elements.continueButton.addEventListener('click', () => {
      this.handleContinue();
    });
    
    // Restart button
    this.elements.restartButton.addEventListener('click', () => {
      this.handleRestart();
    });
    
    // Name input enter key
    this.elements.nameInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.handleContinue();
      }
    });
    
    // Estate input enter key
    this.elements.estateInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.handleContinue();
      }
    });
  }
  
  /**
   * Apply the selected theme
   */
  applyTheme() {
    this.container.classList.add(`intestacy-theme-${this.options.theme}`);
  }
  
  /**
   * Show the name input step
   */
  showNameInput() {
    // Update state
    this.state.currentStep = 'name';
    
    // Show/hide sections
    this.elements.nameSection.style.display = 'block';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'none';
    this.elements.questionSection.style.display = 'none';
    this.elements.resultSection.style.display = 'none';
    
    // Focus on input
    this.elements.nameInput.focus();
  }
  
  /**
   * Show the estate value input step
   */
  showEstateInput() {
    // Update state
    this.state.currentStep = 'estate';
    
    // Show/hide sections
    this.elements.nameSection.style.display = 'none';
    this.elements.estateSection.style.display = 'block';
    this.elements.statusSection.style.display = 'none';
    this.elements.questionSection.style.display = 'none';
    this.elements.resultSection.style.display = 'none';
    
    // Focus on input
    this.elements.estateInput.focus();
  }
  
  /**
   * Show the relationship status input step
   */
  showStatusInput() {
    // Update state
    this.state.currentStep = 'status';
    
    // Show/hide sections
    this.elements.nameSection.style.display = 'none';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'block';
    this.elements.questionSection.style.display = 'none';
    this.elements.resultSection.style.display = 'none';
  }
  
  /**
   * Show a question
   * @param {string} questionId - The ID of the question to show
   */
  showQuestion(questionId) {
    // Update state
    this.state.currentStep = 'question';
    this.state.questionId = questionId;
    
    // Update question text
    this.elements.questionText.textContent = this.calculator.getQuestionText(questionId);
    
    // Clear previous answer
    this.elements.answerInputs.forEach(input => {
      input.checked = false;
    });
    
    // Show/hide sections
    this.elements.nameSection.style.display = 'none';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'none';
    this.elements.questionSection.style.display = 'block';
    this.elements.resultSection.style.display = 'none';
    
    // Ensure cohabiting warning remains visible if applicable
    if (this.calculator.state.cohabiting) {
      this.elements.cohabitingWarning.style.display = 'block';
    }
  }
  
  /**
   * Show the result
   */
  showResult() {
    // Calculate distribution
    const resultText = this.calculator.calculateDistribution();
    
    // Format result with name
    const formattedResult = `
      <h2>Distribution Results for ${this.state.name}</h2>
      <p>${resultText}</p>
      <p>If you wish to change this distribution, you will need to create a Will.</p>
    `;
    
    // Update result text
    this.elements.result.innerHTML = formattedResult;
    
    // Update contact info
    if (this.calculator.state.cohabiting) {
      // Enhanced contact info for cohabiting partners
      this.elements.contactInfo.innerHTML = `
        <strong>URGENT:</strong> As a cohabiting partner, creating a Will is essential to protect your partner.
        <br>Contact our firm at <strong>0123 456 7890</strong> or <strong>info@example.com</strong> to discuss creating a Will.
      `;
      
      // Ensure cohabiting warning remains visible
      this.elements.cohabitingWarning.style.display = 'block';
    } else {
      this.elements.contactInfo.textContent = this.options.contactInfo;
    }
    
    // Show/hide sections
    this.elements.nameSection.style.display = 'none';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'none';
    this.elements.questionSection.style.display = 'none';
    this.elements.resultSection.style.display = 'block';
  }
  
  /**
   * Handle the continue button click
   */
  handleContinue() {
    switch (this.state.currentStep) {
      case 'name':
        this.handleNameSubmit();
        break;
      case 'estate':
        this.handleEstateSubmit();
        break;
      case 'status':
        this.handleStatusSubmit();
        break;
      case 'question':
        this.handleQuestionAnswer();
        break;
    }
  }
  
  /**
   * Handle name input submission
   */
  handleNameSubmit() {
    const name = this.elements.nameInput.value;
    const validation = validateName(name);
    
    if (!validation.isValid) {
      this.elements.nameError.textContent = validation.errorMessage;
      return;
    }
    
    // Clear error
    this.elements.nameError.textContent = '';
    
    // Update state
    this.state.name = name;
    
    // Move to next step
    this.showEstateInput();
  }
  
  /**
   * Handle estate value input submission
   */
  handleEstateSubmit() {
    const estateValue = this.elements.estateInput.value;
    const validation = validateEstateValue(estateValue);
    
    if (!validation.isValid) {
      this.elements.estateError.textContent = validation.errorMessage;
      return;
    }
    
    // Clear error
    this.elements.estateError.textContent = '';
    
    // Update state
    this.state.estateValue = parseFloat(estateValue);
    
    // Move to next step
    this.showStatusInput();
  }
  
  /**
   * Handle relationship status submission
   */
  handleStatusSubmit() {
    let selectedStatus = null;
    
    // Find selected status
    this.elements.statusInputs.forEach(input => {
      if (input.checked) {
        selectedStatus = input.value;
      }
    });
    
    if (!selectedStatus) {
      return; // No status selected
    }
    
    // Update calculator state
    this.calculator.state.name = this.state.name;
    this.calculator.state.estateValue = this.state.estateValue;
    this.calculator.state.married = (selectedStatus === 'married');
    this.calculator.state.cohabiting = (selectedStatus === 'cohabiting');
    
    // Show or hide cohabiting warning
    if (selectedStatus === 'cohabiting') {
      this.elements.cohabitingWarning.style.display = 'block';
    } else {
      this.elements.cohabitingWarning.style.display = 'none';
    }
    
    // Start the question flow
    this.showQuestion('children');
  }
  
  /**
   * Handle question answer
   */
  handleQuestionAnswer() {
    let selectedAnswer = null;
    
    // Find selected answer
    this.elements.answerInputs.forEach(input => {
      if (input.checked) {
        selectedAnswer = input.value;
      }
    });
    
    if (!selectedAnswer) {
      return; // No answer selected
    }
    
    const questionId = this.state.questionId;
    const isYes = (selectedAnswer === 'Yes');
    
    // Update the calculator state with this answer
    this.calculator.state[questionId] = isYes;
    
    // Process the answer and get the next question
    const nextQuestionId = this.calculator.processAnswer(questionId, isYes);
    
    // If we have a next question, show it
    if (nextQuestionId) {
      this.showQuestion(nextQuestionId);
    } else {
      // Otherwise, we have enough information to show the result
      this.showResult();
    }
  }
  
  /**
   * Handle restart button click
   */
  handleRestart() {
    // Reset calculator
    this.calculator = new IntestacyCalculator();
    
    // Reset state
    this.state = {
      currentStep: 'name',
      questionId: null,
      name: '',
      estateValue: null
    };
    
    // Reset inputs
    this.elements.nameInput.value = '';
    this.elements.estateInput.value = '';
    this.elements.nameError.textContent = '';
    this.elements.estateError.textContent = '';
    
    this.elements.statusInputs.forEach(input => {
      input.checked = false;
    });
    
    // Hide cohabiting warning
    this.elements.cohabitingWarning.style.display = 'none';
    
    // Show first step
    this.showNameInput();
  }
}

// Export the class for use in other modules
export default IntestacyUI;