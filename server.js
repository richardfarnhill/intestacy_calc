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
  
  // If path ends with '/', serve index.html
  if (parsedUrl.pathname === '/' || parsedUrl.pathname === '') {
    pathname = path.join(__dirname, 'index.html');
  }
  
  // Get the file extension
  const ext = path.parse(pathname).ext;
  
  // Check if the file exists and read it
  fs.promises.access(pathname)
    .then(() => fs.promises.readFile(pathname))
    .then(data => {
      // Set the content type based on the file extension
      res.setHeader('Content-type', mimeTypes[ext] || 'text/plain');
      
      // Send the file data
      res.end(data);
    })
    .catch(err => {
      if (err.code === 'ENOENT') {
        // If the file doesn't exist, return 404
        res.statusCode = 404;
        res.end(`File ${pathname} not found!`);
      } else {
        // If there's another error, return 500
        res.statusCode = 500;
        res.end(`Error reading file: ${err.code}`);
      }
    });
});

// Port to listen on
const port = process.env.PORT || 8080;

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  console.log(`Examples available at:`);
  console.log(`  - http://localhost:${port}/examples/basic.html`);
  console.log(`  - http://localhost:${port}/examples/simple-include.html`);
  console.log(`  - http://localhost:${port}/examples/custom-theme.html`);
  console.log(`  - http://localhost:${port}/examples/email-compatible.html`);
});