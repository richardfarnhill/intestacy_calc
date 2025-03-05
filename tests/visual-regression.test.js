/**
 * Visual regression tests for the intestacy calculator
 * These tests create snapshots of the DOM structure
 * to detect unwanted changes to the UI appearance.
 */

import IntestacyWidget from '../src/integration/IntestacyWidget.js';

// Helper to simulate user input
const simulateUserInput = (element, value) => {
  if (!element) return;
  element.value = value;
  element.dispatchEvent(new Event('input'));
  element.dispatchEvent(new Event('change'));
};

// Helper to simulate click
const simulateClick = (element) => {
  if (!element) return;
  element.click();
};

// Helper to create a simplified snapshot of DOM structure
const createDomSnapshot = (element) => {
  if (!element) return null;
  
  // Create a representation of this element
  const snapshot = {
    tagName: element.tagName,
    id: element.id || null,
    className: element.className || null,
    style: element.style && element.style.cssText ? element.style.cssText : null,
    children: [],
    textContent: element.childNodes.length === 1 && 
                element.childNodes[0].nodeType === Node.TEXT_NODE ? 
                element.textContent.trim() : null
  };
  
  // Add attributes
  snapshot.attributes = {};
  if (element.attributes) {
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      if (attr.name !== 'id' && attr.name !== 'class' && !attr.name.startsWith('data-testid')) {
        snapshot.attributes[attr.name] = attr.value;
      }
    }
  }
  
  // Process children
  Array.from(element.children).forEach(child => {
    snapshot.children.push(createDomSnapshot(child));
  });
  
  return snapshot;
};

describe('Visual Regression Tests', () => {
  let container;
  let widget;
  let baselineSnapshots = {};
  
  beforeAll(() => {
    // Create a container for the widget
    container = document.createElement('div');
    container.id = 'intestacy-calculator';
    document.body.appendChild(container);
    
    // Initialize the widget
    widget = new IntestacyWidget({
      container: '#intestacy-calculator',
      theme: 'light',
      contactInfo: 'Test contact info'
    });
    
    // Create baseline snapshots for key UI states
    baselineSnapshots.nameInput = createDomSnapshot(container.querySelector('.intestacy-name-section'));
    
    // Advance to estate input
    const nameInput = container.querySelector('.intestacy-name-section input');
    nameInput.value = 'Test User';
    container.querySelector('.intestacy-name-section button').click();
    
    baselineSnapshots.estateInput = createDomSnapshot(container.querySelector('.intestacy-estate-section'));
    
    // Advance to status input
    const estateInput = container.querySelector('.intestacy-estate-section input');
    estateInput.value = '500000';
    container.querySelector('.intestacy-estate-section button').click();
    
    baselineSnapshots.statusInput = createDomSnapshot(container.querySelector('.intestacy-status-section'));
    
    // Reset to initial state
    widget.reset();
  });
  
  afterAll(() => {
    document.body.innerHTML = '';
  });
  
  test('name input screen maintains consistent structure', () => {
    // Reset widget to ensure we're on the name input screen
    widget.reset();
    
    // Create a snapshot of the current state
    const currentSnapshot = createDomSnapshot(container.querySelector('.intestacy-name-section'));
    
    // Key structural elements that should never change
    expect(currentSnapshot.children.length).toBe(baselineSnapshots.nameInput.children.length);
    
    // Check for input field
    const baselineInput = baselineSnapshots.nameInput.children.find(c => 
      c.tagName === 'INPUT' || (c.children && c.children.find(cc => cc.tagName === 'INPUT')));
    const currentInput = currentSnapshot.children.find(c => 
      c.tagName === 'INPUT' || (c.children && c.children.find(cc => cc.tagName === 'INPUT')));
    
    expect(baselineInput).toBeTruthy();
    expect(currentInput).toBeTruthy();
    
    // Check for continue button
    const baselineButton = findElementsInSnapshot(baselineSnapshots.nameInput, el => 
      el.tagName === 'BUTTON')[0];
    const currentButton = findElementsInSnapshot(currentSnapshot, el => 
      el.tagName === 'BUTTON')[0];
    
    expect(baselineButton).toBeTruthy();
    expect(currentButton).toBeTruthy();
  });
  
  test('estate input screen maintains consistent structure', () => {
    // Advance to estate input
    widget.reset();
    const nameInput = container.querySelector('.intestacy-name-section input');
    nameInput.value = 'Test User';
    container.querySelector('.intestacy-name-section button').click();
    
    // Create a snapshot of the current state
    const currentSnapshot = createDomSnapshot(container.querySelector('.intestacy-estate-section'));
    
    // Check key structural elements
    expect(currentSnapshot.children.length).toBe(baselineSnapshots.estateInput.children.length);
    
    // Check for numeric input field
    const currentInput = findElementsInSnapshot(currentSnapshot, el => 
      el.tagName === 'INPUT' && (el.attributes.type === 'text' || el.attributes.type === 'number'))[0];
    expect(currentInput).toBeTruthy();
    
    // Check for currency symbol if present
    const currencyElements = findElementsInSnapshot(currentSnapshot, el => 
      el.textContent && el.textContent.includes('£'));
    const baselineCurrencyElements = findElementsInSnapshot(baselineSnapshots.estateInput, el => 
      el.textContent && el.textContent.includes('£'));
    
    expect(currencyElements.length).toBe(baselineCurrencyElements.length);
  });
  
  test('marital status screen maintains consistent structure', () => {
    // Advance to marital status screen
    const nameInput = container.querySelector('.intestacy-name-section input');
    const nameButton = container.querySelector('.intestacy-name-section button');
    
    if (nameInput && nameButton) {
      simulateUserInput(nameInput, 'John Smith');
      simulateClick(nameButton);
      
      const estateInput = container.querySelector('.intestacy-estate-section input');
      const estateButton = container.querySelector('.intestacy-estate-section button');
      
      if (estateInput && estateButton) {
        simulateUserInput(estateInput, '500000');
        simulateClick(estateButton);
        
        // Verify marital status screen structure
        const statusSection = container.querySelector('.intestacy-status-section');
        expect(statusSection.style.display).toBe('block');
        
        const snapshot = createDomSnapshot(statusSection);
        // Status section is now a form element for better accessibility
        expect(snapshot.tagName).toBe('FORM');
        expect(snapshot.children.length).toBeGreaterThan(0);
        
        // Verify radio options exist
        const radioOptions = statusSection.querySelectorAll('input[type="radio"]');
        expect(radioOptions.length).toBeGreaterThan(0);
      }
    }
  });
  
  test('result screen maintains consistent structure', () => {
    // ... existing code ...
  });
  
  // Helper to find elements in a snapshot based on criteria
  function findElementsInSnapshot(snapshot, predicate, results = []) {
    if (predicate(snapshot)) {
      results.push(snapshot);
    }
    
    if (snapshot.children) {
      snapshot.children.forEach(child => {
        findElementsInSnapshot(child, predicate, results);
      });
    }
    
    return results;
  }
}); 