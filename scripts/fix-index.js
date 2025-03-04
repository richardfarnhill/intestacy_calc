/**
 * This script ensures that the updated index.html is used in both the dist and dist/examples directories
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Read the current examples/index.html file
try {
  console.log('Fixing index.html files...');
  
  const updatedIndexHtml = fs.readFileSync(path.join(rootDir, 'examples', 'index.html'), 'utf8');
  
  // Write to dist/index.html
  fs.writeFileSync(path.join(rootDir, 'dist', 'index.html'), updatedIndexHtml);
  console.log('Updated dist/index.html');
  
  // Write to dist/examples/index.html
  fs.writeFileSync(path.join(rootDir, 'dist', 'examples', 'index.html'), updatedIndexHtml);
  console.log('Updated dist/examples/index.html');
  
  console.log('Index files fixed successfully!');
} catch (error) {
  console.error('Error fixing index files:', error);
  process.exit(1);
} 