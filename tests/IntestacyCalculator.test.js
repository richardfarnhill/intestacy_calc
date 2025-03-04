/**
 * Tests for the IntestacyCalculator class
 */

import IntestacyCalculator from '../src/core/IntestacyCalculator.js';

describe('IntestacyCalculator', () => {
  let calculator;
  
  beforeEach(() => {
    calculator = new IntestacyCalculator();
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
  
  describe('processAnswer', () => {
    test('should update state and return next question', () => {
      const nextQuestion = calculator.processAnswer('married', true);
      expect(calculator.state.married).toBe(true);
      expect(nextQuestion).toBe('children');
    });
    
    test('should handle end of question flow', () => {
      calculator.state.married = true;
      calculator.state.children = true;
      const nextQuestion = calculator.processAnswer('childrenDeceased', false);
      expect(calculator.state.childrenDeceased).toBe(false);
      expect(nextQuestion).toBeNull();
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
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your spouse/civil partner will receive:');
      expect(result.text).toContain('First £322,000.00 as statutory legacy');
      expect(result.text).toContain('Plus £89,000.00 (half of the remainder)');
      expect(result.text).toContain('Your children will share: £89,000.00');
    });
    
    test('should handle unmarried with children', () => {
      calculator.state.name = 'John Doe';
      calculator.state.estateValue = 500000;
      calculator.state.married = false;
      calculator.state.children = true;
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your children.');
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
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your full siblings.');
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
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your half-siblings.');
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
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your aunts and uncles.');
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
      
      const result = calculator.calculateDistribution();
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your half-aunts and half-uncles.');
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
      expect(result.text).toContain('Your entire estate of £500,000.00 will be divided equally between your children');
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
  });
});