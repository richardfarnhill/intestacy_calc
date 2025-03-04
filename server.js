/**
 * Simple HTTP server for testing the intestacy calculator
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create the server
const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = parse(req.url);
  
  // Extract the path from the URL
  let pathname = path.join(__dirname, parsedUrl.pathname);
  
  // If path ends with '/', serve index.html or examples/index.html
  if (parsedUrl.pathname === '/' || parsedUrl.pathname === '') {
    pathname = path.join(__dirname, 'examples', 'index.html');
  }
  
  // Check if the file exists
  fs.stat(pathname, (err, stats) => {
    if (err) {
      // If the file doesn't exist
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    
    // If it's a directory, try to serve index.html
    if (stats.isDirectory()) {
      pathname = path.join(pathname, 'index.html');
    }
    
    // Read the file
    fs.readFile(pathname, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error reading file: ${err.message}`);
        return;
      }
      
      // Determine the content type based on the file extension
      const ext = path.extname(pathname);
      res.setHeader('Content-type', mimeTypes[ext] || 'text/plain');
      
      // Serve the file
      res.end(data);
    });
  });
});

// Set the port
const port = process.env.PORT || 3000;

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(`Examples available at:`);
  console.log(`  - http://localhost:${port}/examples/basic.html`);
  console.log(`  - http://localhost:${port}/examples/simple-include.html`);
  console.log(`  - http://localhost:${port}/examples/custom-theme.html`);
  console.log(`  - http://localhost:${port}/examples/email-compatible.html`);
});