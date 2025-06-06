# PROPRIETARY SOFTWARE
This software is proprietary and confidential. No license is granted for its use, modification, or distribution.
Unauthorized deployment or distribution of this calculator is strictly prohibited.

Copyright © 2025 Richard Farnhill. All rights reserved.

# UK Intestacy Calculator Widget

A JavaScript widget that calculates how an estate would be distributed under UK intestacy rules. This widget is designed to be easily embedded in websites, email newsletters, and landing pages.

## Features

- Pure JavaScript implementation with no backend dependencies
- Responsive design that works on all devices
- Customizable styling to match your brand
- Clear step-by-step question flow
- Accurate calculations based on current UK intestacy rules
- Detailed distribution results
- Special handling for cohabiting partners with prominent warnings about limited inheritance rights
- Persistent warning messages throughout the question flow for cohabiting users

## Project Structure
- **src/**: Source code for the calculator
- **dist/**: Built distribution files
- **examples/**: Integration examples
- **DOCUMENTATION/**: Project documentation

## Live Demo

You can view live examples of the calculator at [https://intestacycalculator.netlify.app/](https://intestacycalculator.netlify.app/)

The demo provides several examples showcasing different implementation approaches:
- Basic Example - Core functionality with default styling
- Simple Include Example - Quick script-tag based implementation
- Custom Theme Example - Customized appearance to match branding
- Email Compatible Example - Adaptation for email newsletter use

## Recent Updates

- Fixed calculation logic for married individuals with children to correctly state "absolute interest" instead of "life interest" for the spouse's share.
- Resolved UI issue in the question section, removing the unnecessary text/label and improving spacing.
- Consolidated documentation files to reduce redundancy
- Improved Netlify routing configuration for seamless navigation
- Streamlined UI by removing redundant documentation links
- Enhanced proprietary notices throughout the codebase
- Fixed deployment issues with proper redirect paths

## Important Notice

This calculator is provided for demonstration purposes only. It is not intended for unauthorized deployment.
For licensing inquiries or to discuss implementing this calculator on your website, please contact the owner.

## Contact Information

For inquiries or support, please contact us at:

*   **Phone:** 0161 348 7581
*   **Email:** hello@WillSolcitor.co.uk

Alternatively, you can use the contact form on our website: [https://willsolicitor.co.uk/contact](https://willsolicitor.co.uk/contact)

## Usage (Authorized Licensees Only)

### Basic Integration

Add a container element to your HTML:

```html
<div id="intestacy-calculator"></div>
```

Then include the script and initialize the widget:

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

The widget accepts the following configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | String or Element | `'#intestacy-calculator'` | CSS selector or DOM element where the calculator will be rendered |
| `theme` | String | `'light'` | Theme to use (`'light'` or `'dark'`) |
| `contactInfo` | String | `'Please contact us to discuss creating a Will.'` | Contact information displayed in the results |

### Methods

The widget instance provides the following methods:

#### `reset()`
Resets the calculator to its initial state.

#### `updateOptions(options)`
Updates the widget options and reinitializes it.

## Development

For authorized developers only. Unauthorized modifications or distributions are strictly prohibited.

### Setup

```bash
git clone [private repository URL]
cd intestacy-calculator
npm install
```

### Running Locally

```bash
npm run serve
```

This will start a development server on port 3000 and open the examples in your browser.

### Version Control Guidelines

#### Semantic Versioning (SemVer)
This project follows Semantic Versioning for release tags:
- Format: `v{MAJOR}.{MINOR}.{PATCH}`
- Example: `v1.0.0`, `v1.1.0`, `v1.0.1`

This clearly communicates the nature of changes:
- **MAJOR**: Breaking changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

Avoid using ambiguous labels like "stable" which can cause conflicts and confusion.

#### Creating a Release Tag
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## License

Proprietary. All rights reserved.

## Future Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for planned future enhancements and development roadmap. 

## Legal Disclaimer

This calculator is provided for demonstration purposes only. It is not intended for unauthorized deployment.
For licensing inquiries or to discuss implementing this calculator on your website, please contact the owner. 