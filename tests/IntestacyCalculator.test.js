/**
 * Tests for the IntestacyCalculator class
 */

import IntestacyCalculator from '../src/core/IntestacyCalculator.js';

describe('IntestacyCalculator', () => {
  let calculator;
  
  beforeEach(() => {
    calculator = new IntestacyCalculator();
  });

  describe('initialization', () => {
    test('should initialize with default state values', () => {
      expect(calculator.state.name).toBe('');
      expect(calculator.state.estateValue).toBe(0);
      expect(calculator.state.married).toBeNull();
      expect(calculator.state.cohabiting).toBeNull();
      expect(calculator.state.children).toBeNull();
      expect(calculator.state.childrenDeceased).toBeNull();
      expect(calculator.state.deceasedChildrenHadChildren).toBeNull();
      expect(calculator.state.parentsAlive).toBeNull();
      expect(calculator.state.siblings).toBeNull();
      expect(calculator.state.fullSiblings).toBeNull();
      expect(calculator.state.halfSiblings).toBeNull();
      expect(calculator.state.siblingsDeceasedWithChildren).toBeNull();
      expect(calculator.state.grandparents).toBeNull();
      expect(calculator.state.auntsUncles).toBeNull();
      expect(calculator.state.fullAuntsUncles).toBeNull();
      expect(calculator.state.halfAuntsUncles).toBeNull();
      expect(calculator.state.auntsUnclesDeceasedWithChildren).toBeNull();
    });
  });
  
  describe('validateEstateValue', () => {
    test('should return valid for positive numbers', () => {
      const result = calculator.validateEstateValue(100000);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBe('');
    });
    
    test('should return invalid for negative numbers', () => {
      const result = calculator.validateEstateValue(-100);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Your estate value must be greater than £0');
    });
    
    test('should return invalid for zero', () => {
      const result = calculator.validateEstateValue(0);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Your estate value must be greater than £0');
    });
    
    test('should return invalid for null', () => {
      const result = calculator.validateEstateValue(null);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter your estate value');
    });
    
    test('should return invalid for non-numeric values', () => {
      const result = calculator.validateEstateValue('abc');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Please enter a valid number');
    });
  });
  
  describe('formatCurrency', () => {
    test('should format currency correctly', () => {
      expect(calculator.formatCurrency(1000)).toBe('£1,000.00');
      expect(calculator.formatCurrency(1234567.89)).toBe('£1,234,567.89');
      expect(calculator.formatCurrency(0)).toBe('£0.00');
    });
  });
  
  describe('resetState', () => {
    test('should reset all state properties to their initial values', () => {
      // Modify some state
      calculator.state.name = 'Test User';
      calculator.state.estateValue = 100000;
      calculator.state.married = true;
      calculator.state.cohabiting = false;
      calculator.state.children = true;
      calculator.state.childrenDeceased = true;
      calculator.state.deceasedChildrenHadChildren = true;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;
      calculator.state.fullSiblings = true;

      calculator.resetState();

      expect(calculator.state.name).toBe('');
      expect(calculator.state.estateValue).toBe(0);
      expect(calculator.state.married).toBeNull();
      expect(calculator.state.cohabiting).toBeNull();
      expect(calculator.state.children).toBeNull();
      expect(calculator.state.childrenDeceased).toBeNull();
      expect(calculator.state.deceasedChildrenHadChildren).toBeNull();
      expect(calculator.state.parentsAlive).toBeNull();
      expect(calculator.state.siblings).toBeNull();
      expect(calculator.state.fullSiblings).toBeNull();
      expect(calculator.state.halfSiblings).toBeNull();
      expect(calculator.state.siblingsDeceasedWithChildren).toBeNull();
      expect(calculator.state.grandparents).toBeNull();
      expect(calculator.state.auntsUncles).toBeNull();
      expect(calculator.state.fullAuntsUncles).toBeNull();
      expect(calculator.state.halfAuntsUncles).toBeNull();
      expect(calculator.state.auntsUnclesDeceasedWithChildren).toBeNull();
    });
  });

  describe('processAnswer', () => {
    test('should update state and return next question', () => {
      const nextQuestion = calculator.processAnswer('children', true);
      expect(calculator.state.children).toBe(true);
      expect(nextQuestion).toBe('childrenDeceased');
    });
    
    test('should handle end of question flow', () => {
      calculator.state.married = true;
      calculator.state.estateValue = 500000; // Assume estate > statutory legacy for this path
      calculator.state.children = true;
      const nextQuestion = calculator.processAnswer('childrenDeceased', false);
      expect(calculator.state.childrenDeceased).toBe(false);
      expect(nextQuestion).toBeNull();
    });

    test('should end question flow early if married with children and estate below statutory legacy', () => {
      calculator.resetState();
      calculator.state.married = true;
      calculator.state.estateValue = 100000; // Below statutory legacy (322,000)
      // First question after marital status would be 'children'
      const nextQ = calculator.processAnswer('children', true); 
      expect(calculator.state.children).toBe(true);
      // Since estate is low, no further questions about deceased children are needed.
      expect(nextQ).toBeNull(); 
    });
  });
  
  describe('calculateDistribution', () => {
    test('should handle married with no children', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = true;
      calculator.state.children = false;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will pass to your spouse/civil partner.');
      expect(result.data.shares).toEqual([500000]);
      expect(result.data.labels).toEqual(['Spouse/Civil Partner']);
      expect(result.data.beneficiaries).toEqual(['Spouse/Civil Partner']);
      expect(result.data.colors).toEqual(['#4B9CD3']);
    });
    
    test('should handle married with children and estate below statutory legacy', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 300000;
      calculator.state.married = true;
      calculator.state.children = true;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £300,000.00 will pass to your spouse/civil partner.');
      expect(result.data.shares).toEqual([300000]);
      expect(result.data.labels).toEqual(['Spouse/Civil Partner']);
      expect(result.data.beneficiaries).toEqual(['Spouse/Civil Partner']);
    });
    
    test('should handle married with children and estate above statutory legacy', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = true;
      calculator.state.children = true;
      calculator.state.childrenDeceased = false; 
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your spouse/civil partner will receive:');
      expect(result.text).toContain('First £322,000.00 as statutory legacy');
      expect(result.text).toContain('Plus an absolute interest in £89,000.00 (half of the remainder)');
      expect(result.text).toContain('Your children will share: £89,000.00 (half of the remainder). The children\'s share of the residue is held on statutory trusts.');
      expect(result.text).toContain('• The capital of your spouse\'s absolute interest portion will pass to the children upon your spouse\'s death.');
      expect(result.data.shares).toEqual([322000 + (500000 - 322000) / 2, (500000 - 322000) / 2]);
      expect(result.data.labels).toEqual(['Spouse/Civil Partner', 'Children']);
      expect(result.data.beneficiaries).toEqual(['Spouse/Civil Partner', 'Children']);
    });

    test('should handle married with children and estate equal to statutory legacy', () => {
      calculator.state.name = 'Jane Doe';
      calculator.state.estateValue = 322000; 
      calculator.state.married = true;
      calculator.state.children = true;
      calculator.state.childrenDeceased = false;

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £322,000.00 will pass to your spouse/civil partner.');
      expect(result.data.shares).toEqual([322000]);
      expect(result.data.labels).toEqual(['Spouse/Civil Partner']);
    });
    
    test('should handle unmarried with children', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = true;
      calculator.state.childrenDeceased = false; 
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living children.');
      expect(result.data.shares).toEqual([500000]);
      expect(result.data.labels).toEqual(['Children']);
      expect(result.data.beneficiaries).toEqual(['Children']);
    });

    test('should handle unmarried with children (some deceased WITHOUT issue)', () => {
      calculator.state.name = 'Peter Pan';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = true;
      calculator.state.childrenDeceased = true;
      calculator.state.deceasedChildrenHadChildren = false; 

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living children.');
      expect(result.data.labels).toEqual(['Children']);
    });
    
    test('should handle unmarried with children where some children are deceased with their own children', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = true;
      calculator.state.childrenDeceased = true;
      calculator.state.deceasedChildrenHadChildren = true;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living children and the children of your deceased children (who will share their parent\'s portion per stirpes).');
      expect(result.data.labels).toEqual(['Children']);
    });

    test('should handle married with children (some deceased WITHOUT issue) and estate above statutory legacy', () => {
      calculator.state.name = 'Alice Wonderland';
      calculator.state.estateValue = 600000; 
      calculator.state.married = true;
      calculator.state.children = true;
      calculator.state.childrenDeceased = true;
      calculator.state.deceasedChildrenHadChildren = false; 

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your spouse/civil partner will receive:');
      expect(result.text).toContain('First £322,000.00 as statutory legacy');
      expect(result.text).toContain('Plus an absolute interest in £139,000.00 (half of the remainder)');
      expect(result.text).toContain('Your living children will share: £139,000.00 (half of the remainder). The children\'s share of the residue is held on statutory trusts.');
      expect(result.text).toContain('• The capital of your spouse\'s absolute interest portion will pass to the children upon your spouse\'s death.');
      expect(result.data.labels).toEqual(['Spouse/Civil Partner', 'Children']);
    });
    
    test('should handle unmarried with no children but living parents', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = true;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will pass to your surviving parent(s) in equal shares.');
      expect(result.data.labels).toEqual(['Parents']);
    });
    
    test('should handle unmarried with no children, no parents, but full siblings', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;
      calculator.state.fullSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = false; 
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full siblings.');
      expect(result.data.labels).toEqual(['Full Siblings']);
    });

    test('should handle unmarried, no children, no parents, full siblings (some deceased WITHOUT issue)', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;
      calculator.state.fullSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = false; 

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full siblings.');
      expect(result.data.labels).toEqual(['Full Siblings']);
    });
    
    test('should handle unmarried with no children, no parents, but full siblings (some deceased with children)', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;
      calculator.state.fullSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = true; 
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full siblings and the children of your deceased full siblings (who will share their parent\'s portion per stirpes).');
      expect(result.data.labels).toEqual(['Full Siblings']);
    });
    
    test('should handle unmarried with no children, no parents, no full siblings, but half siblings', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;
      calculator.state.fullSiblings = false;
      calculator.state.halfSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = false; 
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living half-siblings.');
      expect(result.data.labels).toEqual(['Half-Siblings']);
    });

    test('should handle unmarried, no children, no parents, no full siblings, half siblings (some deceased WITHOUT issue)', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;
      calculator.state.fullSiblings = false;
      calculator.state.halfSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = false; 
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living half-siblings.');
      expect(result.data.labels).toEqual(['Half-Siblings']);
    });
    
    test('should handle unmarried with no children, no parents, no siblings, but living grandparents', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = true;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your grandparents.');
      expect(result.data.labels).toEqual(['Grandparents']);
    });
    
    test('should handle unmarried with no children, no parents, no siblings, no grandparents, but full aunts/uncles', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = true;
      calculator.state.fullAuntsUncles = true;
      calculator.state.auntsUnclesDeceasedWithChildren = false; 
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full aunts and uncles.');
      expect(result.data.labels).toEqual(['Full Aunts and Uncles']);
    });

    test('should handle unmarried, no children, no parents, no siblings, no grandparents, full aunts/uncles (some deceased WITHOUT issue)', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = true;
      calculator.state.fullAuntsUncles = true;
      calculator.state.auntsUnclesDeceasedWithChildren = false; 
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full aunts and uncles.');
      expect(result.data.labels).toEqual(['Full Aunts and Uncles']);
    });
    
    test('should handle unmarried with no children, no parents, no siblings, no grandparents, but full aunts/uncles (some deceased with children)', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = true;
      calculator.state.fullAuntsUncles = true;
      calculator.state.auntsUnclesDeceasedWithChildren = true; 
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full aunts and uncles and the children of your deceased full aunts and uncles (who will share their parent\'s portion per stirpes).');
      expect(result.data.labels).toEqual(['Full Aunts and Uncles']);
    });
    
    test('should handle unmarried with no children, no parents, no siblings, no grandparents, no full aunts/uncles, but half aunts/uncles', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = true;
      calculator.state.fullAuntsUncles = false;
      calculator.state.halfAuntsUncles = true;
      calculator.state.auntsUnclesDeceasedWithChildren = false; 
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living half-aunts and half-uncles.');
      expect(result.data.labels).toEqual(['Half-Aunts and Half-Uncles']);
    });

    test('should handle unmarried, no children, no parents, no siblings, no grandparents, no full aunts/uncles, half aunts/uncles (some deceased WITHOUT issue)', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = true;
      calculator.state.fullAuntsUncles = false;
      calculator.state.halfAuntsUncles = true;
      calculator.state.auntsUnclesDeceasedWithChildren = false; 
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living half-aunts and half-uncles.');
      expect(result.data.labels).toEqual(['Half-Aunts and Half-Uncles']);
    });
    
    test('should handle bona vacantia case', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = false;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your estate of £500,000.00 will pass to the Crown (Bona Vacantia).');
      expect(result.data.labels).toEqual(['Crown (Bona Vacantia)']);
    });
    
    // --- Cohabiting Scenarios ---
    test('should handle cohabiting with children', () => {
      calculator.resetState();
      calculator.state.estateValue = 500000;
      calculator.state.cohabiting = true;
      calculator.state.married = false;
      calculator.state.children = true;
      calculator.state.childrenDeceased = false; // For text accuracy
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your cohabiting partner will not automatically inherit anything');
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living children');

      expect(result.data.shares).toEqual([500000]);
      expect(result.data.labels).toEqual(['Children']);
      expect(result.data.beneficiaries).toEqual(['Children']);
      expect(result.data.colors).toEqual(['#95D47A']);
      expect(result.data.totalValue).toBe(500000);
      expect(result.data.warnings).toContain('As a cohabiting partner, you have no automatic inheritance rights under UK law.');
    });
    
    test('should handle cohabiting with no children but living parents', () => {
      calculator.resetState();
      calculator.state.estateValue = 500000;
      calculator.state.cohabiting = true;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = true;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your cohabiting partner will not automatically inherit anything');
      expect(result.text).toContain('Your entire estate of £500,000.00 will pass to your surviving parent(s) in equal shares');

      expect(result.data.shares).toEqual([500000]);
      expect(result.data.labels).toEqual(['Parents']);
      expect(result.data.beneficiaries).toEqual(['Parents']);
      expect(result.data.colors).toEqual(['#F3C969']);
      expect(result.data.totalValue).toBe(500000);
      expect(result.data.warnings).toContain('As a cohabiting partner, you have no automatic inheritance rights under UK law.');
    });

    test('should handle cohabiting with full siblings only', () => {
      calculator.resetState(); 
      calculator.state.estateValue = 500000;
      calculator.state.cohabiting = true;
      calculator.state.married = false; 
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true; 
      calculator.state.fullSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = false;

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full siblings');

      expect(result.data.shares).toEqual([500000]);
      expect(result.data.labels).toEqual(['Full Siblings']);
      expect(result.data.beneficiaries).toEqual(['Full Siblings']);
      expect(result.data.colors).toEqual(['#E36588']);
      expect(result.data.totalValue).toBe(500000);
      expect(result.data.warnings).toContain('As a cohabiting partner, you have no automatic inheritance rights under UK law.');
    });

    test('should handle cohabiting with half siblings only (no full siblings)', () => {
      calculator.resetState();
      calculator.state.estateValue = 500000;
      calculator.state.cohabiting = true;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true; 
      calculator.state.fullSiblings = false;
      calculator.state.halfSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = false;

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living half-siblings');

      expect(result.data.shares).toEqual([500000]);
      expect(result.data.labels).toEqual(['Half-Siblings']);
      expect(result.data.beneficiaries).toEqual(['Half-Siblings']);
      expect(result.data.colors).toEqual(['#E36588']);
      expect(result.data.totalValue).toBe(500000);
      expect(result.data.warnings).toContain('As a cohabiting partner, you have no automatic inheritance rights under UK law.');
    });

    test('should handle cohabiting with grandparents', () => {
      calculator.resetState();
      calculator.state.estateValue = 500000;
      calculator.state.cohabiting = true;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false; 
      calculator.state.grandparents = true;

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your grandparents');

      expect(result.data.shares).toEqual([500000]);
      expect(result.data.labels).toEqual(['Grandparents']);
      expect(result.data.beneficiaries).toEqual(['Grandparents']);
      expect(result.data.colors).toEqual(['#9B6EBF']);
      expect(result.data.totalValue).toBe(500000);
      expect(result.data.warnings).toContain('As a cohabiting partner, you have no automatic inheritance rights under UK law.');
    });

    test('should handle cohabiting with full aunts/uncles only', () => {
      calculator.resetState();
      calculator.state.estateValue = 500000;
      calculator.state.cohabiting = true;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = true; 
      calculator.state.fullAuntsUncles = true;
      calculator.state.auntsUnclesDeceasedWithChildren = false;

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full aunts and uncles');
      
      expect(result.data.shares).toEqual([500000]);
      expect(result.data.labels).toEqual(['Full Aunts and Uncles']);
      expect(result.data.beneficiaries).toEqual(['Full Aunts and Uncles']);
      expect(result.data.colors).toEqual(['#F78E69']);
      expect(result.data.totalValue).toBe(500000);
      expect(result.data.warnings).toContain('As a cohabiting partner, you have no automatic inheritance rights under UK law.');
    });

    test('should handle cohabiting with half aunts/uncles only (no full aunts/uncles)', () => {
      calculator.resetState();
      calculator.state.estateValue = 500000;
      calculator.state.cohabiting = true;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = true; 
      calculator.state.fullAuntsUncles = false;
      calculator.state.halfAuntsUncles = true;
      calculator.state.auntsUnclesDeceasedWithChildren = false;

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living half-aunts and half-uncles');

      expect(result.data.shares).toEqual([500000]);
      expect(result.data.labels).toEqual(['Half-Aunts and Half-Uncles']);
      expect(result.data.beneficiaries).toEqual(['Half-Aunts and Half-Uncles']);
      expect(result.data.colors).toEqual(['#F78E69']);
      expect(result.data.totalValue).toBe(500000);
      expect(result.data.warnings).toContain('As a cohabiting partner, you have no automatic inheritance rights under UK law.');
    });

    test('should handle cohabiting with no surviving relatives (Crown)', () => {
      calculator.resetState();
      calculator.state.estateValue = 500000;
      calculator.state.cohabiting = true;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = false; 

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your estate of £500,000.00 will pass to the Crown (Bona Vacantia)');

      expect(result.data.shares).toEqual([500000]);
      expect(result.data.labels).toEqual(['Crown (Bona Vacantia)']);
      expect(result.data.beneficiaries).toEqual(['Crown (Bona Vacantia)']);
      expect(result.data.colors).toEqual(['#8C8C8C']);
      expect(result.data.totalValue).toBe(500000);
      expect(result.data.warnings).toContain('As a cohabiting partner, you have no automatic inheritance rights under UK law.');
    });

    test('cohabiting, no relatives, estateValue: 1005 - Crown', () => {
      calculator.resetState();
      calculator.state.estateValue = 1005;
      calculator.state.cohabiting = true;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = false;

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your estate of £1,005.00 will pass to the Crown (Bona Vacantia)');

      expect(result.data.shares).toEqual([1005]);
      expect(result.data.labels).toEqual(['Crown (Bona Vacantia)']);
      expect(result.data.beneficiaries).toEqual(['Crown (Bona Vacantia)']);
      expect(result.data.colors).toEqual(['#8C8C8C']);
      expect(result.data.totalValue).toBe(1005);
      expect(result.data.warnings).toContain('As a cohabiting partner, you have no automatic inheritance rights under UK law.');
    });

    test('cohabiting, no relatives, children=false, parents=false, siblings=false, grandparents=false, auntsUncles=false - Crown, estate 100k', () => {
      calculator.resetState();
      calculator.state.estateValue = 100000;
      calculator.state.cohabiting = true;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = false;

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your estate of £100,000.00 will pass to the Crown (Bona Vacantia)');

      expect(result.data.shares).toEqual([100000]);
      expect(result.data.labels).toEqual(['Crown (Bona Vacantia)']);
      expect(result.data.beneficiaries).toEqual(['Crown (Bona Vacantia)']);
      expect(result.data.colors).toEqual(['#8C8C8C']);
      expect(result.data.totalValue).toBe(100000);
      expect(result.data.warnings).toContain('As a cohabiting partner, you have no automatic inheritance rights under UK law.');
    });
  });
  
  describe('canDetermineDistribution', () => {
    test('should require knowing if married person has children', () => {
      calculator.state.married = true;
      calculator.state.children = null; 
      
      expect(calculator.canDetermineDistribution()).toBe(false);
    });
    
    test('should correctly handle married with no children', () => {
      calculator.state.married = true;
      calculator.state.children = false; 
      
      expect(calculator.canDetermineDistribution()).toBe(true);
    });
    
    test('should correctly handle married with children and estate below statutory legacy', () => {
      calculator.state.married = true;
      calculator.state.children = true;
      calculator.state.estateValue = 300000; 
      
      expect(calculator.canDetermineDistribution()).toBe(true);
    });
    
    test('should require more information for married with children and estate above statutory legacy', () => {
      calculator.state.married = true;
      calculator.state.children = true;
      calculator.state.estateValue = 500000; 
      calculator.state.childrenDeceased = null; 
      
      expect(calculator.canDetermineDistribution()).toBe(false);
      
      calculator.state.childrenDeceased = false;
      expect(calculator.canDetermineDistribution()).toBe(true);
      
      calculator.state.childrenDeceased = true;
      calculator.state.deceasedChildrenHadChildren = null;
      expect(calculator.canDetermineDistribution()).toBe(false);
      
      calculator.state.deceasedChildrenHadChildren = true;
      expect(calculator.canDetermineDistribution()).toBe(true);
    });
    
    test('should handle unmarried with children correctly', () => {
      calculator.state.married = false;
      calculator.state.children = true;
      calculator.state.childrenDeceased = false;
      
      expect(calculator.canDetermineDistribution()).toBe(true);
      
      calculator.state.childrenDeceased = true;
      calculator.state.deceasedChildrenHadChildren = null;
      expect(calculator.canDetermineDistribution()).toBe(false);
      
      calculator.state.deceasedChildrenHadChildren = true;
      expect(calculator.canDetermineDistribution()).toBe(true);
    });
    
    test('should handle living parents correctly', () => {
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = true;
      
      expect(calculator.canDetermineDistribution()).toBe(true);
    });

    test('should require sibling details if unmarried, no children, no parents, and siblings exist', () => {
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;

      calculator.state.fullSiblings = null;
      calculator.state.halfSiblings = null; // Ensure both are null initially
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.fullSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.siblingsDeceasedWithChildren = false;
      expect(calculator.canDetermineDistribution()).toBe(true);

      calculator.resetState();
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;
      calculator.state.fullSiblings = false; 
      calculator.state.halfSiblings = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.halfSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = null; 
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.siblingsDeceasedWithChildren = true;
      expect(calculator.canDetermineDistribution()).toBe(true);
    });

    test('should require grandparent details if no closer relatives', () => {
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.grandparents = true;
      expect(calculator.canDetermineDistribution()).toBe(true);
    });

    test('should require aunt/uncle details if no closer relatives', () => {
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = true;

      calculator.state.fullAuntsUncles = null;
      calculator.state.halfAuntsUncles = null; // Ensure both are null
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.fullAuntsUncles = true;
      calculator.state.auntsUnclesDeceasedWithChildren = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.auntsUnclesDeceasedWithChildren = false;
      expect(calculator.canDetermineDistribution()).toBe(true);
      
      calculator.resetState();
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = true;
      calculator.state.fullAuntsUncles = false;
      calculator.state.halfAuntsUncles = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.halfAuntsUncles = true;
      calculator.state.auntsUnclesDeceasedWithChildren = true; 
      expect(calculator.canDetermineDistribution()).toBe(true);
    });

    test('should correctly determine when more sibling info is needed for unmarried, no children, no parents', () => {
      calculator.resetState();
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;

      calculator.state.fullSiblings = null;
      calculator.state.halfSiblings = false;
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.fullSiblings = false;
      calculator.state.halfSiblings = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.fullSiblings = true;
      calculator.state.halfSiblings = false; 
      calculator.state.siblingsDeceasedWithChildren = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.fullSiblings = false;
      calculator.state.halfSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = null;
      expect(calculator.canDetermineDistribution()).toBe(false);
    });

    test('should correctly determine when more aunt/uncle info is needed for unmarried, no closer relatives', () => {
      calculator.resetState();
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = false;
      calculator.state.grandparents = false;
      calculator.state.auntsUncles = true;

      calculator.state.fullAuntsUncles = null;
      calculator.state.halfAuntsUncles = false;
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.fullAuntsUncles = false;
      calculator.state.halfAuntsUncles = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.fullAuntsUncles = true;
      calculator.state.halfAuntsUncles = false; 
      calculator.state.auntsUnclesDeceasedWithChildren = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      calculator.state.fullAuntsUncles = false;
      calculator.state.halfAuntsUncles = true;
      calculator.state.auntsUnclesDeceasedWithChildren = null;
      expect(calculator.canDetermineDistribution()).toBe(false);
    });
  });
});

describe('Intestacy Calculator - Single Person', () => {
  let calculator;

  beforeEach(() => {
    calculator = new IntestacyCalculator();
  });

  test('should distribute estate to parents if single with no children but parents alive', () => {
    calculator.state = {
      name: 'Single Person',
      estateValue: 300000,
      married: false,
      cohabiting: false,
      children: false,
      grandchildren: false,
      greatGrandchildren: false,
      parentsAlive: true,
      siblings: false,
      fullSiblings: false,
      halfSiblings: false,
      grandparents: false,
      auntsUncles: false,
      fullAuntsUncles: false,
      halfAuntsUncles: false,
      currentQuestion: 0,
      childrenDeceased: false,
      deceasedChildrenHadChildren: false,
      siblingsDeceasedWithChildren: false,
      auntsUnclesDeceasedWithChildren: false
    };

    const distribution = calculator.calculateDistribution();

    // Expect the distribution to go to parents
    expect(distribution.data.beneficiaries).toEqual(['Parents']);
    expect(distribution.data.shares).toEqual([300000]);
    expect(distribution.data.labels).toEqual(['Parents']);
    expect(distribution.text).toContain('Your entire estate of £300,000.00 will pass to your surviving parent(s) in equal shares.');
  });
});

describe('Intestacy Calculator - Single Person with Siblings', () => {
  let calculator;

  beforeEach(() => {
    calculator = new IntestacyCalculator();
  });

  test('should distribute estate to full siblings if single with no children, no parents but full siblings alive', () => {
    calculator.state = {
      name: 'Single Person with Siblings',
      estateValue: 400000,
      married: false,
      cohabiting: false,
      children: false,
      grandchildren: false,
      greatGrandchildren: false,
      parentsAlive: false,
      siblings: true,
      fullSiblings: true,
      halfSiblings: false,
      grandparents: false,
      auntsUncles: false,
      fullAuntsUncles: false,
      halfAuntsUncles: false,
      currentQuestion: 0,
      childrenDeceased: false,
      deceasedChildrenHadChildren: false,
      siblingsDeceasedWithChildren: false,
      auntsUnclesDeceasedWithChildren: false
    };

    const distribution = calculator.calculateDistribution();

    // Expect the distribution to go to full siblings
    expect(distribution.data.beneficiaries).toEqual(['Full Siblings']);
    expect(distribution.data.shares).toEqual([400000]);
    expect(distribution.data.labels).toEqual(['Full Siblings']);
    expect(distribution.text).toContain('Your entire estate of £400,000.00 will be divided equally between your living full siblings.');
  });
});

describe('Intestacy Calculator - Single Person with Grandparents', () => {
  let calculator;

  beforeEach(() => {
    calculator = new IntestacyCalculator();
  });

  test('should distribute estate to grandparents if single with no children, no parents, no siblings but grandparents alive', () => {
    calculator.state = {
      name: 'Single Person with Grandparents',
      estateValue: 250000,
      married: false,
      cohabiting: false,
      children: false,
      grandchildren: false,
      greatGrandchildren: false,
      parentsAlive: false,
      siblings: false,
      fullSiblings: false,
      halfSiblings: false,
      grandparents: true,
      auntsUncles: false,
      fullAuntsUncles: false,
      halfAuntsUncles: false,
      currentQuestion: 0,
      childrenDeceased: false,
      deceasedChildrenHadChildren: false,
      siblingsDeceasedWithChildren: false,
      auntsUnclesDeceasedWithChildren: false
    };

    const distribution = calculator.calculateDistribution();

    // Expect the distribution to go to grandparents
    expect(distribution.data.beneficiaries).toEqual(['Grandparents']);
    expect(distribution.data.shares).toEqual([250000]);
    expect(distribution.data.labels).toEqual(['Grandparents']);
    expect(distribution.text).toContain('Your entire estate of £250,000.00 will be divided equally between your grandparents.');
  });
});

describe('Intestacy Calculator - Single Person with Aunts and Uncles', () => {
  let calculator;

  beforeEach(() => {
    calculator = new IntestacyCalculator();
  });

  test('should distribute estate to full aunts and uncles if single with no children, no parents, no siblings, no grandparents but full aunts and uncles alive', () => {
    calculator.state = {
      name: 'Single Person with Aunts/Uncles',
      estateValue: 150000,
      married: false,
      cohabiting: false,
      children: false,
      grandchildren: false,
      greatGrandchildren: false,
      parentsAlive: false,
      siblings: false,
      fullSiblings: false,
      halfSiblings: false,
      grandparents: false,
      auntsUncles: true,
      fullAuntsUncles: true,
      halfAuntsUncles: false,
      currentQuestion: 0,
      childrenDeceased: false,
      deceasedChildrenHadChildren: false,
      siblingsDeceasedWithChildren: false,
      auntsUnclesDeceasedWithChildren: false
    };

    const distribution = calculator.calculateDistribution();

    // Expect the distribution to go to full aunts and uncles
    expect(distribution.data.beneficiaries).toEqual(['Full Aunts and Uncles']);
    expect(distribution.data.shares).toEqual([150000]);
    expect(distribution.data.labels).toEqual(['Full Aunts and Uncles']);
    expect(distribution.text).toContain('Your entire estate of £150,000.00 will be divided equally between your living full aunts and uncles.');
  });
});

describe('Intestacy Calculator - Single Person with Half Aunts and Uncles', () => {
  let calculator;

  beforeEach(() => {
    calculator = new IntestacyCalculator();
  });

  test('should distribute estate to half aunts and uncles if single with no children, no parents, no siblings, no grandparents, no full aunts/uncles but half aunts/uncles alive', () => {
    calculator.state = {
      name: 'Single Person with Half Aunts/Uncles',
      estateValue: 100000,
      married: false,
      cohabiting: false,
      children: false,
      grandchildren: false,
      greatGrandchildren: false,
      parentsAlive: false,
      siblings: false,
      fullSiblings: false,
      halfSiblings: false,
      grandparents: false,
      auntsUncles: true,
      fullAuntsUncles: false,
      halfAuntsUncles: true,
      currentQuestion: 0,
      childrenDeceased: false,
      deceasedChildrenHadChildren: false,
      siblingsDeceasedWithChildren: false,
      auntsUnclesDeceasedWithChildren: false
    };

    const distribution = calculator.calculateDistribution();

    // Expect the distribution to go to half aunts and uncles
    expect(distribution.data.beneficiaries).toEqual(['Half-Aunts and Half-Uncles']);
    expect(distribution.data.shares).toEqual([100000]);
    expect(distribution.data.labels).toEqual(['Half-Aunts and Half-Uncles']);
    expect(distribution.text).toContain('Your entire estate of £100,000.00 will be divided equally between your living half-aunts and half-uncles.');
  });
});

describe('Intestacy Calculator - Single Person with No Relatives', () => {
  let calculator;

  beforeEach(() => {
    calculator = new IntestacyCalculator();
  });

  test('should distribute estate to the Crown if single with no children and no other relatives', () => {
    calculator.state = {
      name: 'Single Person with No Relatives',
      estateValue: 50000,
      married: false,
      cohabiting: false,
      children: false,
      grandchildren: false,
      greatGrandchildren: false,
      parentsAlive: false,
      siblings: false,
      fullSiblings: false,
      halfSiblings: false,
      grandparents: false,
      auntsUncles: false,
      fullAuntsUncles: false,
      halfAuntsUncles: false,
      currentQuestion: 0,
      childrenDeceased: false,
      deceasedChildrenHadChildren: false,
      siblingsDeceasedWithChildren: false,
      auntsUnclesDeceasedWithChildren: false
    };

    const distribution = calculator.calculateDistribution();

    // Expect the distribution to go to the Crown
    expect(distribution.data.beneficiaries).toEqual(['Crown (Bona Vacantia)']);
    expect(distribution.data.shares).toEqual([50000]);
    expect(distribution.data.labels).toEqual(['Crown (Bona Vacantia)']);
    expect(distribution.text).toContain('Your estate of £50,000.00 will pass to the Crown (Bona Vacantia).');
  });
});
