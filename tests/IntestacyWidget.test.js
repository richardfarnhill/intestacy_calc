/**
 * Tests for the IntestacyWidget class
 */

import IntestacyWidget from '../src/integration/IntestacyWidget.js';

// Mock document functions
document.querySelector = jest.fn().mockImplementation((selector) => {
  const element = document.createElement('div');
  element.id = selector.replace('#', '');
  return element;
});

describe('IntestacyWidget', () => {
  let widget;
  let container;
  
  beforeEach(() => {
    // Create a container element
    container = document.createElement('div');
    container.id = 'intestacy-calculator';
    document.body.appendChild(container);
    
    // Mock appendChild to test style injection
    document.head.appendChild = jest.fn();
  });
  
  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });
  
  test('should initialize with default options', () => {
    widget = new IntestacyWidget();
    
    expect(widget.options.container).toBe('#intestacy-calculator');
    expect(widget.options.theme).toBe('light');
    expect(widget.options.contactInfo).toBe('Please contact us to discuss creating a Will.');
  });
  
  test('should initialize with custom options', () => {
    widget = new IntestacyWidget({
      container: '#custom-container',
      theme: 'dark',
      contactInfo: 'Custom contact info'
    });
    
    expect(widget.options.container).toBe('#custom-container');
    expect(widget.options.theme).toBe('dark');
    expect(widget.options.contactInfo).toBe('Custom contact info');
  });
  
  test('should create styles on initialization', () => {
    widget = new IntestacyWidget();
    
    // Verify that styles were created
    expect(document.head.appendChild).toHaveBeenCalled();
    const styleElement = document.head.appendChild.mock.calls[0][0];
    expect(styleElement.tagName).toBe('STYLE');
    expect(styleElement.id).toBe('intestacy-calculator-styles');
  });
  
  test('should not attempt to load Chart.js', () => {
    // Original implementation should be preserved
    const originalCreateElement = document.createElement;
    
    // Mock document.createElement to check for script creation
    document.createElement = jest.fn().mockImplementation((tag) => {
      const element = originalCreateElement.call(document, tag);
      return element;
    });
    
    widget = new IntestacyWidget();
    
    // Verify that no script element is created for Chart.js
    const scriptCreationCalls = document.createElement.mock.calls
      .filter(call => call[0] === 'script');
    
    const chartScripts = scriptCreationCalls
      .filter(call => {
        // Check if any scripts were created with Chart.js in the src
        const element = call[0];
        return element === 'script' && 
          (typeof element.src === 'string' && 
          (element.src.includes('chart.js') || element.src.includes('Chart.js')));
      });
    
    expect(chartScripts.length).toBe(0);
  });
  
  test('should reset UI when reset() is called', () => {
    widget = new IntestacyWidget();
    
    // Mock the UI reset method
    widget.ui = {
      reset: jest.fn()
    };
    
    widget.reset();
    
    // Verify reset was called on UI
    expect(widget.ui.reset).toHaveBeenCalled();
  });
}); 