import IntestacyCalculator from '../src/core/IntestacyCalculator.js';

describe('Intestacy Calculator - Cohabiting with No Children', () => {
  let calculator;

  beforeEach(() => {
    calculator = new IntestacyCalculator();
  });

  test('should distribute estate to the Crown for cohabiting with no children and no other relatives', () => {
    calculator.state = {
      name: 'Test User',
      estateValue: 570000,
      married: false,
      cohabiting: true,
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

    // Expect the cohabiting warning to be present
    expect(distribution.text).toContain('As a cohabiting partner, you have no automatic inheritance rights under UK law.');
    
    // Expect the distribution data and text to reflect the Crown inheriting
    expect(distribution.data.beneficiaries).toEqual(['Crown (Bona Vacantia)']);
    expect(distribution.data.shares).toEqual([570000]);
    expect(distribution.data.labels).toEqual(['Crown (Bona Vacantia)']);
    expect(distribution.text).toContain('Your estate of £570,000.00 will pass to the Crown (Bona Vacantia).');
  });

}); 