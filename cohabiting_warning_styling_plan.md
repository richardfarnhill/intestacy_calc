# Cohabiting Warning Styling Enhancement Plan

## Overview

This document outlines the CSS styling enhancements for the cohabiting warning message in the UK Intestacy Calculator. The goal is to make the warning more visually prominent and ensure it effectively communicates the importance of the message to users.

## Current Styling

Currently, the cohabiting warning has basic styling with a red border and background. The warning is created in the `createUIStructure` method of `IntestacyUI.js` and styled through the CSS provided in the `getStyles` method of `IntestacyWidget.js`.

## Enhanced Styling Plan

### 1. Warning Container Styling

```css
.intestacy-cohabiting-warning {
  background-color: #ffebee;
  border: 2px solid #f44336;
  color: #c62828;
  padding: 20px;
  margin: 20px 0;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
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

/* Add a left border accent for visual emphasis */
.intestacy-cohabiting-warning::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background-color: #d32f2f;
}
```

### 2. Warning Title Styling

```css
.intestacy-cohabiting-warning strong:first-child {
  display: block;
  font-size: 18px;
  margin-bottom: 10px;
  color: #d32f2f;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

### 3. Warning Content Styling

```css
.intestacy-cohabiting-warning p {
  margin: 10px 0;
  line-height: 1.5;
  font-size: 15px;
}

.intestacy-cohabiting-warning p:last-child {
  margin-bottom: 0;
}
```

### 4. Contact Information Highlight

```css
.intestacy-contact-highlight {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 12px;
  border-radius: 4px;
  margin-top: 12px;
  font-weight: bold;
  border-left: 3px solid #d32f2f;
}

.intestacy-contact-highlight strong {
  color: #d32f2f;
}
```

### 5. Responsive Adjustments

```css
@media (max-width: 768px) {
  .intestacy-cohabiting-warning {
    padding: 15px;
    margin: 15px 0;
  }
  
  .intestacy-cohabiting-warning strong:first-child {
    font-size: 16px;
  }
  
  .intestacy-cohabiting-warning p {
    font-size: 14px;
  }
  
  .intestacy-contact-highlight {
    padding: 10px;
  }
}
```

### 6. Dark Theme Adjustments

```css
.intestacy-theme-dark .intestacy-cohabiting-warning {
  background-color: rgba(244, 67, 54, 0.15);
  border-color: #f44336;
  color: #ff8a80;
}

.intestacy-theme-dark .intestacy-contact-highlight {
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
}
```

## Implementation Steps

1. **Update the `getStyles` method in `IntestacyWidget.js`**
   - Add the new CSS rules to the existing styles
   - Ensure the styles are properly integrated with existing theme support

2. **Update the warning HTML structure in `IntestacyUI.js`**
   - Modify the warning HTML to include the new contact highlight class
   - Ensure the warning title is properly structured for the new styling

3. **Test the styling across different themes and screen sizes**
   - Verify that the warning is visually prominent in both light and dark themes
   - Ensure the responsive adjustments work correctly on mobile devices

## Visual Design Mockup

```
┌────────────────────────────────────────────────────────┐
│ ┃                                                      │
│ ┃  WARNING: As a cohabiting partner, you have NO       │
│ ┃  automatic inheritance rights under UK law.          │
│ ┃                                                      │
│ ┃  Your partner will NOT automatically inherit         │
│ ┃  anything from your estate if you die without a      │
│ ┃  will.                                               │
│ ┃                                                      │
│ ┃  To protect your partner, you should create a        │
│ ┃  valid Will as soon as possible.                     │
│ ┃                                                      │
│ ┃  ┌──────────────────────────────────────────────┐   │
│ ┃  │ Contact our firm at 0123 456 7890 or         │   │
│ ┃  │ info@example.com to discuss creating a Will.  │   │
│ ┃  └──────────────────────────────────────────────┘   │
│ ┃                                                      │
└────────────────────────────────────────────────────────┘
```

## Animation Details

The pulsing animation will create a subtle glowing effect around the warning box, drawing the user's attention without being overly distracting. The animation cycles every 2 seconds, with the glow expanding outward and then fading away.

## Conclusion

These styling enhancements will significantly improve the visibility and impact of the cohabiting warning message, ensuring that users understand the importance of the information being presented. The combination of color, typography, animation, and layout changes will create a visually distinct element that stands out from the rest of the interface while maintaining a professional appearance.