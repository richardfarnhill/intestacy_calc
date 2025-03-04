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
      
      // Create a picker page for Netlify by copying the processed index.html
      try {
        // Read the processed index.html from dist/examples
        const pickerHtml = readFileSync(join(distExamplesDir, 'index.html'), 'utf8');
        // Write it to the dist directory
        writeFileSync(join(distDir, 'index.html'), pickerHtml);
        console.log('Created picker page in dist root');
      } catch (err) {
        console.error(`Error creating picker page: ${err.message}`);
      }
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