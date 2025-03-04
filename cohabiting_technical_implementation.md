# Technical Implementation: Adding 'Co-habiting' Relationship Status

## Code Changes

### 1. Update IntestacyCalculator.js

#### Add to state initialization:
```javascript
// Initialize state
this.state = {
  name: null,
  estateValue: null,
  married: null,
  cohabiting: null, // New property for cohabiting status
  children: null,
  // ... rest of existing properties
};
```

#### Update calculateDistribution method:
```javascript
calculateDistribution() {
  const estateValue = parseFloat(this.state.estateValue);
  const formattedValue = this.formatCurrency(estateValue);
  
  // Cohabiting warning - add this before the spouse rules
  if (this.state.cohabiting) {
    // Create a message explaining the lack of inheritance rights for cohabitees
    return (
      `Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law.\n\n` +
      `Your estate of ${formattedValue} will be distributed as follows:\n` +
      `• Your cohabiting partner will not automatically inherit anything\n` +
      `• Your estate will pass to your relatives according to intestacy rules:\n` +
      this.getInheritanceHierarchyText(estateValue) +
      `\n\nTo protect your partner, you should create a valid Will.`
    );
  }
  
  // Existing spouse rules and other distribution logic remains unchanged
  if (this.state.married) {
    // ... existing married logic
  }
  
  // ... rest of existing distribution logic
}

// New helper method to generate the inheritance hierarchy text
getInheritanceHierarchyText(estateValue) {
  const formattedValue = this.formatCurrency(estateValue);
  
  if (this.state.children) {
    const childrenText = !this.state.childrenDeceased 
      ? "children" 
      : "living children and the children of your deceased children (who will share their parent's portion per stirpes)";
    
    return `  - Your entire estate of ${formattedValue} will be divided equally between your ${childrenText}.`;
  }
  
  if (this.state.parentsAlive) {
    return `  - Your entire estate of ${formattedValue} will pass to your surviving parent(s) in equal shares.`;
  }
  
  if (this.state.siblings) {
    if (this.state.fullSiblings) {
      const siblingType = "full siblings";
      const childrenText = this.state.siblingsDeceasedWithChildren 
        ? " (their children will inherit their share per stirpes)" 
        : "";
      
      return `  - Your entire estate of ${formattedValue} will be divided equally between your ${siblingType}${childrenText}.`;
    } else if (this.state.halfSiblings) {
      return `  - Your entire estate of ${formattedValue} will be divided equally between your half-siblings.`;
    }
  }
  
  // Continue with the rest of the inheritance hierarchy...
  // (grandparents, aunts/uncles, etc.)
  
  return `  - Your estate of ${formattedValue} will pass to the Crown (Bona Vacantia).`;
}
```

### 2. Update IntestacyUI.js

#### Update the relationship status radio buttons in createUIStructure:
```javascript
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
```

#### Update the handleStatusSubmit method:
```javascript
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
  this.calculator.state.married = (selectedStatus === 'married');
  this.calculator.state.cohabiting = (selectedStatus === 'cohabiting');
  
  // Start the question flow
  this.showQuestion('children');
}
```

### 3. Update IntestacyCalculator.test.js

Add new test cases for cohabiting status:

```javascript
describe('calculateDistribution', () => {
  // ... existing tests
  
  test('should handle cohabiting with children', () => {
    calculator.state.name = 'John Doe';
    calculator.state.estateValue = 500000;
    calculator.state.married = false;
    calculator.state.cohabiting = true;
    calculator.state.children = true;
    
    const result = calculator.calculateDistribution();
    expect(result).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
    expect(result).toContain('Your cohabiting partner will not automatically inherit anything');
    expect(result).toContain('Your entire estate of £500,000.00 will be divided equally between your children');
  });
  
  test('should handle cohabiting with no children but living parents', () => {
    calculator.state.name = 'John Doe';
    calculator.state.estateValue = 500000;
    calculator.state.married = false;
    calculator.state.cohabiting = true;
    calculator.state.children = false;
    calculator.state.parentsAlive = true;
    
    const result = calculator.calculateDistribution();
    expect(result).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
    expect(result).toContain('Your cohabiting partner will not automatically inherit anything');
    expect(result).toContain('Your entire estate of £500,000.00 will pass to your surviving parent(s) in equal shares');
  });
});
```

## CSS Styling Considerations

We may want to add some styling to highlight the warning message for cohabiting users. This could be added to the main.css file:

```css
.intestacy-cohabiting-warning {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 4px;
}
```

Then update the calculateDistribution method to wrap the warning in this class:

```javascript
if (this.state.cohabiting) {
  return (
    `<div class="intestacy-cohabiting-warning">` +
    `Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law.` +
    `</div>\n\n` +
    // ... rest of the message
  );
}
```

## Testing Strategy

1. Unit tests: Add the new test cases to verify the cohabiting logic
2. Manual testing:
   - Verify that the new radio button appears correctly
   - Test the flow by selecting the cohabiting option
   - Verify the warning message appears correctly
   - Test with different combinations of other answers (with/without children, etc.)
   - Ensure the distribution calculation remains accurate

## Deployment Considerations

This change is relatively small and focused, so it should be straightforward to deploy. However, we should:

1. Run the full test suite to ensure no regressions
2. Consider adding a note to the changelog about the new feature
3. Update any documentation that describes the relationship status options