# UK Intestacy Calculator Widget

A JavaScript widget that calculates how an estate would be distributed under UK intestacy rules. This widget is designed to be easily embedded in websites, email newsletters, and landing pages.

**Proprietary Software** - All rights reserved. This software is proprietary and confidential. No license is granted for its use, modification, or distribution. Unauthorized deployment or distribution of this calculator is strictly prohibited.

WillSolicitor.co.uk (a trading style of McHale Legal Limited)

## Features

- Pure JavaScript implementation with no backend dependencies
- Responsive design that works on all devices
- Customizable styling to match your brand
- Clear step-by-step question flow
- Accurate calculations based on current UK intestacy rules
- Detailed distribution results
- Special handling for cohabiting partners with prominent warnings about limited inheritance rights
- Persistent warning messages throughout the question flow for cohabiting users
- WCAG 2.1 AA compliant interface

## Live Demo

View live examples at [https://intestacycalculator.netlify.app/](https://intestacycalculator.netlify.app/)

The demo showcases:
- Basic Example - Core functionality with default styling
- Simple Include Example - Quick script-tag based implementation
- Custom Theme Example - Customized appearance to match branding
- Email Compatible Example - Adaptation for email newsletter use

## Project Structure

```
├── src/
│   ├── core/             # Core calculator logic
│   ├── integration/      # Widget integration module
│   ├── ui/               # User interface components
│   └── styles/           # CSS styling
├── dist/                 # Built distribution files
├── examples/             # Integration examples
└── tests/                # Test suite
```

## Recent Updates (v1.3.1)

- Fixed critical married status bug - correctly states "absolute interest" instead of "life interest"
- Consolidated hierarchy logic for cleaner, more maintainable code
- Fixed question flow and UI spacing issues
- Resolved cohabiting no children distribution calculation
- Resolved npm security vulnerabilities (0 vulnerabilities remaining)
- Removed unnecessary documentation files and consolidated information

## Basic Integration

### For Authorized Licensees Only

Add a container element to your HTML:

```html
<div id="intestacy-calculator"></div>
```

Include the script and initialize:

```html
<script type="module">
  import IntestacyWidget from './path/to/src/integration/IntestacyWidget.js';

  document.addEventListener('DOMContentLoaded', function() {
    var widget = new IntestacyWidget({
      container: '#intestacy-calculator',
      theme: 'light',
    });
  });
</script>
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | String or Element | `'#intestacy-calculator'` | CSS selector or DOM element where the calculator will be rendered |
| `theme` | String | `'light'` | Theme to use (`'light'` or `'dark'`) |
| `contactInfo` | String | `'Please contact us to discuss creating a Will.'` | Contact information displayed in the results |

### Methods

#### `reset()`
Resets the calculator to its initial state.

#### `updateOptions(options)`
Updates the widget options and reinitializes it.

## Development Setup

For authorized developers only.

```bash
git clone [private repository URL]
cd intestacy-calculator
npm install
```

### Running Locally

```bash
npm run serve
```

Starts a development server on port 3000 with examples.

### Building

```bash
npm run build
```

Creates optimized distribution files in the `dist/` folder.

### Testing

```bash
npm test
```

Runs the test suite to verify calculator accuracy and UI functionality.

## Version Control

This project uses **Semantic Versioning (SemVer)**:
- Format: `v{MAJOR}.{MINOR}.{PATCH}`
- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

```bash
git tag -a v1.3.1 -m "Release version 1.3.1"
git push origin v1.3.1
```

## Contact Information

For inquiries or support:

- **Phone:** 0161 348 7581
- **Email:** hello@WillSolcitor.co.uk
- **Website:** [https://willsolicitor.co.uk/contact](https://willsolicitor.co.uk/contact)

## License

Proprietary. All rights reserved.

## Legal Disclaimer

This calculator is provided for demonstration purposes only. It is not intended for unauthorized deployment. For licensing inquiries or to discuss implementing this calculator on your website, please contact the owner.

---

**Last Updated:** February 2025
**Current Version:** 1.3.1
