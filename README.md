# UK Intestacy Calculator Widget

A JavaScript widget that calculates how an estate would be distributed under UK intestacy rules. This widget is designed to be easily embedded in websites, email newsletters, and landing pages.

## Features

- Pure JavaScript implementation with no backend dependencies
- Responsive design that works on all devices
- Customizable styling to match your brand
- Clear step-by-step question flow
- Accurate calculations based on current UK intestacy rules
- Detailed distribution results

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

#### Option 1: Using ES Modules

```html
<script type="module">
  import IntestacyWidget from './path/to/intestacy-calculator.js';
  
  document.addEventListener('DOMContentLoaded', () => {
    const widget = new IntestacyWidget({
      container: '#intestacy-calculator',
      theme: 'light',
      contactInfo: 'Please contact us on 0161 123 4567 to discuss creating a Will.'
    });
  });
</script>
```

#### Option 2: Using Script Tag

```html
<script src="./path/to/intestacy-calculator.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    var widget = new IntestacyWidget({
      container: '#intestacy-calculator',
      theme: 'light',
      contactInfo: 'Please contact us on 0161 123 4567 to discuss creating a Will.'
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

```javascript
const widget = new IntestacyWidget();
widget.reset();
```

#### `updateOptions(options)`

Updates the widget options and reinitializes it.

```javascript
widget.updateOptions({
  theme: 'dark',
  contactInfo: 'New contact information'
});
```

## Integration Examples

### Website Integration

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
</head>
<body>
  <h1>UK Intestacy Calculator</h1>
  <div id="intestacy-calculator"></div>
  
  <script src="./path/to/intestacy-calculator.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      var widget = new IntestacyWidget({
        container: '#intestacy-calculator'
      });
    });
  </script>
</body>
</html>
```

### Landing Page Integration

For landing pages, you might want to customize the appearance more:

```html
<div id="intestacy-calculator" class="my-custom-container"></div>

<script src="./path/to/intestacy-calculator.min.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    var widget = new IntestacyWidget({
      container: '#intestacy-calculator',
      theme: 'light',
      contactInfo: '<strong>Call us today:</strong> 0161 123 4567'
    });
  });
</script>

<style>
  .my-custom-container .intestacy-header {
    background-color: #f0f8ff;
    padding: 20px;
    border-radius: 10px;
  }
  
  .my-custom-container .intestacy-header h1 {
    color: #0066cc;
  }
</style>
```

### Email Newsletter Integration

For email newsletters, you'll typically want to link to a hosted version of the calculator:

```html
<a href="https://example.com/intestacy-calculator" class="button">
  Calculate Your Estate Distribution
</a>
```

## Browser Support

The widget supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- iOS Safari (latest)
- Android Chrome (latest)

## Development

### Setup

```bash
git clone https://github.com/yourusername/intestacy-calculator.git
cd intestacy-calculator
npm install
```

### Build

```bash
npm run build
```

This will create the following files in the `dist` directory:

- `intestacy-calculator.js` - UMD build
- `intestacy-calculator.min.js` - Minified UMD build
- `intestacy-calculator.esm.js` - ES Module build
- `intestacy-calculator.css` - CSS styles
- `intestacy-calculator.min.css` - Minified CSS styles

### Development Server

```bash
npm run serve
```

This will start a development server and open the basic example in your browser.

## License

MIT