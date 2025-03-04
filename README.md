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

## Live Demo

You can view live examples of the calculator at [https://intestacycalculator.netlify.app/](https://intestacycalculator.netlify.app/)

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

See [DEVELOPMENT.md](DEVELOPMENT.md) for planned future enhancements.