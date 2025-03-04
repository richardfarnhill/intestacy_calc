/**
 * DOM mocking utilities for tests
 */

// Setup a basic DOM environment for testing
export const setupTestDom = () => {
  // Create a test container
  const container = document.createElement('div');
  container.id = 'test-container';
  document.body.appendChild(container);
  
  return container;
};

// Clean up the DOM
export const cleanupTestDom = () => {
  document.body.innerHTML = '';
};

// Simulate user events
export const simulateEvents = {
  click: (element) => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  },
  
  change: (element, value) => {
    element.value = value;
    const event = new Event('change', {
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  },
  
  input: (element, value) => {
    element.value = value;
    const event = new Event('input', {
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  },
  
  submit: (formElement) => {
    const event = new Event('submit', {
      bubbles: true,
      cancelable: true
    });
    formElement.dispatchEvent(event);
  },
  
  keypress: (element, key, keyCode) => {
    const event = new KeyboardEvent('keypress', {
      bubbles: true,
      cancelable: true,
      key: key,
      keyCode: keyCode
    });
    element.dispatchEvent(event);
  }
};

// Create a snapshot of DOM state for comparison
export const createDomSnapshot = (element) => {
  if (!element) return null;
  
  const snapshot = {
    tagName: element.tagName,
    id: element.id || null,
    className: element.className || null,
    attributes: {},
    children: [],
    textContent: element.childNodes.length === 1 && 
                element.firstChild.nodeType === Node.TEXT_NODE ? 
                element.textContent.trim() : null
  };
  
  // Get all attributes
  if (element.attributes) {
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      if (attr.name !== 'id' && attr.name !== 'class') {
        snapshot.attributes[attr.name] = attr.value;
      }
    }
  }
  
  // Process all children
  for (let i = 0; i < element.children.length; i++) {
    snapshot.children.push(createDomSnapshot(element.children[i]));
  }
  
  return snapshot;
}; 