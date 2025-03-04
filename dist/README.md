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

## Installation

### Using npm

```bash
npm install intestacy-calculator
```

### Direct Download

Download the latest release from the [releases page](https://github.com/yourusername/intestacy-calculator/releases) and include it in your project.

## Usage

### Basic Integration

Add a container element to your HTML:

```html
<div id="intestacy-calculator"></div>
```

Then include the script and initialize the widget:

```html
<script src="./path/to/intestacy-calculator.min.js"></script>
<script>
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

### Setup

```bash
git clone https://github.com/yourusername/intestacy-calculator.git
cd intestacy-calculator
npm install
```

### Running Locally

```bash
npm run serve
```

This will start a development server on port 8080 and open the basic example in your browser.

### Building

```bash
npm run build
```

This will create the following files in the `dist` directory:
- `intestacy-calculator.js` - UMD build
- `intestacy-calculator.min.js` - Minified UMD build
- `intestacy-calculator.esm.js` - ES Module build
- `intestacy-calculator.css` - CSS styles
- `intestacy-calculator.min.css` - Minified CSS styles

## License

MIT

## Future Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for planned future enhancements.