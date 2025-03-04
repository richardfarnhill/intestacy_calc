# UK Intestacy Calculator: Cohabiting Feature Implementation Plan

## Overview

This document outlines the detailed implementation plan for completing the remaining tasks for the cohabiting feature in the UK Intestacy Calculator. The feature has been partially implemented, with the core functionality in place, but several issues need to be addressed to ensure a complete and robust implementation.

## 1. Fix Persistent Warning Display

### Current Issue
The warning message appears when selecting 'Co-habiting' but doesn't persist through all steps of the calculator flow. The documentation states that the warning should remain visible throughout the entire question flow, but the current implementation doesn't fully achieve this.

### Implementation Plan

1. **Modify `showQuestion` Method in `IntestacyUI.js`**
   ```javascript
   showQuestion(questionId) {
     // Update state
     this.state.currentStep = 'question';
     this.state.questionId = questionId;
     
     // Update question text
     this.elements.questionText.textContent = this.calculator.getQuestionText(questionId);
     
     // Clear previous answer
     this.elements.answerInputs.forEach(input => {
       input.checked = false;
     });
     
     // Show/hide sections
     this.elements.nameSection.style.display = 'none';
     this.elements.estateSection.style.display = 'none';
     this.elements.statusSection.style.display = 'none';
     this.elements.questionSection.style.display = 'block';
     this.elements.resultSection.style.display = 'none';
     
     // Ensure cohabiting warning remains visible if applicable
     if (this.calculator.state.cohabiting) {
       this.elements.cohabitingWarning.style.display = 'block';
     }
   }
   ```

2. **Modify `showResult` Method in `IntestacyUI.js`**
   ```javascript
   showResult() {
     // Calculate distribution
     const resultText = this.calculator.calculateDistribution();
     
     // Format result with name
     const formattedResult = `
       <h2>Distribution Results for ${this.state.name}</h2>
       <p>${resultText}</p>
       <p>If you wish to change this distribution, you will need to create a Will.</p>
     `;
     
     // Update result text
     this.elements.result.innerHTML = formattedResult;
     
     // Update contact info
     if (this.calculator.state.cohabiting) {
       // Enhanced contact info for cohabiting partners
       this.elements.contactInfo.innerHTML = `
         <strong>URGENT:</strong> As a cohabiting partner, creating a Will is essential to protect your partner.
         <br>Contact our firm at <strong>0123 456 7890</strong> or <strong>info@example.com</strong> to discuss creating a Will.
       `;
       
       // Ensure cohabiting warning remains visible
       this.elements.cohabitingWarning.style.display = 'block';
     } else {
       this.elements.contactInfo.textContent = this.options.contactInfo;
     }
     
     // Show/hide sections
     this.elements.nameSection.style.display = 'none';
     this.elements.estateSection.style.display = 'none';
     this.elements.statusSection.style.display = 'none';
     this.elements.questionSection.style.display = 'none';
     this.elements.resultSection.style.display = 'block';
   }
   ```

3. **Add CSS Animation to Warning**
   
   Add a pulsing animation to the warning message to draw attention to it:
   
   ```css
   /* Add to IntestacyWidget.js getStyles() method */
   .intestacy-cohabiting-warning {
     background-color: #ffebee;
     border: 2px solid #f44336;
     color: #c62828;
     padding: 15px;
     margin: 20px 0;
     border-radius: 4px;
     animation: pulse 2s infinite;
   }
   
   @keyframes pulse {
     0% {
       box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4);
     }
     70% {
       box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
     }
     100% {
       box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
     }
   }
   ```

## 2. Improve Contact Information Display

### Current Issue
Contact information is currently only shown on the results page with placeholder values. It should be more prominently displayed throughout the flow for cohabiting users.

### Implementation Plan

1. **Update Warning Message in `createUIStructure` Method**
   
   Modify the warning message to include configurable contact information:
   
   ```javascript
   // Create cohabiting warning (hidden by default)
   const cohabitingWarning = document.createElement('div');
   cohabitingWarning.className = 'intestacy-cohabiting-warning';
   cohabitingWarning.style.display = 'none';
   cohabitingWarning.innerHTML = `
     <strong>WARNING:</strong> As a cohabiting partner, you have NO automatic inheritance rights under UK law.
     <p>Your partner will NOT automatically inherit anything from your estate if you die without a will.</p>
     <p>To protect your partner, you should create a valid Will as soon as possible.</p>
     <p class="intestacy-contact-highlight">Contact our firm at <strong>${this.options.contactPhone || '0123 456 7890'}</strong> or <strong>${this.options.contactEmail || 'info@example.com'}</strong> to discuss creating a Will.</p>
   `;
   ```

2. **Add Contact Information Options to Widget Constructor**
   
   Update the `IntestacyWidget` constructor to accept contact information:
   
   ```javascript
   constructor(options = {}) {
     // Default options
     this.options = {
       container: '#intestacy-calculator',
       theme: 'light',
       contactInfo: 'Please contact us to discuss creating a Will.',
       contactPhone: '0123 456 7890',
       contactEmail: 'info@example.com',
       ...options
     };
     
     // Initialize the widget
     this.init();
   }
   ```

3. **Add Styling for Contact Highlight**
   
   ```css
   /* Add to IntestacyWidget.js getStyles() method */
   .intestacy-contact-highlight {
     background-color: rgba(255, 255, 255, 0.7);
     padding: 10px;
     border-radius: 4px;
     margin-top: 10px;
     font-weight: bold;
   }
   ```

4. **Pass Contact Information to UI**
   
   Ensure the contact information is passed from the widget to the UI:
   
   ```javascript
   // In IntestacyWidget.js init() method
   this.ui = new IntestacyUI(
     this.options.container, 
     {
       theme: this.options.theme,
       contactInfo: this.options.contactInfo,
       contactPhone: this.options.contactPhone,
       contactEmail: this.options.contactEmail
     }
   );
   ```

## 3. Configure Netlify Documentation Display

### Current Issue
The build process needs to be updated to include documentation files, and specific redirects for documentation paths need to be added.

### Implementation Plan

1. **Update `netlify.toml` Configuration**
   
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [context.production]
     publish = "dist"
     [[redirects]]
       from = "/intestacy-calculator.min.js"
       to = "/intestacy-calculator.min.js"
       status = 200
       force = true
     [[redirects]]
       from = "/intestacy-calculator.min.css"
       to = "/intestacy-calculator.min.css"
       status = 200
       force = true
     [[redirects]]
       from = "/"
       to = "/examples/index.html"
       status = 200
       force = true
     [[redirects]]
       from = "/docs/*"
       to = "/examples/docs/:splat"
       status = 200
       force = true
     [[redirects]]
       from = "/*"
       to = "/examples/index.html"
       status = 200
   
   [context.deploy-preview]
     publish = "dist"
   ```

2. **Update Build Process in `package.json`**
   
   Ensure the build process copies documentation files to the dist directory:
   
   ```json
   "scripts": {
     "build": "rollup -c && npm run copy-examples && npm run copy-docs",
     "copy-examples": "cp -r examples dist/",
     "copy-docs": "cp -r docs dist/docs"
   }
   ```

3. **Add Documentation Index Page**
   
   Create a documentation index page that links to all documentation files:
   
   ```html
   <!-- examples/docs/index.html -->
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>UK Intestacy Calculator Documentation</title>
     <style>
       /* Same styles as other documentation pages */
     </style>
   </head>
   <body>
     <div class="nav">
       <a href="../index.html">Home</a>
     </div>
   
     <h1>UK Intestacy Calculator Documentation</h1>
     
     <ul>
       <li><a href="readme.html">General Documentation</a></li>
       <li><a href="development.html">Development Plans</a></li>
       <li><a href="cohabiting_feature.html">Cohabiting Feature Documentation</a></li>
     </ul>
   </body>
   </html>
   ```

## 4. Update Documentation

### Current Issue
Documentation needs to be updated to reflect the current implementation status, including details about warning persistence and contact information.

### Implementation Plan

1. **Update Markdown Documentation**
   
   Update `docs/cohabiting_feature.md` to reflect the current implementation status:
   
   ```markdown
   # Cohabiting Status Feature
   
   ## Overview
   
   The UK Intestacy Calculator now includes special handling for users who are in a cohabiting relationship. This feature was added to highlight the limited inheritance rights of cohabiting partners under UK law and to encourage these users to create a valid Will to protect their partner.
   
   ## Legal Context
   
   Under UK intestacy rules, cohabiting partners (unmarried couples living together) have **no automatic inheritance rights** if their partner dies without a will. This means that the estate would pass to children, parents, siblings, etc., following the standard intestacy rules, potentially leaving the surviving partner with nothing.
   
   This is in stark contrast to married couples or those in civil partnerships, who have significant inheritance rights under intestacy rules.
   
   ## Implementation Details
   
   ### User Interface
   
   1. **Relationship Status Selection**:
      - A new 'Co-habiting' option has been added to the relationship status radio buttons
      - When selected, this immediately triggers a prominent warning message
   
   2. **Persistent Warning**:
      - A highly visible warning appears immediately when a user selects 'Co-habiting'
      - The warning remains visible throughout the entire question flow and results page
      - The warning is styled with a red border and background to draw attention
      - An animation effect (pulsing) is applied to emphasize the importance
   
   3. **Warning Content**:
      - Clear statement that cohabiting partners have NO automatic inheritance rights
      - Explanation that the partner will NOT inherit anything automatically
      - Recommendation to create a valid Will as soon as possible
      - Contact information for the firm to discuss creating a Will
   
   4. **Enhanced Results Page**:
      - Additional emphasis in the results section for cohabiting users
      - Special contact information with "URGENT" messaging
      - Clear explanation of how the estate will be distributed (to relatives, not the partner)
   
   ### Technical Implementation
   
   1. **State Management**:
      - Added a new `cohabiting` boolean property to the calculator's state
      - This property is set to `true` when the user selects 'Co-habiting' as their relationship status
   
   2. **Distribution Calculation**:
      - Special handling in the `calculateDistribution` method for cohabiting users
      - Warning message included in the distribution results
      - Clear explanation that the estate will pass to relatives according to intestacy rules
   
   3. **CSS Styling**:
      - Custom CSS class `.intestacy-cohabiting-warning` for styling the warning message
      - Animation effects to draw attention to the warning
      - Responsive design that works on all devices
   
   4. **Persistence**:
      - The warning remains visible throughout the question flow and results page
      - Warning visibility is maintained in both `showQuestion` and `showResult` methods
      - Warning is reset when the user starts over
   
   ## Configuration
   
   The contact information displayed in the warning is configurable through the widget options:
   
   ```javascript
   const calculator = new IntestacyWidget({
     contactPhone: '0123 456 7890',
     contactEmail: 'info@example.com'
   });
   ```
   
   Default values are used if not provided:
   - Phone: 0123 456 7890
   - Email: info@example.com
   
   ## Netlify Configuration
   
   The documentation for the cohabiting feature is available at:
   - `/docs/cohabiting_feature.html` - HTML version
   - `/docs/cohabiting_feature.md` - Markdown version
   
   The Netlify configuration includes redirects to ensure these documentation files are accessible.
   
   ## Future Enhancements
   
   1. **Admin Dashboard Integration**:
      - Allow customization of the warning message and contact information through the admin dashboard
      - Enable co-branding of the warning message
   
   2. **Direct Will Creation Link**:
      - Add a direct link or button for cohabiting users to start the Will creation process
   
   3. **Educational Content**:
      - Provide more detailed information about the legal implications of cohabitation
      - Include case studies or examples to illustrate the potential issues
   ```

2. **Update HTML Documentation**
   
   Update `examples/docs/cohabiting_feature.html` to match the updated markdown documentation.

## Implementation Timeline

1. **Day 1: Fix Persistent Warning Display**
   - Modify `showQuestion` and `showResult` methods
   - Add CSS animation to warning
   - Test warning persistence through all steps

2. **Day 1: Improve Contact Information Display**
   - Update warning message to include configurable contact information
   - Add contact information options to widget constructor
   - Add styling for contact highlight
   - Test contact information display

3. **Day 2: Configure Netlify Documentation Display**
   - Update `netlify.toml` configuration
   - Update build process in `package.json`
   - Add documentation index page
   - Test documentation access on Netlify

4. **Day 2: Update Documentation**
   - Update markdown documentation
   - Update HTML documentation
   - Test documentation accuracy

## Testing Plan

1. **Warning Persistence Testing**
   - Test that the warning appears when selecting 'Co-habiting'
   - Test that the warning remains visible through all question steps
   - Test that the warning remains visible on the results page
   - Test that the warning is hidden when restarting the calculator
   - Test that the warning is hidden when selecting a different relationship status

2. **Contact Information Testing**
   - Test that the default contact information appears correctly
   - Test that custom contact information is displayed when provided
   - Test that contact information is visible in both the warning and results page

3. **Documentation Testing**
   - Test that documentation is accessible through the Netlify site
   - Test that all documentation links work correctly
   - Test that documentation content is accurate and up-to-date

4. **Responsive Design Testing**
   - Test that the warning and contact information display correctly on different screen sizes
   - Test that the documentation is readable on mobile devices

## Conclusion

This implementation plan addresses all the remaining tasks for the cohabiting feature in the UK Intestacy Calculator. By following this plan, we will ensure that the feature is complete, robust, and provides a clear warning to cohabiting users about their lack of inheritance rights under UK law.