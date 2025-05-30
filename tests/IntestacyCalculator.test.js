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
      const nextQuestion = calculator.processAnswer('married', true);
      expect(calculator.state.married).toBe(true);
      expect(nextQuestion).toBe('children');
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
    });
    
    test('should handle married with children and estate below statutory legacy', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 300000;
      calculator.state.married = true;
      calculator.state.children = true;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £300,000.00 will pass to your spouse/civil partner.');
    });
    
    test('should handle married with children and estate above statutory legacy', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = true;
      calculator.state.children = true;
      calculator.state.childrenDeceased = false; // Assuming no deceased children for this original test
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your spouse/civil partner will receive:');
      expect(result.text).toContain('First £322,000.00 as statutory legacy');
      expect(result.text).toContain('Plus a life interest in £89,000.00 (half of the remainder)');
      expect(result.text).toContain('Your children will share: £89,000.00 (half of the remainder). The capital of your spouse\'s life interest portion will pass to the children upon your spouse\'s death.');
    });

    test('should handle married with children and estate equal to statutory legacy', () => {
      calculator.state.name = 'Jane Doe';
      calculator.state.estateValue = 322000; // Statutory legacy amount
      calculator.state.married = true;
      calculator.state.children = true;
      calculator.state.childrenDeceased = false;

      const result = calculator.calculateDistribution();
      // If estate is exactly statutory legacy, spouse gets all, no remainder for children.
      expect(result.text).toContain('Your entire estate of £322,000.00 will pass to your spouse/civil partner.');
    });
    
    test('should handle unmarried with children', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = true;
      calculator.state.childrenDeceased = false; // Assuming no deceased children for this original test
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living children.');
    });

    test('should handle unmarried with children (some deceased WITHOUT issue)', () => {
      calculator.state.name = 'Peter Pan';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = true;
      calculator.state.childrenDeceased = true;
      calculator.state.deceasedChildrenHadChildren = false; // Deceased children had no issue

      const result = calculator.calculateDistribution();
      // The estate should be divided among the living children.
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living children.');
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
    });

    test('should handle married with children (some deceased WITHOUT issue) and estate above statutory legacy', () => {
      calculator.state.name = 'Alice Wonderland';
      calculator.state.estateValue = 600000; // £322,000 statutory legacy + £278,000 remainder
      calculator.state.married = true;
      calculator.state.children = true;
      calculator.state.childrenDeceased = true;
      calculator.state.deceasedChildrenHadChildren = false; // Deceased children had no issue

      const result = calculator.calculateDistribution();
      // Spouse: 322,000 + life interest in (278,000 / 2) = 322,000 + life interest in 139,000
      // Living Children share: 139,000 absolutely + reversionary interest in spouse's life interest.
      expect(result.text).toContain('Your spouse/civil partner will receive:');
      expect(result.text).toContain('First £322,000.00 as statutory legacy');
      expect(result.text).toContain('Plus a life interest in £139,000.00 (half of the remainder)');
      expect(result.text).toContain('Your living children will share: £139,000.00 (half of the remainder). The capital of your spouse\'s life interest portion will pass to the children upon your spouse\'s death.');
    });
    
    test('should handle unmarried with no children but living parents', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = true;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will pass to your surviving parent(s) in equal shares.');
    });
    
    test('should handle unmarried with no children, no parents, but full siblings', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;
      calculator.state.fullSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = false; // No deceased siblings with children
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full siblings.');
    });

    test('should handle unmarried, no children, no parents, full siblings (some deceased WITHOUT issue)', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;
      calculator.state.fullSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = false; // Assuming this means deceased siblings had no children to inherit

      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full siblings.');
    });
    
    test('should handle unmarried with no children, no parents, but full siblings (some deceased with children)', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;
      calculator.state.fullSiblings = true;
      calculator.state.siblingsDeceasedWithChildren = true; // Key change for this test
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full siblings and the children of your deceased full siblings (who will share their parent\'s portion per stirpes).');
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
      calculator.state.siblingsDeceasedWithChildren = false; // No deceased half-siblings with children
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living half-siblings.');
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
      calculator.state.siblingsDeceasedWithChildren = false; // Assuming this means deceased half-siblings had no children
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living half-siblings.');
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
      calculator.state.auntsUnclesDeceasedWithChildren = false; // No deceased aunts/uncles with children
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full aunts and uncles.');
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
      calculator.state.auntsUnclesDeceasedWithChildren = false; // Assuming this means deceased aunts/uncles had no children
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full aunts and uncles.');
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
      calculator.state.auntsUnclesDeceasedWithChildren = true; // Key change for this test
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living full aunts and uncles and the children of your deceased full aunts and uncles (who will share their parent\'s portion per stirpes).');
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
      calculator.state.auntsUnclesDeceasedWithChildren = false; // No deceased half-aunts/uncles with children
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living half-aunts and half-uncles.');
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
      calculator.state.auntsUnclesDeceasedWithChildren = false; // Assuming this means deceased half-aunts/uncles had no children
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living half-aunts and half-uncles.');
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
    });
    
    test('should handle cohabiting with children', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.cohabiting = true;
      calculator.state.children = true;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('class="intestacy-cohabiting-warning"');
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your cohabiting partner will not automatically inherit anything');
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your living children');
    });
    
    test('should handle cohabiting with no children but living parents', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.cohabiting = true;
      calculator.state.children = false;
      calculator.state.parentsAlive = true;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('class="intestacy-cohabiting-warning"');
      expect(result.text).toContain('Warning: As a cohabiting partner, you have no automatic inheritance rights under UK law');
      expect(result.text).toContain('Your cohabiting partner will not automatically inherit anything');
      expect(result.text).toContain('Your entire estate of £500,000.00 will pass to your surviving parent(s) in equal shares');
    });
  });
  
  describe('canDetermineDistribution', () => {
    test('should require knowing if married person has children', () => {
      calculator.state.married = true;
      calculator.state.children = null; // We don't know yet if they have children
      
      expect(calculator.canDetermineDistribution()).toBe(false);
    });
    
    test('should correctly handle married with no children', () => {
      calculator.state.married = true;
      calculator.state.children = false; // They have no children
      
      expect(calculator.canDetermineDistribution()).toBe(true);
    });
    
    test('should correctly handle married with children and estate below statutory legacy', () => {
      calculator.state.married = true;
      calculator.state.children = true;
      calculator.state.estateValue = 300000; // Below statutory legacy
      
      expect(calculator.canDetermineDistribution()).toBe(true);
    });
    
    test('should require more information for married with children and estate above statutory legacy', () => {
      calculator.state.married = true;
      calculator.state.children = true;
      calculator.state.estateValue = 500000; // Above statutory legacy
      calculator.state.childrenDeceased = null; // Unknown if any children are deceased
      
      expect(calculator.canDetermineDistribution()).toBe(false);
      
      // Once we know if children are deceased
      calculator.state.childrenDeceased = false;
      expect(calculator.canDetermineDistribution()).toBe(true);
      
      // If children are deceased, need to know if they had children
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
      calculator.state.auntsUnclesDeceasedWithChildren = true; // Assuming true for completion
      expect(calculator.canDetermineDistribution()).toBe(true);
    });

    test('should correctly determine when more sibling info is needed for unmarried, no children, no parents', () => {
      calculator.resetState();
      calculator.state.married = false;
      calculator.state.children = false;
      calculator.state.parentsAlive = false;
      calculator.state.siblings = true;

      // Scenario: Siblings true, but fullSiblings is null, halfSiblings is false
      calculator.state.fullSiblings = null;
      calculator.state.halfSiblings = false;
      expect(calculator.canDetermineDistribution()).toBe(false);

      // Scenario: Siblings true, fullSiblings is false, halfSiblings is null
      calculator.state.fullSiblings = false;
      calculator.state.halfSiblings = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      // Scenario: Siblings true, fullSiblings is true, but siblingsDeceasedWithChildren is null
      calculator.state.fullSiblings = true;
      calculator.state.halfSiblings = false; // Explicitly set
      calculator.state.siblingsDeceasedWithChildren = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      // Scenario: Siblings true, fullSiblings is false, halfSiblings is true, but siblingsDeceasedWithChildren is null
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

      // Scenario: auntsUncles true, but fullAuntsUncles is null, halfAuntsUncles is false
      calculator.state.fullAuntsUncles = null;
      calculator.state.halfAuntsUncles = false;
      expect(calculator.canDetermineDistribution()).toBe(false);

      // Scenario: auntsUncles true, fullAuntsUncles is false, halfAuntsUncles is null
      calculator.state.fullAuntsUncles = false;
      calculator.state.halfAuntsUncles = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      // Scenario: auntsUncles true, fullAuntsUncles is true, but auntsUnclesDeceasedWithChildren is null
      calculator.state.fullAuntsUncles = true;
      calculator.state.halfAuntsUncles = false; // Explicitly set
      calculator.state.auntsUnclesDeceasedWithChildren = null;
      expect(calculator.canDetermineDistribution()).toBe(false);

      // Scenario: auntsUncles true, fullAuntsUncles is false, halfAuntsUncles is true, but auntsUnclesDeceasedWithChildren is null
      calculator.state.fullAuntsUncles = false;
      calculator.state.halfAuntsUncles = true;
      calculator.state.auntsUnclesDeceasedWithChildren = null;
      expect(calculator.canDetermineDistribution()).toBe(false);
    });


  });
});