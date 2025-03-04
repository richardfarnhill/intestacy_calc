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
   - The warning remains visible throughout the entire question flow
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
   - The warning remains visible throughout the question flow
   - Warning is reset when the user starts over

## Configuration

The contact information displayed in the warning is currently using placeholder values:
- Phone: 0123 456 7890
- Email: info@example.com

These will be replaced with actual firm contact details when the admin dashboard is implemented.

## Future Enhancements

1. **Admin Dashboard Integration**:
   - Allow customization of the warning message and contact information through the admin dashboard
   - Enable co-branding of the warning message

2. **Direct Will Creation Link**:
   - Add a direct link or button for cohabiting users to start the Will creation process

3. **Educational Content**:
   - Provide more detailed information about the legal implications of cohabitation
   - Include case studies or examples to illustrate the potential issues