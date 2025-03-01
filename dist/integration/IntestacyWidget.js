function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

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
      id: "grandchildren",
      text: "Do you have any grandchildren?"
    }, {
      id: "greatGrandchildren",
      text: "Do you have any great-grandchildren?"
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
    var map = {};
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
      "siblings": answer => answer ? "fullSiblings" : "grandchildren",
      "fullSiblings": answer => answer ? "siblingsDeceasedWithChildren" : "halfSiblings",
      "siblingsDeceasedWithChildren": answer => null,
      "halfSiblings": answer => null,
      "grandchildren": answer => answer ? null : "greatGrandchildren",
      "greatGrandchildren": answer => answer ? null : "grandparents",
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
    var estateValue = parseFloat(this.state.estateValue);
    var formattedValue = this.formatCurrency(estateValue);

    // Spouse rules
    if (this.state.married) {
      if (!this.state.children) {
        return "Your entire estate of ".concat(formattedValue, " will pass to your spouse/civil partner.");
      } else {
        if (estateValue <= this.STATUTORY_LEGACY) {
          return "Your entire estate of ".concat(formattedValue, " will pass to your spouse/civil partner.");
        }
        var remainder = estateValue - this.STATUTORY_LEGACY;
        var spouseShare = this.STATUTORY_LEGACY + remainder / 2;
        var childrenShare = remainder / 2;

        // Improved text for per stirpes distribution
        var childrenText = !this.state.childrenDeceased ? "children" : "living children and the children of your deceased children (who will share their parent's portion per stirpes)";
        return "Your estate will be distributed as follows:\n" + "\u2022 Your spouse/civil partner will receive: ".concat(this.formatCurrency(spouseShare), "\n") + "  - First ".concat(this.formatCurrency(this.STATUTORY_LEGACY), " as statutory legacy\n") + "  - Plus ".concat(this.formatCurrency(remainder / 2), " (half of the remainder)\n") + "\u2022 Your ".concat(childrenText, " will share: ").concat(this.formatCurrency(childrenShare));
      }
    }

    // Non-spouse rules in strict order of precedence
    if (this.state.children) {
      var _childrenText = !this.state.childrenDeceased ? "children" : "living children and the children of your deceased children (who will share their parent's portion per stirpes)";
      return "Your entire estate of ".concat(formattedValue, " will be divided equally between your ").concat(_childrenText, ".");
    }
    if (this.state.parentsAlive) {
      return "Your entire estate of ".concat(formattedValue, " will pass to your surviving parent(s) in equal shares.");
    }

    // Improved sibling handling with full vs half distinction
    if (this.state.siblings) {
      if (this.state.fullSiblings) {
        var siblingType = "full siblings";
        var _childrenText2 = this.state.siblingsDeceasedWithChildren ? " (their children will inherit their share per stirpes)" : "";
        return "Your entire estate of ".concat(formattedValue, " will be divided equally between your ").concat(siblingType).concat(_childrenText2, ".");
      } else if (this.state.halfSiblings) {
        return "Your entire estate of ".concat(formattedValue, " will be divided equally between your half-siblings.");
      }
    }
    if (this.state.grandchildren) {
      return "Your entire estate of ".concat(formattedValue, " will be divided equally between your grandchildren.");
    }
    if (this.state.greatGrandchildren) {
      return "Your entire estate of ".concat(formattedValue, " will be divided equally between your great-grandchildren.");
    }
    if (this.state.grandparents) {
      return "Your entire estate of ".concat(formattedValue, " will be divided equally between your grandparents.");
    }

    // Improved aunts/uncles handling with full vs half distinction
    if (this.state.auntsUncles) {
      if (this.state.fullAuntsUncles) {
        var auntsText = "aunts and uncles";
        var _childrenText3 = this.state.auntsUnclesDeceasedWithChildren ? " (their children will inherit their share per stirpes)" : "";
        return "Your entire estate of ".concat(formattedValue, " will be divided equally between your ").concat(auntsText).concat(_childrenText3, ".");
      } else if (this.state.halfAuntsUncles) {
        return "Your entire estate of ".concat(formattedValue, " will be divided equally between your half-aunts and half-uncles.");
      }
    }
    return "Your estate of ".concat(formattedValue, " will pass to the Crown (Bona Vacantia).");
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
      var nextQuestionId = this.questionFlow[questionId](answer);
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
    return [this.state.parentsAlive !== null && this.state.parentsAlive, this.state.fullSiblings !== null && this.state.fullSiblings, this.state.halfSiblings !== null && this.state.halfSiblings, this.state.grandchildren !== null && this.state.grandchildren, this.state.greatGrandchildren !== null && this.state.greatGrandchildren, this.state.grandparents !== null && this.state.grandparents, this.state.fullAuntsUncles !== null && this.state.fullAuntsUncles, this.state.halfAuntsUncles !== null && this.state.halfAuntsUncles].some(condition => condition);
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
    var numValue = typeof value === 'string' ? parseFloat(value) : value;
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

class IntestacyUI {
  /**
   * Create a new IntestacyUI instance
   * @param {HTMLElement|string} container - The container element or selector
   * @param {Object} options - Configuration options
   */
  constructor(container) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // Get the container element
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) {
      throw new Error('Container element not found');
    }

    // Default options
    this.options = _objectSpread2({
      theme: 'light',
      contactInfo: 'Please contact us to discuss creating a Will.'
    }, options);

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

    // Create header
    var header = document.createElement('div');
    header.className = 'intestacy-header';
    header.innerHTML = "\n      <h1>UK Intestacy Calculator</h1>\n      <p>Find out how your estate would be distributed if you die without a will</p>\n    ";
    this.container.appendChild(header);

    // Create main content area
    var content = document.createElement('div');
    content.className = 'intestacy-content';
    this.container.appendChild(content);
    this.elements.content = content;

    // Create name input
    var nameSection = document.createElement('div');
    nameSection.className = 'intestacy-section intestacy-name-section';
    nameSection.innerHTML = "\n      <label for=\"intestacy-name\">What is your name?</label>\n      <input type=\"text\" id=\"intestacy-name\" placeholder=\"Enter your full name\">\n      <div class=\"intestacy-error\" id=\"intestacy-name-error\"></div>\n    ";
    content.appendChild(nameSection);
    this.elements.nameSection = nameSection;
    this.elements.nameInput = nameSection.querySelector('#intestacy-name');
    this.elements.nameError = nameSection.querySelector('#intestacy-name-error');

    // Create estate value input
    var estateSection = document.createElement('div');
    estateSection.className = 'intestacy-section intestacy-estate-section';
    estateSection.innerHTML = "\n      <label for=\"intestacy-estate\">What is the approximate value of your estate (\xA3)?</label>\n      <input type=\"number\" id=\"intestacy-estate\" placeholder=\"Enter value in pounds\">\n      <div class=\"intestacy-error\" id=\"intestacy-estate-error\"></div>\n    ";
    content.appendChild(estateSection);
    this.elements.estateSection = estateSection;
    this.elements.estateInput = estateSection.querySelector('#intestacy-estate');
    this.elements.estateError = estateSection.querySelector('#intestacy-estate-error');

    // Create status input
    var statusSection = document.createElement('div');
    statusSection.className = 'intestacy-section intestacy-status-section';
    statusSection.innerHTML = "\n      <label>What is your relationship status?</label>\n      <div class=\"intestacy-radio-group\">\n        <label>\n          <input type=\"radio\" name=\"intestacy-status\" value=\"single\"> Single\n        </label>\n        <label>\n          <input type=\"radio\" name=\"intestacy-status\" value=\"married\"> Married/Civil Partnership\n        </label>\n        <label>\n          <input type=\"radio\" name=\"intestacy-status\" value=\"divorced\"> Divorced\n        </label>\n        <label>\n          <input type=\"radio\" name=\"intestacy-status\" value=\"widowed\"> Widowed\n        </label>\n      </div>\n    ";
    content.appendChild(statusSection);
    this.elements.statusSection = statusSection;
    this.elements.statusInputs = statusSection.querySelectorAll('input[name="intestacy-status"]');

    // Create question section
    var questionSection = document.createElement('div');
    questionSection.className = 'intestacy-section intestacy-question-section';
    questionSection.innerHTML = "\n      <div class=\"intestacy-question\" id=\"intestacy-question-text\"></div>\n      <div class=\"intestacy-radio-group\">\n        <label>\n          <input type=\"radio\" name=\"intestacy-answer\" value=\"Yes\"> Yes\n        </label>\n        <label>\n          <input type=\"radio\" name=\"intestacy-answer\" value=\"No\"> No\n        </label>\n      </div>\n    ";
    content.appendChild(questionSection);
    this.elements.questionSection = questionSection;
    this.elements.questionText = questionSection.querySelector('#intestacy-question-text');
    this.elements.answerInputs = questionSection.querySelectorAll('input[name="intestacy-answer"]');

    // Create result section
    var resultSection = document.createElement('div');
    resultSection.className = 'intestacy-section intestacy-result-section';
    resultSection.innerHTML = "\n      <div class=\"intestacy-result\" id=\"intestacy-result\"></div>\n      <div class=\"intestacy-next-steps\">\n        <h2>What Next?</h2>\n        <p>Having a proper Will is the only way to ensure your estate is distributed according to your wishes.</p>\n        <div id=\"intestacy-contact-info\"></div>\n      </div>\n    ";
    content.appendChild(resultSection);
    this.elements.resultSection = resultSection;
    this.elements.result = resultSection.querySelector('#intestacy-result');
    this.elements.contactInfo = resultSection.querySelector('#intestacy-contact-info');

    // Create buttons
    var buttonSection = document.createElement('div');
    buttonSection.className = 'intestacy-buttons';
    buttonSection.innerHTML = "\n      <button type=\"button\" id=\"intestacy-continue\">Continue</button>\n      <button type=\"button\" id=\"intestacy-restart\">Start Again</button>\n    ";
    this.container.appendChild(buttonSection);
    this.elements.continueButton = buttonSection.querySelector('#intestacy-continue');
    this.elements.restartButton = buttonSection.querySelector('#intestacy-restart');

    // Create footer
    var footer = document.createElement('div');
    footer.className = 'intestacy-footer';
    footer.innerHTML = "\n      <p><strong>Legal Disclaimer:</strong> This calculator provides guidance based on UK intestacy rules. \n      For legal advice, please consult a qualified professional.</p>\n    ";
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
    this.container.classList.add("intestacy-theme-".concat(this.options.theme));
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
  }

  /**
   * Show the result
   */
  showResult() {
    // Calculate distribution
    var resultText = this.calculator.calculateDistribution();

    // Format result with name
    var formattedResult = "\n      <h2>Distribution Results for ".concat(this.state.name, "</h2>\n      <p>").concat(resultText, "</p>\n      <p>If you wish to change this distribution, you will need to create a Will.</p>\n    ");

    // Update result text
    this.elements.result.innerHTML = formattedResult;

    // Update contact info
    this.elements.contactInfo.textContent = this.options.contactInfo;

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
    var name = this.elements.nameInput.value;
    var validation = validateName(name);
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
    var estateValue = this.elements.estateInput.value;
    var validation = validateEstateValue(estateValue);
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
    var selectedStatus = null;

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

    // Start the question flow
    this.showQuestion('children');
  }

  /**
   * Handle question answer
   */
  handleQuestionAnswer() {
    var selectedAnswer = null;

    // Find selected answer
    this.elements.answerInputs.forEach(input => {
      if (input.checked) {
        selectedAnswer = input.value;
      }
    });
    if (!selectedAnswer) {
      return; // No answer selected
    }
    var questionId = this.state.questionId;
    var isYes = selectedAnswer === 'Yes';

    // Update the calculator state with this answer
    this.calculator.state[questionId] = isYes;

    // Process the answer and get the next question
    var nextQuestionId = this.calculator.processAnswer(questionId, isYes);

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

    // Show first step
    this.showNameInput();
  }
}

class IntestacyWidget {
  /**
   * Create a new IntestacyWidget instance
   * @param {Object} options - Configuration options
   */
  constructor() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // Default options
    this.options = _objectSpread2({
      container: '#intestacy-calculator',
      theme: 'light',
      contactInfo: 'Please contact us to discuss creating a Will.'
    }, options);

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
    this.ui = new IntestacyUI(this.options.container, this.options);
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
    var style = document.createElement('style');
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
    return "\n      /**\n       * Intestacy Calculator Styles\n       */\n      \n      /* Base styles */\n      .intestacy-calculator {\n        font-family: Arial, sans-serif;\n        max-width: 800px;\n        margin: 0 auto;\n        padding: 20px;\n        box-sizing: border-box;\n      }\n      \n      .intestacy-calculator * {\n        box-sizing: border-box;\n      }\n      \n      /* Header */\n      .intestacy-header {\n        margin-bottom: 30px;\n        text-align: center;\n      }\n      \n      .intestacy-header h1 {\n        font-size: 28px;\n        margin: 0 0 10px 0;\n        color: #333;\n      }\n      \n      .intestacy-header p {\n        font-size: 16px;\n        margin: 0;\n        color: #666;\n      }\n      \n      /* Content sections */\n      .intestacy-content {\n        background-color: #f9f9f9;\n        border-radius: 8px;\n        padding: 20px;\n        margin-bottom: 20px;\n        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n      }\n      \n      .intestacy-section {\n        margin-bottom: 20px;\n      }\n      \n      /* Form elements */\n      .intestacy-calculator label {\n        display: block;\n        font-size: 16px;\n        font-weight: bold;\n        margin-bottom: 8px;\n        color: #333;\n      }\n      \n      .intestacy-calculator input[type=\"text\"],\n      .intestacy-calculator input[type=\"number\"] {\n        width: 100%;\n        padding: 10px;\n        font-size: 16px;\n        border: 1px solid #ccc;\n        border-radius: 4px;\n        margin-bottom: 5px;\n      }\n      \n      .intestacy-calculator input[type=\"text\"]:focus,\n      .intestacy-calculator input[type=\"number\"]:focus {\n        border-color: #007bff;\n        outline: none;\n        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);\n      }\n      \n      /* Radio buttons */\n      .intestacy-radio-group {\n        margin-top: 10px;\n      }\n      \n      .intestacy-radio-group label {\n        display: block;\n        font-weight: normal;\n        margin-bottom: 10px;\n        cursor: pointer;\n      }\n      \n      .intestacy-radio-group input[type=\"radio\"] {\n        margin-right: 8px;\n      }\n      \n      /* Error messages */\n      .intestacy-error {\n        color: #dc3545;\n        font-size: 14px;\n        margin-top: 5px;\n        min-height: 20px;\n      }\n      \n      /* Question section */\n      .intestacy-question {\n        font-size: 18px;\n        margin-bottom: 15px;\n        color: #333;\n      }\n      \n      /* Result section */\n      .intestacy-result {\n        background-color: #fff;\n        padding: 20px;\n        border-radius: 5px;\n        margin-bottom: 20px;\n        border-left: 4px solid #007bff;\n      }\n      \n      .intestacy-result h2 {\n        font-size: 22px;\n        margin-top: 0;\n        margin-bottom: 15px;\n        color: #333;\n      }\n      \n      .intestacy-result p {\n        margin-bottom: 15px;\n        line-height: 1.5;\n      }\n      \n      .intestacy-next-steps {\n        margin-top: 20px;\n      }\n      \n      .intestacy-next-steps h2 {\n        font-size: 20px;\n        margin-top: 0;\n        margin-bottom: 10px;\n        color: #333;\n      }\n      \n      /* Buttons */\n      .intestacy-buttons {\n        display: flex;\n        justify-content: space-between;\n        margin-bottom: 20px;\n      }\n      \n      .intestacy-calculator button {\n        padding: 10px 20px;\n        font-size: 16px;\n        border: none;\n        border-radius: 4px;\n        cursor: pointer;\n        transition: background-color 0.2s;\n      }\n      \n      #intestacy-continue {\n        background-color: #007bff;\n        color: white;\n      }\n      \n      #intestacy-continue:hover {\n        background-color: #0069d9;\n      }\n      \n      #intestacy-restart {\n        background-color: #6c757d;\n        color: white;\n      }\n      \n      #intestacy-restart:hover {\n        background-color: #5a6268;\n      }\n      \n      /* Footer */\n      .intestacy-footer {\n        font-size: 14px;\n        color: #666;\n        text-align: center;\n        margin-top: 30px;\n        padding-top: 15px;\n        border-top: 1px solid #eee;\n      }\n      \n      /* Light theme (default) */\n      .intestacy-theme-light {\n        /* Default styles are already light theme */\n      }\n      \n      /* Dark theme */\n      .intestacy-theme-dark {\n        background-color: #333;\n        color: #f5f5f5;\n      }\n      \n      .intestacy-theme-dark .intestacy-header h1 {\n        color: #f5f5f5;\n      }\n      \n      .intestacy-theme-dark .intestacy-header p {\n        color: #ccc;\n      }\n      \n      .intestacy-theme-dark .intestacy-content {\n        background-color: #444;\n        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n      }\n      \n      .intestacy-theme-dark .intestacy-calculator label {\n        color: #f5f5f5;\n      }\n      \n      .intestacy-theme-dark .intestacy-calculator input[type=\"text\"],\n      .intestacy-theme-dark .intestacy-calculator input[type=\"number\"] {\n        background-color: #555;\n        border-color: #666;\n        color: #f5f5f5;\n      }\n      \n      .intestacy-theme-dark .intestacy-question {\n        color: #f5f5f5;\n      }\n      \n      .intestacy-theme-dark .intestacy-result {\n        background-color: #555;\n        border-left-color: #0d6efd;\n      }\n      \n      .intestacy-theme-dark .intestacy-result h2 {\n        color: #f5f5f5;\n      }\n      \n      .intestacy-theme-dark .intestacy-next-steps h2 {\n        color: #f5f5f5;\n      }\n      \n      .intestacy-theme-dark .intestacy-footer {\n        color: #ccc;\n        border-top-color: #555;\n      }\n      \n      /* Responsive styles */\n      @media (max-width: 768px) {\n        .intestacy-calculator {\n          padding: 15px;\n        }\n        \n        .intestacy-header h1 {\n          font-size: 24px;\n        }\n        \n        .intestacy-content {\n          padding: 15px;\n        }\n        \n        .intestacy-buttons {\n          flex-direction: column;\n          gap: 10px;\n        }\n        \n        .intestacy-calculator button {\n          width: 100%;\n        }\n      }\n      \n      @media (max-width: 480px) {\n        .intestacy-header h1 {\n          font-size: 22px;\n        }\n        \n        .intestacy-question {\n          font-size: 16px;\n        }\n        \n        .intestacy-result h2 {\n          font-size: 20px;\n        }\n      }\n    ";
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
  updateOptions() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.options = _objectSpread2(_objectSpread2({}, this.options), options);

    // Reinitialize with new options
    this.init();
  }
}

// Make available globally when included via script tag
if (typeof window !== 'undefined') {
  window.IntestacyWidget = IntestacyWidget;
}

export { IntestacyWidget as default };
//# sourceMappingURL=IntestacyWidget.js.map
