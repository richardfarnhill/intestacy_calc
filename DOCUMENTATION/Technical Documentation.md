# UK Intestacy Calculator Technical Documentation

## Core Components

### IntestacyCalculator.js
- **Purpose**: Core calculation engine
- **Key Functions**:
  - `calculateDistribution()`: Main inheritance logic
  - `validateEstateValue()`: Input validation
  - `processAnswer()`: Question flow management
- **State Management**:
  - Tracks user responses
  - Manages cohabiting status flag
  - Stores estate valuation data

### IntestacyUI.js
- **Purpose**: User interface controller
- **Key Features**:
  - Dynamic question rendering
  - Result display system
  - Accessibility layer implementation
  - Cohabiting warning persistence system
- **DOM Management**:
  - Component lifecycle handling
  - ARIA attribute management
  - Focus control

### IntestacyWidget.js
- **Purpose**: Embeddable component wrapper
- **Configuration**:
  - Theme management (light/dark)
  - Contact information injection
  - Container initialization
- **Public Methods**:
  - `reset()`: Full state reset
  - `updateOptions()`: Runtime configuration

## Implementation Details

### State Management
```javascript
// Example state structure
{
  estateValue: 500000,
  married: false,
  cohabiting: true,
  children: 2,
  // ... other relationship statuses
}
```

### CSS Architecture
- **Core Styles**: `/src/styles/main.css`
- **Key Classes**:
  - `.intestacy-cohabiting-warning` (persistent warnings)
  - `.intestacy-accessible-link` (contact info formatting)
  - `.intestacy-theme-dark` (dark mode override)
- **Animation Framework**:
  - Pulsing warning animations
  - Smooth question transitions

### Event Handling
- Keyboard navigation system
- Screen reader optimizations
- Mobile touch event support

## Build Process

### Toolchain
- Rollup.js bundling
- Babel transpilation (ES6+ support)
- CSS minification
- Netlify deployment pipeline

### Dependencies
```json
"dependencies": {
  "focus-visible": "^5.2.0",
  "lodash-es": "^4.17.21"
}
```

## Testing Strategy

### Unit Testing
- Jest test framework
- 85%+ coverage requirement
- Key test areas:
  - Inheritance calculations
  - State transitions
  - Edge case handling

### Integration Testing
- Cypress end-to-end tests
- Cross-browser validation
- Accessibility audits (axe-core)

### Planned Testing Improvements (HIGH PRIORITY)
- Enhanced integration tests to verify the complete question flow
  - Test all possible question paths
  - Validate state transitions between questions
  - Ensure proper UI updates based on answers
- Additional unit tests for UI and calculator components
  - Test method existence and compatibility
  - Validate component interactions
  - Ensure proper error handling
- Automated checks for method compatibility
  - Static analysis tools
  - Runtime checks for critical methods
  - Interface validation

### Type Safety Implementation (HIGH PRIORITY)
- TypeScript adoption for improved type safety
  - Prevent method mismatch issues
  - Ensure proper parameter types
  - Document component interfaces
- Migration strategy:
  - Phase 1: Add JSDoc type annotations to existing JavaScript
  - Phase 2: Convert core files to TypeScript (.ts)
  - Phase 3: Complete codebase migration
- Benefits:
  - Early error detection
  - Improved developer experience
  - Self-documenting code
  - Better IDE support

## Compliance
- WCAG 2.1 AA Certification
- GDPR Data Protection
- UK Legal Standards Adherence

## Distribution Data Structure

The calculator returns distribution data in the following format:

```javascript
{
  shares: number[],      // Array of monetary amounts for each beneficiary
  labels: string[],      // Array of labels for each share
  colors: string[],      // Array of colors for visualization
  beneficiaries: string[], // Array of beneficiary names/types
  totalValue: number     // Total estate value
}
```

### Example Distribution Data
```javascript
{
  "shares": [389540, 67540],
  "labels": ["Spouse/Civil Partner", "Children"],
  "colors": ["#4B9CD3", "#95D47A"],
  "beneficiaries": ["Spouse/Civil Partner", "Children"],
  "totalValue": 457080
}
```

---

**Last Updated**: 4 March 2025  
**Technical Lead**: Richard Farnhill  
**Version**: 1.0.0
