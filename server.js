/**
 * Simple HTTP server for testing the intestacy calculator
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

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
  const parsedUrl = url.parse(req.url);
  
  // Extract the path from the URL
  let pathname = `.${parsedUrl.pathname}`;
  
  // If path ends with '/', serve index.html
  if (pathname === './') {
    pathname = './index.html';
  }
  
  // Get the file extension
  const ext = path.parse(pathname).ext;
  
  // Check if the file exists
  fs.access(pathname, (err) => {
    if (err) {
      // If the file doesn't exist, return 404
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }
    
    // Read the file
    fs.readFile(pathname, (err, data) => {
      if (err) {
        // If there's an error reading the file, return 500
        res.statusCode = 500;
        res.end(`Error reading file: ${err.code}`);
        return;
      }
      
      // Set the content type based on the file extension
      res.setHeader('Content-type', mimeTypes[ext] || 'text/plain');
      
      // Send the file data
      res.end(data);
    });
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