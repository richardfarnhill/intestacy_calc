# UI Testing Guidelines

## Core Principles

1. **Tests Follow UI Changes**: When UI components are modified, added, or removed, the corresponding tests must be updated to reflect these changes.

2. **Minimal Testing Dependencies**: Tests should not depend on specific UI implementation details unless those details are critical to functionality.

3. **Test Functionality, Not Structure**: Focus tests on verifying that functionality works correctly rather than on specific DOM structures that may change.

## Process for UI Changes

### When Making UI Changes

1. **Identify Affected Tests**: Before implementing UI changes, identify which tests might be affected.

2. **Update Tests in Parallel**: Update tests alongside UI changes, not as an afterthought.

3. **Document UI Dependencies**: Clearly document which UI elements are critical for tests and which are implementation details.

### After UI Changes

1. **Run Tests**: Always run tests after UI changes to verify they still pass.

2. **Prompt for Testing**: After making UI changes, prompt the user for permission to run tests.

3. **Review Test Failures**: If tests fail, determine whether the tests need updating or if the UI changes have introduced bugs.

## Test Maintenance Guidelines

1. **Regular Test Reviews**: Periodically review tests to ensure they align with current UI implementation.

2. **Remove Obsolete Tests**: Remove or update tests that no longer apply to the current UI.

3. **Test Refactoring**: When refactoring UI components, refactor tests in parallel.

## Specific UI Component Guidelines

### Question Flow Testing

1. **Focus on User Interaction**: Tests should verify that users can answer questions and progress through the flow.

2. **Input Validation**: Test that input validation works correctly, regardless of how inputs are presented.

3. **Accessibility**: Verify that the question flow remains accessible after changes.

### Results Display Testing

1. **Verify Calculation Accuracy**: Test that calculations are displayed correctly.

2. **Format Verification**: Verify that results are formatted correctly.

3. **Responsive Design**: Test that results display correctly on different screen sizes.

## Implementation Notes

- The UI has been simplified to use only button inputs for boolean questions in the question flow.
- Input boxes in the question section are hidden via CSS to maintain a clean interface.
- Tests should be updated to reflect these UI decisions. 