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

- Consolidated documentation files to reduce redundancy
- Improved Netlify routing configuration for seamless navigation
- Streamlined UI by removing redundant documentation links
- Enhanced proprietary notices throughout the codebase
- Fixed deployment issues with proper redirect paths

## Important Notice

This calculator is provided for demonstration purposes only. It is not intended for unauthorized deployment.
For licensing inquiries or to discuss implementing this calculator on your website, please contact the owner.

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
      contactInfo: 'Please contact us on 0161 928 3848 or mch@mchaleandco.co.uk to discuss creating a Will.'
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

## License

Proprietary. All rights reserved.

## Future Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for planned future enhancements and development roadmap.# PROPRIETARY SOFTWARE
This software is proprietary and confidential. No license is granted for its use, modification, or distribution.
Unauthorized deployment or distribution of this calculator is strictly prohibited.

Copyright © 2025 Richard Farnhill. All rights reserved.

# Intestacy Calculator Project Structure

## Core Components

### Calculator Logic
- Main calculator implementation handling intestacy rules
- Located in src/ directory
- Processes estate value and family relationships to determine inheritance

### Integration Components
- IntestacyWidget.js: Main widget for embedding calculator
- Handles user interface and question flow
- Direct module import integration

### Testing Tools
- Jest for testing
- NPM scripts for test automation

## Documentation Structure

### Documentation
- /README.md: Main project documentation (root directory)
- /DEVELOPMENT.md: Development guidelines (root directory)
- /DEPLOYMENT.md: Deployment procedures (root directory)
- /*.md: Feature planning documents in root directory

### Examples
- /examples/: Directory containing example implementations
  - Various HTML files showing different integration methods
  - CSS for styling examples

## File Organization

### Source Code
- /src/core/: Core calculation logic
- /src/ui/: User interface components
- /src/integration/: Integration modules
- /src/styles/: CSS stylesheets

### Configuration
- package.json: Node.js dependencies and scripts
- netlify.toml: Netlify deployment configuration

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

## Project Structure
- **src/**: Source code for the calculator
- **dist/**: Built distribution files
- **examples/**: Integration examples
- **DOCUMENTATION/**: Project documentation

## Live Demo
You can view live examples of the calculator at [https://intestacycalculator.netlify.app/](https://intestacycalculator.netlify.app/)

## Recent Updates
- Consolidated documentation files to reduce redundancy
- Improved Netlify routing configuration for seamless navigation
- Streamlined user interface by removing redundant documentation links

## Important Notice
This calculator is provided for demonstration purposes only. It is not intended for unauthorized deployment. For licensing inquiries or to discuss implementing this calculator on your website, please contact the owner. 