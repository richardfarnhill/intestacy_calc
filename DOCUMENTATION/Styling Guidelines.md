# UK Intestacy Calculator Styling Guidelines

## Core Principles
- **Accessibility First**: WCAG 2.1 AA compliance
- **Mobile-First Approach**: Responsive by default
- **Brand Alignment**: 
- **Performance**: <100kb CSS budget

## Component-Specific Styles

### Warning Messages
```css
/* Persistent cohabiting warnings */
.intestacy-cohabiting-warning {
  background: #d4351c;
  color: white;
  padding: 1rem;
  border-left: 5px solid #ffdd00;
  animation: pulse-warning 2s infinite;
  position: sticky;
  top: 0;
  z-index: 1000;
}
```

### Interactive Elements
- **Buttons**:
  - Minimum 44x44px touch target
  - 4.5:1 contrast ratio
  - Focus states with `focus-visible` polyfill
- **Form Controls**:
  - 1px solid borders (#0b0c0c)
  - Error states using red (#d4351c)
  - Text inputs 16px minimum font size

### Typography
- **Primary Font**: GDS Transport
- **Hierarchy**:
  - Questions: 24px bold
  - Answers: 19px regular
  - Legal Text: 16px italic
- **Line Height**: 1.5 minimum

## Theming System

### Light Mode (Default)
```css
:root {
  --primary-color: #1d70b8;
  --background: #ffffff;
  --text-color: #0b0c0c;
}
```

### Dark Mode
```css
.intestacy-theme-dark {
  --primary-color: #5694ca;
  --background: #0b0c0c;
  --text-color: #ffffff;
}
```

## Animation Framework
```css
/* Warning pulse animation */
@keyframes pulse-warning {
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
}

/* Question transitions */
.intestacy-question-transition {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
```

## Accessibility Requirements
- **Contrast Ratios**:
  - Text: 4.5:1 minimum
  - UI Components: 3:1 minimum
- **ARIA Labels**:
  - Dynamic updates for screen readers
  - Contextual help text
- **Focus Management**:
  - Visible focus rings
  - Logical tab order
  - Skip links (when applicable)

## Responsive Breakpoints
| Breakpoint | Usage |
|------------|-------|
| <400px     | Mobile portrait |
| 400-768px  | Mobile landscape |
| 768-1024px | Tablet |
| >1024px    | Desktop |

## Contact Information Formatting
```css
.intestacy-accessible-link {
  border-bottom: 2px solid currentColor;
  padding-bottom: 0.1em;
  text-decoration: none;
}
```

---

**Last Updated**: 6 June 2025  
**Version**: 1.3.1  
**Compliance**: WCAG 2.1 AA | GDS Design System v4.1
