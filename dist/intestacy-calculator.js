(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.IntestacyWidget = factory());
})(this, (function () { 'use strict';

  /**
   * IntestacyCalculator.js
   * Core logic for the UK intestacy calculator
   */

  class IntestacyCalculator {
    constructor() {
      // Updated to the latest statutory legacy amount
      this.STATUTORY_LEGACY = 322000.00;

      // Initialize state
      this.state = {
        name: null,
        estateValue: null,
        married: null,
        cohabiting: null,
        // New property for cohabiting status
        children: null,
        grandchildren: null,
        greatGrandchildren: null,
        parentsAlive: null,
        siblings: null,
        fullSiblings: null,
        halfSiblings: null,
        grandparents: null,
        auntsUncles: null,
        fullAuntsUncles: null,
        halfAuntsUncles: null,
        currentQuestion: 0,
        childrenDeceased: null,
        deceasedChildrenHadChildren: null,
        siblingsDeceasedWithChildren: null,
        auntsUnclesDeceasedWithChildren: null
      };

      // Define questions
      this.questions = [{
        id: "married",
        text: "Are you married or in a civil partnership?"
      }, {
        id: "children",
        text: "Do you have any children?"
      }, {
        id: "childrenDeceased",
        text: "Are any of your children deceased?"
      }, {
        id: "deceasedChildrenHadChildren",
        text: "Did any of your deceased children have children of their own?"
      }, {
        id: "parentsAlive",
        text: "Are either of your parents alive?"
      }, {
        id: "siblings",
        text: "Do you have any siblings?"
      }, {
        id: "fullSiblings",
        text: "Do you have any full siblings (same two parents)?"
      }, {
        id: "siblingsDeceasedWithChildren",
        text: "Are any of your siblings deceased with children of their own?"
      }, {
        id: "halfSiblings",
        text: "Do you have any half siblings (one shared parent)?"
      }, {
        id: "grandparents",
        text: "Do you have any living grandparents?"
      }, {
        id: "auntsUncles",
        text: "Do you have any living aunts or uncles?"
      }, {
        id: "fullAuntsUncles",
        text: "Do you have any full aunts or uncles (siblings of your parents)?"
      }, {
        id: "auntsUnclesDeceasedWithChildren",
        text: "Are any of your aunts or uncles deceased with children of their own?"
      }, {
        id: "halfAuntsUncles",
        text: "Do you have any half aunts or uncles (half-siblings of your parents)?"
      }];

      // Create a lookup for questions by ID
      this.questionMap = this.createQuestionMap();

      // Define the question flow logic
      this.questionFlow = this.defineQuestionFlow();
    }

    /**
     * Create a map of questions by ID for easy lookup
     */
    createQuestionMap() {
      const map = {};
      this.questions.forEach(question => {
        map[question.id] = question;
      });
      return map;
    }

    /**
     * Define the question flow logic
     */
    defineQuestionFlow() {
      return {
        "married": answer => answer ? "children" : "children",
        "children": answer => answer ? "childrenDeceased" : "parentsAlive",
        "childrenDeceased": answer => answer ? "deceasedChildrenHadChildren" : null,
        "deceasedChildrenHadChildren": answer => null,
        "parentsAlive": answer => answer ? null : "siblings",
        "siblings": answer => answer ? "fullSiblings" : "grandparents",
        "fullSiblings": answer => answer ? "siblingsDeceasedWithChildren" : "halfSiblings",
        "siblingsDeceasedWithChildren": answer => null,
        "halfSiblings": answer => null,
        "grandparents": answer => answer ? null : "auntsUncles",
        "auntsUncles": answer => answer ? "fullAuntsUncles" : null,
        "fullAuntsUncles": answer => answer ? "auntsUnclesDeceasedWithChildren" : "halfAuntsUncles",
        "auntsUnclesDeceasedWithChildren": answer => null,
        "halfAuntsUncles": answer => null
      };
    }

    /**
     * Validate the estate value input
     * @param {number} value - The estate value to validate
     * @returns {Object} - Object with isValid and errorMessage properties
     */
    validateEstateValue(value) {
      try {
        if (value === null || value === undefined) {
          return {
            isValid: false,
            errorMessage: "Please enter your estate value"
          };
        }
        value = parseFloat(value);
        if (isNaN(value)) {
          return {
            isValid: false,
            errorMessage: "Please enter a valid number"
          };
        }
        if (value <= 0) {
          return {
            isValid: false,
            errorMessage: "Your estate value must be greater than £0"
          };
        }
        return {
          isValid: true,
          errorMessage: ""
        };
      } catch (error) {
        return {
          isValid: false,
          errorMessage: "Please enter a valid number"
        };
      }
    }

    /**
     * Format amount as currency with £ symbol
     * @param {number} amount - The amount to format
     * @returns {string} - Formatted currency string
     */
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
      }).format(amount);
    }

    /**
     * Calculate the distribution of the estate based on the current state
     * @returns {string} - Description of how the estate will be distributed
     */
    calculateDistribution() {
      const estateValue = parseFloat(this.state.estateValue);
      const formattedValue = this.formatCurrency(estateValue);

      // Cohabiting warning - check this before spouse rules
      if (this.state.cohabiting) {
        return `<div class="intestacy-cohabiting-warning">` + `Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law.` + `</div>\n\n` + `Your estate of ${formattedValue} will be distributed as follows:\n` + `• Your cohabiting partner will not automatically inherit anything\n` + `• Your estate will pass to your relatives according to intestacy rules:\n` + this.getInheritanceHierarchyText(estateValue) + `\n\nTo protect your partner, you should create a valid Will.`;
      }

      // Spouse rules
      if (this.state.married) {
        if (!this.state.children) {
          return `Your entire estate of ${formattedValue} will pass to your spouse/civil partner.`;
        } else {
          if (estateValue <= this.STATUTORY_LEGACY) {
            return `Your entire estate of ${formattedValue} will pass to your spouse/civil partner.`;
          }
          const remainder = estateValue - this.STATUTORY_LEGACY;
          const spouseShare = this.STATUTORY_LEGACY + remainder / 2;
          const childrenShare = remainder / 2;

          // Improved text for per stirpes distribution
          const childrenText = !this.state.childrenDeceased ? "children" : "living children and the children of your deceased children (who will share their parent's portion per stirpes)";
          return `Your estate will be distributed as follows:\n` + `• Your spouse/civil partner will receive: ${this.formatCurrency(spouseShare)}\n` + `  - First ${this.formatCurrency(this.STATUTORY_LEGACY)} as statutory legacy\n` + `  - Plus ${this.formatCurrency(remainder / 2)} (half of the remainder)\n` + `• Your ${childrenText} will share: ${this.formatCurrency(childrenShare)}`;
        }
      }

      // Non-spouse rules in strict order of precedence
      if (this.state.children) {
        const childrenText = !this.state.childrenDeceased ? "children" : "living children and the children of your deceased children (who will share their parent's portion per stirpes)";
        return `Your entire estate of ${formattedValue} will be divided equally between your ${childrenText}.`;
      }
      if (this.state.parentsAlive) {
        return `Your entire estate of ${formattedValue} will pass to your surviving parent(s) in equal shares.`;
      }

      // Improved sibling handling with full vs half distinction
      if (this.state.siblings) {
        if (this.state.fullSiblings) {
          const siblingType = "full siblings";
          const childrenText = this.state.siblingsDeceasedWithChildren ? " (their children will inherit their share per stirpes)" : "";
          return `Your entire estate of ${formattedValue} will be divided equally between your ${siblingType}${childrenText}.`;
        } else if (this.state.halfSiblings) {
          return `Your entire estate of ${formattedValue} will be divided equally between your half-siblings.`;
        }
      }
      if (this.state.grandparents) {
        return `Your entire estate of ${formattedValue} will be divided equally between your grandparents.`;
      }

      // Improved aunts/uncles handling with full vs half distinction
      if (this.state.auntsUncles) {
        if (this.state.fullAuntsUncles) {
          const auntsText = "aunts and uncles";
          const childrenText = this.state.auntsUnclesDeceasedWithChildren ? " (their children will inherit their share per stirpes)" : "";
          return `Your entire estate of ${formattedValue} will be divided equally between your ${auntsText}${childrenText}.`;
        } else if (this.state.halfAuntsUncles) {
          return `Your entire estate of ${formattedValue} will be divided equally between your half-aunts and half-uncles.`;
        }
      }
      return `Your estate of ${formattedValue} will pass to the Crown (Bona Vacantia).`;
    }

    /**
     * Process the user's answer to a specific question and determine the next question
     * @param {string} questionId - The ID of the question being answered
     * @param {boolean} answer - The user's answer (true for Yes, false for No)
     * @returns {string|null} - The ID of the next question to ask, or null if we have enough information
     */
    processAnswer(questionId, answer) {
      // Update the state with the user's answer
      this.state[questionId] = answer;

      // Determine the next question based on the flow logic
      if (this.questionFlow[questionId]) {
        const nextQuestionId = this.questionFlow[questionId](answer);
        return nextQuestionId;
      }
      return null;
    }

    /**
     * Get the text for a specific question by ID
     * @param {string} questionId - The ID of the question
     * @returns {string} - The question text
     */
    getQuestionText(questionId) {
      if (this.questionMap[questionId]) {
        return this.questionMap[questionId].text;
      }
      return "Unknown question";
    }

    /**
     * Generate text describing the inheritance hierarchy for cohabiting cases
     * @param {number} estateValue - The value of the estate
     * @returns {string} - Description of how the estate will be distributed
     */
    getInheritanceHierarchyText(estateValue) {
      const formattedValue = this.formatCurrency(estateValue);
      if (this.state.children) {
        const childrenText = !this.state.childrenDeceased ? "children" : "living children and the children of your deceased children (who will share their parent's portion per stirpes)";
        return `  - Your entire estate of ${formattedValue} will be divided equally between your ${childrenText}.`;
      }
      if (this.state.parentsAlive) {
        return `  - Your entire estate of ${formattedValue} will pass to your surviving parent(s) in equal shares.`;
      }
      if (this.state.siblings) {
        if (this.state.fullSiblings) {
          const siblingType = "full siblings";
          const childrenText = this.state.siblingsDeceasedWithChildren ? " (their children will inherit their share per stirpes)" : "";
          return `  - Your entire estate of ${formattedValue} will be divided equally between your ${siblingType}${childrenText}.`;
        } else if (this.state.halfSiblings) {
          return `  - Your entire estate of ${formattedValue} will be divided equally between your half-siblings.`;
        }
      }
      if (this.state.grandparents) {
        return `  - Your entire estate of ${formattedValue} will be divided equally between your grandparents.`;
      }
      if (this.state.auntsUncles) {
        if (this.state.fullAuntsUncles) {
          const auntsText = "aunts and uncles";
          const childrenText = this.state.auntsUnclesDeceasedWithChildren ? " (their children will inherit their share per stirpes)" : "";
          return `  - Your entire estate of ${formattedValue} will be divided equally between your ${auntsText}${childrenText}.`;
        } else if (this.state.halfAuntsUncles) {
          return `  - Your entire estate of ${formattedValue} will be divided equally between your half-aunts and half-uncles.`;
        }
      }
      return `  - Your estate of ${formattedValue} will pass to the Crown (Bona Vacantia).`;
    }

    /**
     * Check if we have enough information to determine distribution
     * @returns {boolean} - True if we can determine distribution, false otherwise
     */
    canDetermineDistribution() {
      if (this.state.married && !this.state.children) {
        return true;
      }
      if (this.state.children) {
        return this.state.childrenDeceased !== null && (!this.state.childrenDeceased || this.state.deceasedChildrenHadChildren !== null);
      }

      // Check the full hierarchy
      return [this.state.parentsAlive !== null && this.state.parentsAlive, this.state.fullSiblings !== null && this.state.fullSiblings, this.state.halfSiblings !== null && this.state.halfSiblings, this.state.grandparents !== null && this.state.grandparents, this.state.fullAuntsUncles !== null && this.state.fullAuntsUncles, this.state.halfAuntsUncles !== null && this.state.halfAuntsUncles].some(condition => condition);
    }
  }

  /**
   * ValidationUtils.js
   * Utility functions for input validation
   */

  /**
   * Validate an estate value
   * @param {number|string} value - The estate value to validate
   * @returns {Object} - Object with isValid and errorMessage properties
   */
  function validateEstateValue(value) {
    try {
      if (value === null || value === undefined || value === '') {
        return {
          isValid: false,
          errorMessage: "Please enter your estate value"
        };
      }
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(numValue)) {
        return {
          isValid: false,
          errorMessage: "Please enter a valid number"
        };
      }
      if (numValue <= 0) {
        return {
          isValid: false,
          errorMessage: "Your estate value must be greater than £0"
        };
      }
      return {
        isValid: true,
        errorMessage: ""
      };
    } catch (error) {
      return {
        isValid: false,
        errorMessage: "Please enter a valid number"
      };
    }
  }

  /**
   * Validate a name input
   * @param {string} value - The name to validate
   * @returns {Object} - Object with isValid and errorMessage properties
   */
  function validateName(value) {
    if (!value || value.trim() === '') {
      return {
        isValid: false,
        errorMessage: "Please enter your name"
      };
    }
    if (value.trim().length < 2) {
      return {
        isValid: false,
        errorMessage: "Name must be at least 2 characters"
      };
    }
    return {
      isValid: true,
      errorMessage: ""
    };
  }

  /**
   * IntestacyUI.js
   * Main UI controller for the intestacy calculator
   */

  class IntestacyUI {
    /**
     * Create a new IntestacyUI instance
     * @param {HTMLElement|string} container - The container element or selector
     * @param {Object} options - Configuration options
     */
    constructor(container, options = {}) {
      // Get the container element
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
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
      this.elements.nameInput.addEventListener('keypress', event => {
        if (event.key === 'Enter') {
          this.handleContinue();
        }
      });

      // Estate input enter key
      this.elements.estateInput.addEventListener('keypress', event => {
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
      this.calculator.state.married = selectedStatus === 'married';
      this.calculator.state.cohabiting = selectedStatus === 'cohabiting';

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
      const isYes = selectedAnswer === 'Yes';

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

  /**
   * IntestacyWidget.js
   * Main widget for embedding the intestacy calculator
   */

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
      this.ui = new IntestacyUI(this.options.container, {
        theme: this.options.theme,
        contactInfo: this.options.contactInfo,
        contactPhone: this.options.contactPhone,
        contactEmail: this.options.contactEmail
      });
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

  return IntestacyWidget;

}));
//# sourceMappingURL=intestacy-calculator.js.map
