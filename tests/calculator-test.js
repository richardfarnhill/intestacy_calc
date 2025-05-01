import IntestacyCalculator from '../src/core/IntestacyCalculator.js';

// Test case based on bug report
const testCalculator = () => {
  const calculator = new IntestacyCalculator();
  
  // Set test values
  calculator.state.name = "bob";
  calculator.state.estateValue = 457080;
  calculator.state.married = true;
  calculator.state.children = true;
  
  // Calculate distribution
  const result = calculator.calculateDistribution();
  
  // Log results
  console.log("Test Results:");
  console.log("Name:", calculator.state.name);
  console.log("Estate Value:", calculator.formatCurrency(calculator.state.estateValue));
  console.log("Married:", calculator.state.married);
  console.log("Has Children:", calculator.state.children);
  console.log("\nDistribution Data:");
  console.log(JSON.stringify(result.data, null, 2));
  console.log("\nDistribution Text:");
  console.log(result.text);
  
  // Verify beneficiaries array exists and matches shares
  if (result.data.beneficiaries && result.data.beneficiaries.length === result.data.shares.length) {
    console.log("\n✅ Test Passed: Beneficiaries array exists and matches shares length");
  } else {
    console.log("\n❌ Test Failed: Beneficiaries array is missing or incorrect length");
  }
};

// Run the test
testCalculator(); 