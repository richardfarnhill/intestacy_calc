# Bug Tracking System

## Bug Report

### Bug ID: 001
**Date Reported:** 5 March 2024  
**Reported By:** [Your Name]  
**Version:** 1.2.2  
**Environment:** [Specify environment, e.g., Windows, Chrome]

#### Description:
The estate calculation is incorrect, as evidenced by the results displayed in the application. The distribution results show "No distribution data available" despite a valid estate value being entered.

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
The application displays the following message:

#### Screenshot:
![Estate Calculation Incorrect](attachment_path_here)

#### Additional Notes:
- Manual testing is required to identify the root cause of the issue.
- Please ensure that the distribution logic is reviewed and corrected as necessary.
