/**
 * Tests for the IntestacyUI class
 */

import IntestacyUI from '../src/ui/IntestacyUI.js';

// Mock DOM elements for testing
const createMockContainer = () => {
  const container = document.createElement('div');
  container.id = 'test-container';
  document.body.appendChild(container);
  return container;
};

describe('IntestacyUI', () => {
  let ui;
  let container;
  
  beforeEach(() => {
    // Set up a DOM container element
    container = createMockContainer();
    
    // Create a new UI instance
    ui = new IntestacyUI(container, {
      theme: 'light',
      contactInfo: 'Test contact info'
    });
  });
  
  afterEach(() => {
    // Clean up the DOM
    document.body.innerHTML = '';
  });
  
  test('should initialize correctly', () => {
    expect(ui).toBeDefined();
    expect(ui.container).toBe(container);
    expect(ui.options.theme).toBe('light');
    expect(ui.options.contactInfo).toBe('Test contact info');
  });
  
  test('should create UI structure with all necessary sections', () => {
    ui.init();
    
    // Verify that the calculator element was created
    const calculator = container.querySelector('.intestacy-calculator');
    expect(calculator).toBeTruthy();
    
    // Check that all required sections are created
    expect(calculator.querySelector('.intestacy-name-section')).toBeTruthy();
    expect(calculator.querySelector('.intestacy-estate-section')).toBeTruthy();
    expect(calculator.querySelector('.intestacy-status-section')).toBeTruthy();
    expect(calculator.querySelector('.intestacy-question-section')).toBeTruthy();
    expect(calculator.querySelector('.intestacy-result-section')).toBeTruthy();
    
    // Verify no chart elements are present
    expect(calculator.querySelector('.intestacy-charts-container')).toBeNull();
  });
  
  test('should show the name input section initially', () => {
    ui.init();
    
    const nameSection = container.querySelector('.intestacy-name-section');
    const estateSection = container.querySelector('.intestacy-estate-section');
    
    // Name section should be visible
    expect(nameSection.style.display).not.toBe('none');
    
    // Other sections should be hidden
    expect(estateSection.style.display).toBe('none');
  });
  
  test('should reset to initial state', () => {
    ui.init();
    
    // Simulate some progression through the calculator
    ui.state.name = 'Test User';
    ui.state.estateValue = 500000;
    
    // Call reset
    ui.reset();
    
    // Verify state is reset
    expect(ui.state.name).toBe('');
    expect(ui.state.estateValue).toBe(0);
    
    // Name section should be visible again
    const nameSection = container.querySelector('.intestacy-name-section');
    expect(nameSection.style.display).not.toBe('none');
  });
}); 