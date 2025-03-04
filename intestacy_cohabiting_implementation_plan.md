# Implementation Plan: Adding 'Co-habiting' Relationship Status

## Overview
We need to add a new relationship status of 'Co-habiting' to the intestacy calculator. Cohabitees have very limited inheritance rights under UK law, and we need to identify these users to provide appropriate guidance.

## Current Implementation
Currently, the calculator only distinguishes between:
- Married/Civil Partnership (has inheritance rights)
- Not married (single, divorced, widowed - all treated the same way)

The UI presents relationship status options as radio buttons, but the calculator only cares about the boolean `married` state (true/false).

## Implementation Steps

### 1. Update the UI
- Add a new 'Co-habiting' option to the relationship status radio button group in `IntestacyUI.js`
- This will appear alongside the existing options (Single, Married/Civil Partnership, Divorced, Widowed)

### 2. Update the Calculator State
- Add a new `cohabiting` boolean property to the calculator's state object in `IntestacyCalculator.js`
- Initialize it to `null` like other state properties

### 3. Update Status Handling
- Modify the `handleStatusSubmit` method in `IntestacyUI.js` to set the new `cohabiting` state when that option is selected
- Ensure the `married` state remains false when 'Co-habiting' is selected

### 4. Update Distribution Calculation
- Modify the `calculateDistribution` method in `IntestacyCalculator.js` to handle the cohabiting case
- Add specific messaging for cohabiting users to explain their limited inheritance rights
- Ensure the distribution calculation remains accurate (cohabitees have no automatic inheritance rights)

### 5. Update Tests
- Add new test cases in `IntestacyCalculator.test.js` to verify the correct handling of cohabiting status
- Test the distribution calculation for cohabiting users

## Detailed Changes

### IntestacyCalculator.js
1. Add `cohabiting: null` to the state initialization
2. Update the `calculateDistribution` method to check for cohabiting status and provide appropriate messaging

### IntestacyUI.js
1. Add a new radio button option for 'Co-habiting' in the `createUIStructure` method
2. Update the `handleStatusSubmit` method to set `calculator.state.cohabiting = (selectedStatus === 'cohabiting')`

### IntestacyCalculator.test.js
1. Add test cases for cohabiting users to verify correct distribution calculation

## Expected Behavior
- When a user selects 'Co-habiting', they should receive clear information about their limited inheritance rights
- The distribution calculation should reflect that cohabitees have no automatic inheritance rights under UK intestacy rules
- The messaging should be informative and guide users toward creating a will to protect their partner

## Legal Context
Under UK law, unmarried partners (cohabitees) have no automatic inheritance rights if their partner dies without a will. This means the estate would pass to children, parents, siblings, etc., following the standard intestacy rules, potentially leaving the surviving partner with nothing.