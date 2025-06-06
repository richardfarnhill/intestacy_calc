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

1. **Run Tests**: When MAJOR changes have been implemented, proceed to run tests after UI changes to verify they still pass.

2. **Prompt for Testing**: After making UI changes, always prompt the user for permission to run tests.

3. **Review Test Failures**: If tests fail, determine whether the tests need updating or if the UI changes have introduced bugs.

## Test Maintenance Guidelines

1. **Regular Test Reviews**: Periodically review tests to ensure they align with current UI implementation.

2. **Remove Obsolete Tests**: Remove or update tests that no longer apply to the current UI.

3. **Test Refactoring**: When refactoring UI components, refactor tests in parallel.

4. **Test Timing**: 
   - Use appropriate timeouts for asynchronous operations
   - Default timeout for UI transitions should be at least 500ms
   - Increase timeouts for complex operations or slower environments
   - Document any non-standard timeout values in test comments

5. **Error State Testing**:
   - Verify error messages appear and disappear correctly
   - Check error message content matches expected validation messages
   - Ensure error states are properly cleared when moving between sections
   - Test that error messages are accessible to screen readers

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

- The UI for boolean questions in the question flow uses only Yes/No buttons. Any associated input boxes or labels should be visually hidden via CSS to maintain a clean interface.
- Progress indicators have been intentionally removed from the UI as they were deemed unnecessary and visually distracting.
- Tests have been updated to reflect these UI decisions.

## Handling Removed UI Elements

When UI elements are intentionally removed:

1. **Update Tests**: Remove or modify tests that check for the existence of these elements.
2. **Document Removals**: Document the removal in this guide to prevent future confusion.
3. **Add Comments**: Add comments in test files explaining why certain tests were modified or removed.

## Current UI Simplifications

The following UI elements have been intentionally removed or simplified:

1. **Progress Indicators**: All progress bars and step indicators have been removed.
2. **Extra Input/Label in Question Section**: The visual appearance of an extra input box or "Answer the question" label in the question section has been resolved to show only the question text and Yes/No buttons.

## Bug Tracking
- A rudimentary bug tracking system has been implemented to log issues and track their resolution.
- Ensure that all bugs are documented in the `BUGS.md` file. 

