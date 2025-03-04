/**
 * Integration tests for the intestacy calculator
 * These tests verify the full functionality of the application
 * to catch any unintended changes to the overall behavior.
 */

import IntestacyWidget from '../src/integration/IntestacyWidget.js';

// Mock DOM environment
const setupDomEnvironment = () => {
  // Create calculator container
  const container = document.createElement('div');
  container.id = 'intestacy-calculator';
  document.body.appendChild(container);
  
  // Create event spy to track interactions
  window.eventSpy = {
    events: [],
    record: function(eventType, target, details) {
      this.events.push({ eventType, target, details, timestamp: Date.now() });
    },
    clear: function() {
      this.events = [];
    },
    getEventsByType: function(type) {
      return this.events.filter(e => e.eventType === type);
    }
  };
  
  // Override event listeners to track interactions
  const originalAddEventListener = Element.prototype.addEventListener;
  Element.prototype.addEventListener = function(type, listener, options) {
    const wrappedListener = function(event) {
      window.eventSpy.record(type, this, { id: this.id, className: this.className });
      return listener.apply(this, arguments);
    };
    return originalAddEventListener.call(this, type, wrappedListener, options);
  };
  
  return container;
};

// Helper to simulate user input
const simulateUserInput = (element, value) => {
  element.value = value;
  element.dispatchEvent(new Event('input'));
  element.dispatchEvent(new Event('change'));
};

// Helper to simulate button click
const simulateClick = (element) => {
  element.dispatchEvent(new Event('click'));
};

describe('Intestacy Calculator Integration', () => {
  let widget;
  let container;
  
  beforeEach(() => {
    // Set up DOM environment
    container = setupDomEnvironment();
    window.eventSpy.clear();
    
    // Initialize the widget
    widget = new IntestacyWidget({
      container: '#intestacy-calculator',
      theme: 'light',
      contactInfo: 'Integration test contact info'
    });
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });
  
  test('complete user journey through calculator', () => {
    // First page should be name input
    const calculatorElement = container.querySelector('.intestacy-calculator');
    expect(calculatorElement).toBeTruthy();
    
    // Verify initial state - only name section should be visible
    const nameSection = calculatorElement.querySelector('.intestacy-name-section');
    const estateSection = calculatorElement.querySelector('.intestacy-estate-section');
    const statusSection = calculatorElement.querySelector('.intestacy-status-section');
    
    expect(nameSection.style.display).not.toBe('none');
    expect(estateSection.style.display).toBe('none');
    expect(statusSection.style.display).toBe('none');
    
    // Enter name and submit
    const nameInput = nameSection.querySelector('input');
    const nameButton = nameSection.querySelector('button');
    
    simulateUserInput(nameInput, 'John Doe');
    simulateClick(nameButton);
    
    // Now estate section should be visible
    expect(nameSection.style.display).toBe('none');
    expect(estateSection.style.display).not.toBe('none');
    
    // Enter estate value and submit
    const estateInput = estateSection.querySelector('input');
    const estateButton = estateSection.querySelector('button');
    
    simulateUserInput(estateInput, '500000');
    simulateClick(estateButton);
    
    // Now marital status section should be visible
    expect(estateSection.style.display).toBe('none');
    expect(statusSection.style.display).not.toBe('none');
    
    // Select a marital status and submit
    const statusRadios = statusSection.querySelectorAll('input[type="radio"]');
    const statusButton = statusSection.querySelector('button');
    
    statusRadios[0].checked = true; // Select first option (married)
    simulateClick(statusButton);
    
    // We should now be in the questions section
    const questionSection = calculatorElement.querySelector('.intestacy-question-section');
    expect(questionSection.style.display).not.toBe('none');
    
    // Answer several questions to test the flow
    const answerQuestions = () => {
      const questionOptions = questionSection.querySelector('.intestacy-question-options');
      const options = questionOptions.querySelectorAll('input[type="radio"]');
      const continueButton = questionSection.querySelector('#intestacy-continue');
      
      if (options.length > 0) {
        options[0].checked = true; // Always select first option for testing
        simulateClick(continueButton);
        return true;
      }
      return false;
    };
    
    // Answer several questions until we reach results
    let questionsAnswered = 0;
    while (questionSection.style.display !== 'none' && questionsAnswered < 5) {
      if (answerQuestions()) {
        questionsAnswered++;
      } else {
        break;
      }
    }
    
    // Verify we've answered some questions
    expect(questionsAnswered).toBeGreaterThan(0);
    
    // Eventually we should reach the result section
    const resultSection = calculatorElement.querySelector('.intestacy-result-section');
    
    // If we've answered enough questions, we should see results
    if (questionsAnswered >= 3) {
      expect(resultSection.style.display).not.toBe('none');
      
      // Result section should contain distribution information
      const distributionDetails = resultSection.querySelector('.intestacy-distribution-details');
      expect(distributionDetails).toBeTruthy();
      expect(distributionDetails.textContent.length).toBeGreaterThan(0);
    }
    
    // Test the restart button if we're on the results page
    if (resultSection.style.display !== 'none') {
      const restartButton = resultSection.querySelector('#intestacy-restart');
      expect(restartButton).toBeTruthy();
      
      simulateClick(restartButton);
      
      // We should be back at the name section
      expect(nameSection.style.display).not.toBe('none');
      expect(nameInput.value).toBe(''); // Name should be cleared
    }
  });
  
  test('entering invalid data shows error messages', () => {
    const nameSection = container.querySelector('.intestacy-name-section');
    const nameInput = nameSection.querySelector('input');
    const nameButton = nameSection.querySelector('button');
    const nameError = nameSection.querySelector('.intestacy-error');
    
    // Submit empty name
    simulateClick(nameButton);
    
    // Error should be visible
    expect(nameError.style.display).not.toBe('none');
    expect(nameError.textContent).toContain('Please enter your name');
    
    // Now enter valid name and submit
    simulateUserInput(nameInput, 'John Doe');
    simulateClick(nameButton);
    
    // Now on estate section
    const estateSection = container.querySelector('.intestacy-estate-section');
    const estateInput = estateSection.querySelector('input');
    const estateButton = estateSection.querySelector('button');
    const estateError = estateSection.querySelector('.intestacy-error');
    
    expect(estateSection.style.display).not.toBe('none');
    
    // Submit invalid estate value
    simulateUserInput(estateInput, 'not a number');
    simulateClick(estateButton);
    
    // Error should be visible
    expect(estateError.style.display).not.toBe('none');
    
    // Now enter valid estate and submit
    simulateUserInput(estateInput, '500000');
    simulateClick(estateButton);
    
    // Should proceed to marital status
    const statusSection = container.querySelector('.intestacy-status-section');
    expect(statusSection.style.display).not.toBe('none');
  });
  
  test('calculator UI structure stays consistent when advancing through steps', () => {
    // Get reference to the calculator and key sections
    const calculator = container.querySelector('.intestacy-calculator');
    
    // Verify progress indicator exists
    const progressContainer = calculator.querySelector('.intestacy-progress-container');
    expect(progressContainer).toBeTruthy();
    
    const steps = calculator.querySelectorAll('.intestacy-step');
    expect(steps.length).toBeGreaterThan(0);
    
    // First step should be active
    expect(steps[0].classList.contains('intestacy-step-active')).toBe(true);
    
    // Advance to estate section
    const nameInput = calculator.querySelector('.intestacy-name-section input');
    const nameButton = calculator.querySelector('.intestacy-name-section button');
    
    simulateUserInput(nameInput, 'John Doe');
    simulateClick(nameButton);
    
    // Second step should now be active
    expect(steps[1].classList.contains('intestacy-step-active')).toBe(true);
    expect(steps[0].classList.contains('intestacy-step-complete')).toBe(true);
    
    // Progress bar should be updated
    const progressBar = calculator.querySelector('.intestacy-progress-bar');
    expect(progressBar).toBeTruthy();
    expect(progressBar.style.width).not.toBe('0%');
    
    // Verify footer is present and consistent
    const footer = calculator.querySelector('.intestacy-footer');
    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain('Integration test contact info');
  });
  
  test('reset functionality completely restores initial state', () => {
    // Advance to estate section
    const nameInput = container.querySelector('.intestacy-name-section input');
    const nameButton = container.querySelector('.intestacy-name-section button');
    
    simulateUserInput(nameInput, 'John Doe');
    simulateClick(nameButton);
    
    // Now estate section should be visible
    const estateSection = container.querySelector('.intestacy-estate-section');
    expect(estateSection.style.display).not.toBe('none');
    
    // Call reset directly
    widget.reset();
    
    // Verify calculator is back to initial state
    const nameSection = container.querySelector('.intestacy-name-section');
    expect(nameSection.style.display).not.toBe('none');
    expect(estateSection.style.display).toBe('none');
    
    // Name input should be cleared
    expect(nameInput.value).toBe('');
    
    // Progress indicators should be reset
    const steps = container.querySelectorAll('.intestacy-step');
    expect(steps[0].classList.contains('intestacy-step-active')).toBe(true);
    expect(steps[0].classList.contains('intestacy-step-complete')).toBe(false);
    
    // Progress bar should be reset
    const progressBar = container.querySelector('.intestacy-progress-bar');
    expect(progressBar.style.width).toBe('0%');
  });
  
  test('widget respects theme option', () => {
    // Create a new widget with dark theme
    document.body.innerHTML = '';
    container = setupDomEnvironment();
    
    const darkWidget = new IntestacyWidget({
      container: '#intestacy-calculator',
      theme: 'dark'
    });
    
    // Verify dark theme is applied
    const calculator = container.querySelector('.intestacy-calculator');
    expect(calculator.classList.contains('intestacy-theme-dark')).toBe(true);
    
    // Create another widget with light theme
    document.body.innerHTML = '';
    container = setupDomEnvironment();
    
    const lightWidget = new IntestacyWidget({
      container: '#intestacy-calculator',
      theme: 'light'
    });
    
    // Verify light theme is applied (no dark theme class)
    const lightCalculator = container.querySelector('.intestacy-calculator');
    expect(lightCalculator.classList.contains('intestacy-theme-dark')).toBe(false);
  });
}); 