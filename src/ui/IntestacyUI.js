/**
 * IntestacyUI.js
 * Main UI controller for the intestacy calculator
 */

import IntestacyCalculator from '../core/IntestacyCalculator.js';
import { validateEstateValue, validateName, stringToBoolean } from '../core/ValidationUtils.js';
import ChartUtils from '../libs/ChartUtils.js';

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
      showCharts: true,
      ...options
    };
    
    // Create calculator instance
    this.calculator = new IntestacyCalculator();
    
    // State object
    this.state = {
      currentStep: 1,
      totalSteps: 4,
      name: '',
      estateValue: 0,
      marriageStatus: '',
      currentQuestionId: '',
      answers: {}
    };
    
    // UI elements
    this.elements = {};
    
    // Initialize chart instance holder
    this.charts = {
      distribution: null,
      breakdown: null
    };
    
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
    this.container.classList.add(`intestacy-theme-${this.options.theme}`);
    
    // Create header
    const header = document.createElement('div');
    header.className = 'intestacy-header';
    header.innerHTML = `
      <h1>UK Intestacy Calculator</h1>
      <p>Find out how your estate would be distributed if you die without a Will in the UK</p>
    `;
    this.container.appendChild(header);
    
    // Create progress indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'intestacy-progress';
    this.container.appendChild(progressIndicator);
    
    // Create steps
    const steps = document.createElement('div');
    steps.className = 'intestacy-steps';
    for (let i = 1; i <= this.state.totalSteps; i++) {
      const step = document.createElement('div');
      step.className = 'intestacy-step';
      step.setAttribute('data-step', i);
      step.innerHTML = `
        <div class="intestacy-step-dot">${i}</div>
        <div class="intestacy-step-label">${i === 1 ? 'Your Details' : i === 2 ? 'Estate Value' : i === 3 ? 'Marital Status' : 'Family'}</div>
      `;
      steps.appendChild(step);
    }
    progressIndicator.appendChild(steps);
    
    // Create main content area
    const content = document.createElement('div');
    content.className = 'intestacy-content';
    this.container.appendChild(content);
    this.elements.content = content;
    
    // Create name input
    const nameSection = document.createElement('div');
    nameSection.className = 'intestacy-section intestacy-name-section';
    nameSection.innerHTML = `
      <label for="intestacy-name">Your Name</label>
      <input type="text" id="intestacy-name" placeholder="Enter your name" required>
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
      <label for="intestacy-estate-value">What is the approximate value of your estate?</label>
      <input type="text" id="intestacy-estate-value" placeholder="£" required>
      <div class="intestacy-error" id="intestacy-estate-error"></div>
    `;
    content.appendChild(estateSection);
    this.elements.estateSection = estateSection;
    this.elements.estateValueInput = estateSection.querySelector('#intestacy-estate-value');
    this.elements.estateError = estateSection.querySelector('#intestacy-estate-error');
    
    // Create status input
    const statusSection = document.createElement('div');
    statusSection.className = 'intestacy-section intestacy-status-section';
    statusSection.innerHTML = `
      <div>What is your marital status?</div>
      <div class="intestacy-radio-group">
        <input type="radio" id="intestacy-status-married" name="intestacy-status" value="married">
        <label for="intestacy-status-married">Married or in a Civil Partnership</label>
      </div>
      <div class="intestacy-radio-group">
        <input type="radio" id="intestacy-status-cohabiting" name="intestacy-status" value="cohabiting">
        <label for="intestacy-status-cohabiting">Living with Partner (Cohabiting)</label>
      </div>
      <div class="intestacy-radio-group">
        <input type="radio" id="intestacy-status-single" name="intestacy-status" value="single">
        <label for="intestacy-status-single">Single</label>
      </div>
      <div class="intestacy-radio-group">
        <input type="radio" id="intestacy-status-divorced" name="intestacy-status" value="divorced">
        <label for="intestacy-status-divorced">Divorced or Dissolved Civil Partnership</label>
      </div>
      <div class="intestacy-radio-group">
        <input type="radio" id="intestacy-status-widowed" name="intestacy-status" value="widowed">
        <label for="intestacy-status-widowed">Widowed</label>
      </div>
      <div id="intestacy-status-error" class="intestacy-error"></div>
    `;
    content.appendChild(statusSection);
    this.elements.statusSection = statusSection;
    this.elements.marriedRadio = statusSection.querySelector('#intestacy-status-married');
    this.elements.cohabitingRadio = statusSection.querySelector('#intestacy-status-cohabiting');
    this.elements.singleRadio = statusSection.querySelector('#intestacy-status-single');
    this.elements.divorcedRadio = statusSection.querySelector('#intestacy-status-divorced');
    this.elements.widowedRadio = statusSection.querySelector('#intestacy-status-widowed');
    
    // Create question section
    const questionSection = document.createElement('div');
    questionSection.className = 'intestacy-section intestacy-question-section';
    questionSection.innerHTML = `
      <div class="intestacy-question" id="intestacy-question"></div>
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
    this.elements.questionText = questionSection.querySelector('#intestacy-question');
    this.elements.answerInputs = questionSection.querySelectorAll('input[name="intestacy-answer"]');
    
    // Create result section with chart container
    const resultSection = document.createElement('div');
    resultSection.className = 'intestacy-section intestacy-result-section';
    resultSection.innerHTML = `
      <div class="intestacy-result" id="intestacy-result"></div>
      <div class="intestacy-charts-container" id="intestacy-charts-container">
        <div class="intestacy-pie-chart" id="intestacy-pie-chart">
          <h3 class="intestacy-chart-title">Distribution Overview</h3>
          <div id="intestacy-distribution-chart" class="intestacy-chart"></div>
        </div>
        <div class="intestacy-bar-chart" id="intestacy-bar-chart">
          <h3 class="intestacy-chart-title">Detailed Breakdown</h3>
          <div id="intestacy-breakdown-chart" class="intestacy-chart"></div>
        </div>
      </div>
      <div class="intestacy-next-steps">
        <h2>What Next?</h2>
        <p>Having a proper Will is the only way to ensure your estate is distributed according to your wishes.</p>
        <div id="intestacy-contact-info"></div>
      </div>
    `;
    content.appendChild(resultSection);
    this.elements.resultSection = resultSection;
    this.elements.result = resultSection.querySelector('#intestacy-result');
    this.elements.chartsContainer = resultSection.querySelector('#intestacy-charts-container');
    this.elements.pieChart = resultSection.querySelector('#intestacy-pie-chart');
    this.elements.barChart = resultSection.querySelector('#intestacy-bar-chart');
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
    
    // Update progress bar initial state
    this.updateProgress(1);
  }
  
  /**
   * Update the progress indicator
   * @param {number} step - Current step
   */
  updateProgress(step) {
    this.state.currentStep = step;
    
    // Calculate progress percentage
    const progressPercent = ((step - 1) / (this.state.totalSteps)) * 100;
    this.elements.progressBar.style.width = `${progressPercent}%`;
    
    // Update step indicators
    this.elements.steps.forEach(stepElement => {
      const stepNumber = parseInt(stepElement.dataset.step);
      
      // Remove all classes first
      stepElement.classList.remove('active', 'completed');
      
      // Add appropriate class
      if (stepNumber === step) {
        stepElement.classList.add('active');
      } else if (stepNumber < step) {
        stepElement.classList.add('completed');
      }
    });
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
    this.elements.estateValueInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.handleContinue();
      }
    });
    
    // Status input continue
    this.elements.statusSection.addEventListener('click', (event) => {
      if (event.target.matches('input[type="radio"]')) {
        this.handleStatusSubmit();
      }
    });
    
    // Question continue
    this.elements.answerInputs.forEach(input => {
      input.addEventListener('click', () => {
        this.handleQuestionAnswer();
      });
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
    this.elements.nameSection.style.display = 'block';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'none';
    this.elements.questionSection.style.display = 'none';
    this.elements.resultSection.style.display = 'none';
    
    // Focus on input
    setTimeout(() => this.elements.nameInput.focus(), 300);
    
    // Update progress
    this.updateProgress(1);
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
    setTimeout(() => this.elements.estateValueInput.focus(), 300);
    
    // Update progress
    this.updateProgress(2);
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
    
    // Update progress
    this.updateProgress(3);
  }
  
  /**
   * Show a question
   * @param {string} questionId - The ID of the question to show
   */
  showQuestion(questionId) {
    this.state.currentQuestionId = questionId;
    const questionText = this.calculator.getQuestionText(questionId);
    
    // Update the question text
    this.elements.questionText.textContent = questionText;
    this.elements.questionText.style.display = 'block';
    
    // Create radio buttons for the options
    const questionOptionsHTML = this.calculator.getQuestionOptions(questionId).map(option => `
      <div>
        <input type="radio" id="intestacy-option-${option.value}" name="intestacy-question-${questionId}" value="${option.value}">
        <label for="intestacy-option-${option.value}">${option.text}</label>
      </div>
    `).join('');
    
    this.elements.questionOptions.innerHTML = questionOptionsHTML;
    
    // Hide other sections
    this.elements.nameSection.style.display = 'none';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'none';
    this.elements.resultSection.style.display = 'none';
    
    // Show question section
    this.elements.questionSection.style.display = 'block';
    
    // Clear any previous error
    this.elements.questionError.style.display = 'none';
    
    // Update progress
    this.updateProgress(4);
  }
  
  /**
   * Show the result
   */
  showResult() {
    // Calculate distribution - now returns object with text and data
    const distribution = this.calculator.calculateDistribution();
    
    // Get estate value for display
    const estateValue = this.calculator.formatCurrency(this.state.estateValue);
    
    // Get inheritance hierarchy text for detailed explanation
    const hierarchyText = this.calculator.getInheritanceHierarchyText(this.state.estateValue);
    
    // Format result with rich text and structured sections
    const formattedResult = `
      <h2>Distribution Results for ${this.state.name}</h2>
      
      <div class="intestacy-result-summary">
        <p><strong>Estate Value:</strong> ${estateValue}</p>
        <p><strong>Summary:</strong> ${distribution.text}</p>
      </div>
      
      <div class="intestacy-result-details">
        <h3>How Your Estate Will Be Distributed</h3>
        ${this.formatDistributionDetails(distribution.data)}
      </div>
      
      <div class="intestacy-result-explanation">
        <h3>Understanding Your Inheritance</h3>
        <p>${hierarchyText}</p>
      </div>
      
      <div class="intestacy-result-advice">
        <h3>Legal Advice</h3>
        <p>Under intestacy rules, your estate will be distributed according to a strict legal formula that may not reflect your wishes.</p>
        <p><strong>If you wish to change this distribution, you will need to create a Will.</strong></p>
      </div>
    `;
    
    // Update result text
    this.elements.result.innerHTML = formattedResult;
    
    // Create visualizations if enabled
    if (this.options.showCharts) {
      this.createDistributionCharts(distribution.data);
    } else {
      this.elements.chartsContainer.style.display = 'none';
    }
    
    // Update contact info
    if (this.calculator.state.cohabiting) {
      // Enhanced contact info for cohabiting partners
      this.elements.contactInfo.innerHTML = `
        <strong>URGENT:</strong> As a cohabiting partner, creating a Will is essential to protect your partner.
        <br>Contact our firm at <strong>${this.options.contactPhone}</strong> or <a href="mailto:${this.options.contactEmail}">${this.options.contactEmail}</a> to discuss creating a Will.
      `;
      
      // Ensure cohabiting warning remains visible
      this.elements.cohabitingWarning.style.display = 'block';
    } else {
      this.elements.contactInfo.innerHTML = `
        ${this.options.contactInfo}
        <br>Call us at <strong>${this.options.contactPhone}</strong> or email <a href="mailto:${this.options.contactEmail}">${this.options.contactEmail}</a>.
      `;
    }
    
    // Show/hide sections
    this.elements.nameSection.style.display = 'none';
    this.elements.estateSection.style.display = 'none';
    this.elements.statusSection.style.display = 'none';
    this.elements.questionSection.style.display = 'none';
    this.elements.resultSection.style.display = 'block';
  }
  
  /**
   * Format distribution details as rich text
   * @param {Object} distributionData - Data for distribution
   * @returns {string} HTML formatted distribution details
   */
  formatDistributionDetails(distributionData) {
    if (!distributionData || !distributionData.labels || !distributionData.shares || distributionData.labels.length === 0) {
      return '<p>No distribution details available.</p>';
    }
    
    // Create a formatted list of beneficiaries and their shares
    let detailsHtml = '<ul class="intestacy-beneficiaries-list">';
    
    for (let i = 0; i < distributionData.labels.length; i++) {
      const percentage = Math.round((distributionData.shares[i] / distributionData.totalValue) * 100);
      const formattedValue = this.calculator.formatCurrency(distributionData.shares[i]);
      
      detailsHtml += `
        <li class="intestacy-beneficiary-item">
          <div class="intestacy-beneficiary-icon" style="background-color: ${distributionData.colors[i]}"></div>
          <div class="intestacy-beneficiary-details">
            <strong>${distributionData.labels[i]}</strong>
            <span>${formattedValue} (${percentage}%)</span>
          </div>
        </li>
      `;
    }
    
    detailsHtml += '</ul>';
    return detailsHtml;
  }
  
  /**
   * Create distribution charts
   * @param {Object} chartData - Data for the charts
   */
  createDistributionCharts(chartData) {
    // Clear any existing charts
    if (this.charts.distribution) {
      this.charts.distribution.destroy();
    }
    if (this.charts.breakdown) {
      this.charts.breakdown.destroy();
    }
    
    // Clear chart containers
    this.elements.pieChart.innerHTML = '';
    this.elements.barChart.innerHTML = '';
    
    try {
      // Add title to charts container
      const chartTitle = document.createElement('h3');
      chartTitle.textContent = 'Visual Distribution of Estate';
      chartTitle.className = 'intestacy-chart-title';
      this.elements.chartsContainer.insertBefore(chartTitle, this.elements.pieChart);
      
      // Create pie chart
      this.charts.distribution = ChartUtils.createDistributionChart(
        chartData, 
        this.elements.pieChart
      );
      
      // Create breakdown chart if there are multiple shares
      if (chartData.shares.length > 1) {
        const breakdownTitle = document.createElement('h3');
        breakdownTitle.textContent = 'Breakdown of Shares';
        breakdownTitle.className = 'intestacy-chart-title';
        this.elements.barChart.appendChild(breakdownTitle);
        
        this.charts.breakdown = ChartUtils.createBreakdownChart(
          chartData,
          this.elements.barChart
        );
      } else {
        this.elements.barChart.style.display = 'none';
      }
      
      // Show charts container
      this.elements.chartsContainer.style.display = 'flex';
    } catch (error) {
      console.error('Error creating charts:', error);
      this.elements.chartsContainer.style.display = 'none';
    }
  }
  
  /**
   * Handle the continue button click
   */
  handleContinue() {
    switch (this.state.currentStep) {
      case 1:
        this.handleNameSubmit();
        break;
      case 2:
        this.handleEstateSubmit();
        break;
      case 3:
        this.handleStatusSubmit();
        break;
      case 4:
        this.handleQuestionAnswer();
        break;
    }
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
    
    // Show estate input
    this.showEstateInput();
  }
  
  /**
   * Handle estate value input submission
   */
  handleEstateSubmit() {
    const estateValueRaw = this.elements.estateValueInput.value.trim();
    
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
    this.calculator.setEstateValue(numValue);
    
    // Clear error
    this.elements.estateError.style.display = 'none';
    
    // Move to next step
    this.showStatusInput();
  }
  
  /**
   * Handle relationship status submission
   */
  handleStatusSubmit() {
    let selectedStatus = '';
    
    // Find selected status
    if (this.elements.marriedRadio.checked) {
      selectedStatus = 'married';
    } else if (this.elements.cohabitingRadio.checked) {
      selectedStatus = 'cohabiting';
    } else if (this.elements.singleRadio.checked) {
      selectedStatus = 'single';
    } else if (this.elements.divorcedRadio.checked) {
      selectedStatus = 'divorced';
    } else if (this.elements.widowedRadio.checked) {
      selectedStatus = 'widowed';
    }
    
    if (!selectedStatus) {
      this.elements.statusError.textContent = 'Please select your marital status';
      this.elements.statusError.style.display = 'block';
      return;
    }
    
    // Store the status
    this.state.marriageStatus = selectedStatus;
    
    // Clear error
    this.elements.statusError.style.display = 'none';
    
    // Process the answer
    this.calculator.processAnswer('status', selectedStatus);
    
    // Show warning for cohabiting
    if (selectedStatus === 'cohabiting') {
      this.elements.cohabitingWarning.style.display = 'block';
    } else {
      this.elements.cohabitingWarning.style.display = 'none';
    }
    
    // Check if we can determine distribution already or need to ask more questions
    if (this.calculator.canDetermineDistribution()) {
      this.showResult();
      this.updateProgress(5);
    } else {
      // Get the first question and show it
      const firstQuestionId = this.calculator.getFirstQuestionId();
      if (firstQuestionId) {
        this.showQuestion(firstQuestionId);
      } else {
        console.error('No questions defined');
      }
    }
  }
  
  /**
   * Handle question answer
   */
  handleQuestionAnswer() {
    // Get the question id
    const questionId = this.state.currentQuestionId;
    if (!questionId) {
      console.error('No question ID in state');
      return;
    }
    
    // Find selected answer
    let selectedAnswer = '';
    const answerInputs = this.elements.questionOptions.querySelectorAll(`input[name="intestacy-question-${questionId}"]`);
    
    answerInputs.forEach(input => {
      if (input.checked) {
        selectedAnswer = input.value;
      }
    });
    
    if (!selectedAnswer) {
      this.elements.questionError.textContent = 'Please select an answer';
      this.elements.questionError.style.display = 'block';
      return;
    }
    
    // Clear error
    this.elements.questionError.style.display = 'none';
    
    // Process the answer
    this.calculator.processAnswer(questionId, selectedAnswer);
    
    // Check if we can determine distribution now
    if (this.calculator.canDetermineDistribution()) {
      this.showResult();
      this.updateProgress(5);
    } else {
      // Get the next question and show it
      const nextQuestionId = this.calculator.getNextQuestionId(questionId, selectedAnswer);
      if (nextQuestionId) {
        this.showQuestion(nextQuestionId);
      } else {
        console.error('No next question defined');
      }
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
      currentStep: 1,
      totalSteps: 4,
      name: '',
      estateValue: 0,
      marriageStatus: '',
      currentQuestionId: '',
      answers: {}
    };
    
    // Reset inputs
    this.elements.nameInput.value = '';
    this.elements.estateValueInput.value = '';
    this.elements.nameError.textContent = '';
    this.elements.estateError.textContent = '';
    
    this.elements.marriedRadio.checked = false;
    this.elements.cohabitingRadio.checked = false;
    this.elements.singleRadio.checked = false;
    this.elements.divorcedRadio.checked = false;
    this.elements.widowedRadio.checked = false;
    
    // Hide cohabiting warning
    this.elements.cohabitingWarning.style.display = 'none';
    
    // Show first step
    this.showNameInput();
  }
}

// Export the class for use in other modules
export default IntestacyUI;