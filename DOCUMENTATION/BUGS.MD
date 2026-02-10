# Bug Tracking System

## Bug Report

### Bug ID: 001
**Date Reported:** 5 March 2024  
**Reported By:** [Your Name]  
**Version:** 1.2.2  
**Environment:** [Specify environment, e.g., Windows, Chrome]  
**Status:** Fixed  
**Resolution Date:** 5 March 2024

#### Description:
The estate calculation was incorrect, as evidenced by the results displayed in the application. The distribution results showed "No distribution data available" despite a valid estate value being entered.

#### Steps to Reproduce:
1. Open the UK Intestacy Calculator.
2. Enter the name "bob" in the name input field.
3. Enter "457080" in the estate value input field.
4. Click the "Continue" button.
5. Select the marital status and proceed through the questions.
6. Observe the results displayed.

#### Expected Result:
The application should display a detailed distribution of the estate value, including beneficiaries and their respective shares.

#### Actual Result:
The application displayed the following message:
"No distribution data available"

#### Resolution:
- Added beneficiaries array to distribution data structure
- Ensured beneficiaries array matches shares array length
- Updated calculation logic to properly populate beneficiaries information
- Added validation to prevent "No distribution data available" message when valid data exists

#### Verification:
Test case verified with:
- Name: "bob"
- Estate Value: £457,080
- Marital Status: Married
- Children: Yes
- Result: Correct distribution showing spouse and children shares

#### Screenshot:
![Estate Calculation Incorrect](attachment_path_here)

#### Additional Notes:
- Manual testing is required to identify the root cause of the issue.
- Please ensure that the distribution logic is reviewed and corrected as necessary.

### Bug ID: 002
**Date Reported:** 6 June 2025
**Reported By:** User
**Version:** [Current Version]
**Environment:** [User's Environment]
**Status:** Fixed
**Resolution Date:** 6 June 2025

#### Description:
UI issue in the question section where an unnecessary text box/label appeared below the question text, and there were spacing problems.

#### Steps to Reproduce:
1. Navigate to a question step in the calculator.
2. Observe the layout and elements displayed below the main question text.

#### Expected Result:
Only the question text and the Yes/No buttons should be displayed with appropriate spacing.

#### Actual Result:
An unnecessary text box or label-like element appeared, along with the text "Answer the question", and the spacing was incorrect.

#### Resolution:
- Ensured the visually hidden legend element for accessibility is correctly hidden via CSS class.
- Removed the explicit text content setting for the visually hidden legend in the UI creation logic.
- Adjusted CSS for the question section fieldset and legend to prevent layout impact from hidden elements.
- Added specific CSS margins for spacing between the question text and buttons.

#### Verification:
Tested the question section UI visually in example files to confirm the removal of the extraneous element/text and correct spacing.

### Bug ID: 003
**Date Reported:** 6 June 2025
**Reported By:** User
**Version:** [Current Version]
**Environment:** [User's Environment]
**Status:** Fixed
**Resolution Date:** 6 June 2025

#### Description:
Incorrect distribution details displayed for cohabiting individuals with no children. The calculator incorrectly indicated that the estate would be distributed to children, despite the user having no children.

#### Steps to Reproduce:
1. Open the UK Intestacy Calculator.
2. Enter an estate value.
3. Select 'Co-habiting' as the relationship status.
4. Indicate that there are no children.
5. Proceed through any remaining questions.
6. Observe the detailed distribution results.

#### Expected Result:
The detailed distribution should show the estate passing to the next class of beneficiaries according to the standard intestacy hierarchy (e.g., parents, siblings, etc.), or to the Crown if no other relatives exist. The distribution should NOT indicate children as beneficiaries.

#### Actual Result:
The distribution results incorrectly listed children as the beneficiaries, even though the user had no children.

#### Resolution:
- Adjusted `_populateDistributionData` to correctly identify the first class of beneficiaries in the standard hierarchy when the user is cohabiting and has no children.
- Modified `getInheritanceHierarchyText` to generate the correct textual description for the distribution in the same scenario.
- Added a dedicated test case (`tests/cohabiting-no-children-test.js`) for this specific scenario.

#### Verification:
- Verified the UI output for a cohabiting individual with no children and no other relatives; the distribution correctly shows the Crown as the beneficiary.
- Confirmed the new test case (`tests/cohabiting-no-children-test.js`) passes when running the test suite.

### Bug ID: 004
**Date Reported:** 6 June 2025
**Reported By:** User
**Version:** [Current Version]
**Environment:** [User's Environment]
**Status:** Fixed
**Resolution Date:** 6 June 2025

#### Description:
Old contact phone number, email address, and copyright notice were still present in example HTML files and the README, despite being updated in the core UI.

#### Steps to Reproduce:
1. View example HTML files (e.g., basic.html, simple-include.html, custom-theme.html, email-compatible.html, index.html).
2. View the README.md file.
3. Observe outdated contact phone number (0161 928 3848), email address (mch@mchaleandco.co.uk), and copyright notice (© WillSolicitor.co.uk 2025. All Rights Reserved.).

#### Expected Result:
All example files and README should display the current contact phone number (0161 348 7581), email address (hello@WillSolcitor.co.uk), and copyright notice (WillSolicitor.co.uk (a trading style of McHale Legal Limited)).

#### Actual Result:
Outdated contact information and copyright notice were found in several example files and the README.

#### Resolution:
- Updated contactInfo option in example HTML files to use the correct phone number.
- Updated copyright text in example HTML files and README.
- Removed outdated email address from README.
- Removed commented-out line with old contact info from README example.

#### Verification:
Performed codebase search (grep) for old contact details and copyright notice, confirming no matches were found in code files.
