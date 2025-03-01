# Netlify Deployment Plan

## Problem Statement

We're experiencing issues with our Netlify deployment:

1. The calculator is not appearing on the Netlify pages
2. The build process is failing due to a missing `generateHTML()` function
3. The deployment strategy is incorrect (publishing examples directly without building)

## Solution Overview

We need to implement a comprehensive solution that:

1. Properly defines the `generateHTML()` function in `rollup.config.js`
2. Updates the Netlify configuration to include a build step
3. Ensures all file references are correct in the built files
4. Creates a proper build pipeline that generates all necessary files

## Implementation Steps

### 1. Update `rollup.config.js`

```javascript
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// Read package.json
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

// Function to generate HTML files
function generateHTML() {
  return {
    name: 'generate-html',
    writeBundle(outputOptions) {
      // Get the output directory from the bundle
      const outputDir = dirname(outputOptions.file);
      const distDir = join(outputDir, '..');
      const examplesDir = 'examples';
      const distExamplesDir = join(distDir, 'examples');
      
      // Create dist/examples directory if it doesn't exist
      if (!existsSync(distExamplesDir)) {
        mkdirSync(distExamplesDir, { recursive: true });
      }
      
      // Copy custom-theme.css to dist/examples
      try {
        const customThemeCss = readFileSync(join(examplesDir, 'custom-theme.css'), 'utf8');
        writeFileSync(join(distExamplesDir, 'custom-theme.css'), customThemeCss);
        console.log('Copied custom-theme.css');
      } catch (err) {
        console.error(`Error copying custom-theme.css: ${err.message}`);
      }
      
      // Copy and process all HTML files
      const htmlFiles = ['basic.html', 'simple-include.html', 'custom-theme.html', 'email-compatible.html', 'index.html'];
      
      htmlFiles.forEach(file => {
        try {
          if (!existsSync(join(examplesDir, file))) {
            console.log(`File ${file} does not exist, skipping`);
            return;
          }
          
          let html = readFileSync(join(examplesDir, file), 'utf8');
          
          // Replace module imports with the bundled file
          html = html.replace(
            /import IntestacyWidget from '\.\.\/src\/integration\/IntestacyWidget\.js';/g,
            `import IntestacyWidget from '/intestacy-calculator.min.js';`
          );
          
          // Replace script src with the bundled file
          html = html.replace(
            /<script src="\/dist\/intestacy-calculator\.min\.js"><\/script>/g,
            `<script src="/intestacy-calculator.min.js"></script>`
          );
          
          // Write the processed file
          writeFileSync(join(distExamplesDir, file), html);
          console.log(`Processed ${file}`);
        } catch (err) {
          console.error(`Error processing ${file}: ${err.message}`);
        }
      });
      
      // Create a picker page for Netlify
      const pickerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WillsX Intestacy Tool - Lead Generator</title>
    <style>
        body {
            font-family: sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f9f9f9;
            color: #333;
        }

        .container {
            max-width: 960px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            color: #0047AB; /* WillsX Blue */
            margin-bottom: 10px;
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }

        .card {
            background-color: #fff;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .card h2 {
            margin-top: 0;
            color: #0047AB;
        }

        .card a {
            display: inline-block;
            margin-top: 10px;
            padding: 8px 16px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>WillsX Intestacy Tool - Examples</h1>
        
        <div class="card-grid">
            <div class="card">
                <h2>Basic Example</h2>
                <p>A basic integration of the intestacy calculator widget.</p>
                <a href="basic.html">View Example</a>
            </div>
            <div class="card">
                <h2>Simple Include Example</h2>
                <p>A simple example of including the widget using script tags.</p>
                <a href="simple-include.html">View Example</a>
            </div>
            <div class="card">
                <h2>Custom Theme Example</h2>
                <p>An example of customizing the widget's theme with custom CSS.</p>
                <a href="custom-theme.html">View Example</a>
            </div>
            <div class="card">
                <h2>Email Compatible Example</h2>
                <p>An example of how to reference the calculator in an email newsletter.</p>
                <a href="email-compatible.html">View Example</a>
            </div>
        </div>

        <div class="footer">
            <p>© WillsX 2025. All Rights Reserved.</p>
        </div>
    </div>
</body>
</html>`;
      
      writeFileSync(join(distExamplesDir, 'index.html'), pickerHtml);
      console.log('Created picker page');
    }
  };
}

export default [
  // ESM build
  {
    input: 'src/integration/IntestacyWidget.js',
    output: {
      file: pkg.module.replace('src/', 'dist/'),
      format: 'es',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', { targets: { esmodules: true } }]
        ]
      }),
      css({ output: 'intestacy-calculator.css' })
    ]
  },
  
  // UMD build (unminified)
  {
    input: 'src/integration/IntestacyWidget.js',
    output: {
      file: pkg.main,
      format: 'umd',
      name: 'IntestacyWidget',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', { targets: pkg.browserslist }]
        ]
      }),
      css({ output: 'intestacy-calculator.css' })
    ]
  },
  
  // UMD build (minified)
  {
    input: 'src/integration/IntestacyWidget.js',
    output: {
      file: pkg.main.replace('.js', '.min.js'),
      format: 'umd',
      name: 'IntestacyWidget',
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', { targets: pkg.browserslist }]
        ]
      }),
      terser(),
      css({ output: 'intestacy-calculator.min.css' }),
      generateHTML()
    ]
  }
];
```

### 2. Update `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[context.production]
  publish = "dist"
  [[redirects]]
    from = "/*"
    to = "/examples/index.html"
    status = 200

[context.deploy-preview]
  publish = "dist"
```

### 3. Update `package.json` Scripts

Add a new script to copy assets:

```json
"scripts": {
  "build": "rollup -c && npm run copy-assets",
  "copy-assets": "cp -r examples/assets dist/examples/ || true",
  "dev": "rollup -c -w",
  "test": "jest",
  "lint": "eslint src/**/*.js",
  "serve": "node server.js",
  "start": "npm run serve"
}
```

## Testing Plan

1. Run `npm run build` to verify that the build process works
2. Check the `dist` directory to ensure all files are generated correctly
3. Run `npm start` to start the local server
4. Verify that all examples work correctly
5. Push the changes to GitHub
6. Verify that the Netlify deployment works correctly

## Expected Outcome

- The calculator will appear on all Netlify pages
- The build process will generate all necessary files
- All file references will be correct
- The deployment will be automated and reliable