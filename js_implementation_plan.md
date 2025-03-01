# JavaScript Implementation Plan for Intestacy Calculator

## Project Structure

```
intestacy-calculator/
├── src/
│   ├── core/
│   │   ├── IntestacyCalculator.js     # Core calculation logic
│   │   ├── QuestionFlow.js            # Question flow management
│   │   └── ValidationUtils.js         # Input validation utilities
│   ├── ui/
│   │   ├── IntestacyUI.js             # Main UI controller
│   │   ├── QuestionRenderer.js        # Renders questions
│   │   ├── ResultRenderer.js          # Renders results
│   │   └── components/                # UI components
│   │       ├── Button.js
│   │       ├── Input.js
│   │       ├── RadioGroup.js
│   │       └── ResultBox.js
│   ├── integration/
│   │   ├── IntestacyWidget.js         # Main widget for embedding
│   │   ├── EmbedHelper.js             # Helper for different embedding scenarios
│   │   └── Analytics.js               # Optional analytics integration
│   └── styles/
│       ├── main.css                   # Base styles
│       ├── themes/                    # Theming options
│       │   ├── light.css
│       │   └── dark.css
│       └── responsive.css             # Responsive design rules
├── dist/                              # Built distribution files
│   ├── intestacy-calculator.js        # Full bundle
│   ├── intestacy-calculator.min.js    # Minified bundle
│   └── intestacy-calculator.css       # Compiled CSS
├── examples/                          # Integration examples
│   ├── basic.html                     # Basic implementation
│   ├── custom-theme.html              # Custom styling example
│   ├── website-embed.html             # Website embedding example
│   └── email-compatible.html          # Email-friendly version
├── tests/                             # Test suite
│   ├── unit/                          # Unit tests
│   └── integration/                   # Integration tests
├── package.json                       # Project configuration
└── README.md                          # Documentation
```

## Core Components Design

### IntestacyCalculator.js

This will be the JavaScript equivalent of the Python `IntestacyCalculator` class:

```javascript
class IntestacyCalculator {
  constructor() {
    // Constants
    this.STATUTORY_LEGACY = 322000.00;
    
    // State initialization
    this.state = {
      name: null,
      estateValue: null,
      married: null,
      children: null,
      // ... other state properties from Python version
    };
    
    // Question definitions and flow logic
    this.questions = [
      // ... question definitions from Python version
    ];
    
    // Create question map
    this.questionMap = this.createQuestionMap();
    
    // Define question flow logic
    this.questionFlow = this.defineQuestionFlow();
  }
  
  // Methods from Python version, converted to JavaScript:
  validateEstateValue(value) { /* ... */ }
  formatCurrency(amount) { /* ... */ }
  calculateDistribution() { /* ... */ }
  processAnswer(questionId, answer) { /* ... */ }
  getQuestionText(questionId) { /* ... */ }
  canDetermineDistribution() { /* ... */ }
  
  // Helper methods
  createQuestionMap() { /* ... */ }
  defineQuestionFlow() { /* ... */ }
}

export default IntestacyCalculator;
```

### QuestionFlow.js

Manages the flow of questions based on user answers:

```javascript
class QuestionFlow {
  constructor(questions, flowLogic) {
    this.questions = questions;
    this.flowLogic = flowLogic;
    this.currentQuestionId = null;
  }
  
  start() {
    // Start with first question
    return this.questions[0].id;
  }
  
  next(currentQuestionId, answer) {
    // Determine next question based on current answer
    if (this.flowLogic[currentQuestionId]) {
      return this.flowLogic[currentQuestionId](answer);
    }
    return null;
  }
  
  getQuestion(questionId) {
    return this.questions.find(q => q.id === questionId);
  }
}

export default QuestionFlow;
```

## UI Components Design

### IntestacyUI.js

Main UI controller that coordinates the user interface:

```javascript
import IntestacyCalculator from '../core/IntestacyCalculator';
import QuestionRenderer from './QuestionRenderer';
import ResultRenderer from './ResultRenderer';

class IntestacyUI {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    
    this.options = {
      theme: 'light',
      contactInfo: 'Please contact us to discuss creating a Will.',
      ...options
    };
    
    this.calculator = new IntestacyCalculator();
    this.questionRenderer = new QuestionRenderer(this.container);
    this.resultRenderer = new ResultRenderer(this.container);
    
    this.state = {
      currentStep: 'name',
      questionId: null,
      name: '',
      estateValue: null
    };
    
    this.init();
  }
  
  init() {
    // Create UI structure
    this.createUIStructure();
    
    // Add event listeners
    this.addEventListeners();
    
    // Start with name input
    this.showNameInput();
  }
  
  createUIStructure() { /* ... */ }
  addEventListeners() { /* ... */ }
  
  // UI state management methods
  showNameInput() { /* ... */ }
  showEstateInput() { /* ... */ }
  showStatusInput() { /* ... */ }
  showQuestion(questionId) { /* ... */ }
  showResult() { /* ... */ }
  
  // Event handlers
  handleNameSubmit(name) { /* ... */ }
  handleEstateSubmit(value) { /* ... */ }
  handleStatusSubmit(status) { /* ... */ }
  handleQuestionAnswer(answer) { /* ... */ }
  handleRestart() { /* ... */ }
}

export default IntestacyUI;
```

### Integration Widget

```javascript
import IntestacyUI from '../ui/IntestacyUI';
import '../styles/main.css';

class IntestacyWidget {
  constructor(options = {}) {
    this.options = {
      container: '#intestacy-calculator',
      theme: 'light',
      contactInfo: 'Please contact us to discuss creating a Will.',
      ...options
    };
    
    this.init();
  }
  
  init() {
    // Apply theme
    this.applyTheme();
    
    // Initialize UI
    this.ui = new IntestacyUI(
      this.options.container, 
      this.options
    );
  }
  
  applyTheme() {
    const container = typeof this.options.container === 'string'
      ? document.querySelector(this.options.container)
      : this.options.container;
      
    if (container) {
      container.classList.add(`intestacy-theme-${this.options.theme}`);
    }
  }
}

// Make available globally when included via script tag
if (typeof window !== 'undefined') {
  window.IntestacyWidget = IntestacyWidget;
}

export default IntestacyWidget;
```

## Development Phases

### Phase 1: Core Logic (Week 1)
- Implement IntestacyCalculator.js
- Implement QuestionFlow.js
- Implement ValidationUtils.js
- Write unit tests for core logic

### Phase 2: Basic UI (Week 2)
- Implement basic UI components
- Create question rendering
- Implement result display
- Add basic styling

### Phase 3: Integration Framework (Week 3)
- Create widget wrapper
- Implement theming system
- Add responsive design
- Create basic examples

### Phase 4: Testing & Refinement (Week 4)
- Cross-browser testing
- Mobile testing
- Performance optimization
- Documentation

## Next Steps

1. Set up the project structure and build system
2. Implement the core IntestacyCalculator class
3. Create basic UI components
4. Develop a simple prototype to validate the approach

Once we have a working prototype, we can refine the implementation and add more advanced features like theming, analytics, and additional integration options.