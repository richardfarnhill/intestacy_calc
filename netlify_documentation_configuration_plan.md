# Netlify Documentation Configuration Plan

## Overview

This document outlines the plan for configuring Netlify to properly handle the documentation files for the UK Intestacy Calculator, particularly focusing on the cohabiting feature documentation. The goal is to ensure that all documentation is accessible through the deployed Netlify site with proper routing and organization.

## Current Configuration

The current Netlify configuration in `netlify.toml` includes:

- Build command: `npm run build`
- Publish directory: `dist`
- Redirects for JavaScript and CSS files
- A redirect from the root path to `/examples/index.html`
- A fallback redirect to `/examples/index.html`

However, it lacks specific configuration for documentation files, which may lead to accessibility issues for these resources.

## Required Changes

### 1. Update `netlify.toml` Configuration

```toml
[build]
  command = "npm run build"
  publish = "dist"

[context.production]
  publish = "dist"
  [[redirects]]
    from = "/intestacy-calculator.min.js"
    to = "/intestacy-calculator.min.js"
    status = 200
    force = true
  [[redirects]]
    from = "/intestacy-calculator.min.css"
    to = "/intestacy-calculator.min.css"
    status = 200
    force = true
  [[redirects]]
    from = "/"
    to = "/examples/index.html"
    status = 200
    force = true
  # New redirects for documentation
  [[redirects]]
    from = "/docs"
    to = "/examples/docs/index.html"
    status = 200
    force = true
  [[redirects]]
    from = "/docs/"
    to = "/examples/docs/index.html"
    status = 200
    force = true
  [[redirects]]
    from = "/docs/*"
    to = "/examples/docs/:splat"
    status = 200
    force = true
  # Fallback redirect
  [[redirects]]
    from = "/*"
    to = "/examples/index.html"
    status = 200

[context.deploy-preview]
  publish = "dist"
```

### 2. Update Build Process

The build process needs to be updated to ensure that all documentation files are properly copied to the `dist` directory. This can be done by updating the scripts in `package.json`:

```json
"scripts": {
  "build": "rollup -c && npm run copy-assets",
  "copy-assets": "npm run copy-examples && npm run copy-docs",
  "copy-examples": "cp -r examples dist/",
  "copy-docs": "mkdir -p dist/docs && cp -r docs/* dist/docs/"
}
```

For Windows compatibility, we can use cross-platform commands:

```json
"scripts": {
  "build": "rollup -c && npm run copy-assets",
  "copy-assets": "npm run copy-examples && npm run copy-docs",
  "copy-examples": "copyfiles -u 1 \"examples/**/*\" dist/",
  "copy-docs": "copyfiles -u 1 \"docs/**/*\" dist/docs/"
}
```

This would require installing the `copyfiles` package:

```
npm install --save-dev copyfiles
```

### 3. Create Documentation Index Page

Create a documentation index page at `examples/docs/index.html` that serves as a central hub for all documentation:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UK Intestacy Calculator Documentation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h1, h2, h3 {
      color: #2c3e50;
    }
    
    h1 {
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }
    
    .nav {
      margin-bottom: 30px;
    }
    
    .nav a {
      display: inline-block;
      margin-right: 15px;
      color: #007bff;
      text-decoration: none;
    }
    
    .nav a:hover {
      text-decoration: underline;
    }
    
    .doc-list {
      list-style-type: none;
      padding: 0;
    }
    
    .doc-list li {
      margin-bottom: 15px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 5px;
      border-left: 4px solid #007bff;
    }
    
    .doc-list a {
      color: #007bff;
      text-decoration: none;
      font-weight: bold;
      font-size: 18px;
    }
    
    .doc-list a:hover {
      text-decoration: underline;
    }
    
    .doc-list p {
      margin-top: 5px;
      margin-bottom: 0;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="nav">
    <a href="../index.html">Home</a>
    <a href="../examples/index.html">Examples</a>
  </div>

  <h1>UK Intestacy Calculator Documentation</h1>
  
  <p>Welcome to the documentation for the UK Intestacy Calculator. This documentation provides information about the calculator's features, implementation details, and development plans.</p>
  
  <ul class="doc-list">
    <li>
      <a href="readme.html">General Documentation</a>
      <p>Overview of the UK Intestacy Calculator, its features, and how to use it.</p>
    </li>
    <li>
      <a href="development.html">Development Plans</a>
      <p>Information about future development plans and roadmap for the calculator.</p>
    </li>
    <li>
      <a href="cohabiting_feature.html">Cohabiting Feature Documentation</a>
      <p>Detailed documentation about the cohabiting feature, including implementation details and legal context.</p>
    </li>
  </ul>
  
  <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 14px; color: #777;">
    <p>UK Intestacy Calculator Documentation &copy; 2025</p>
  </footer>
</body>
</html>
```

### 4. Update Navigation in Existing Documentation

Update the navigation links in all existing documentation files to ensure consistent navigation between documentation pages:

```html
<div class="nav">
  <a href="../index.html">Home</a>
  <a href="index.html">Documentation</a>
  <a href="development.html">Development Plans</a>
  <a href="cohabiting_feature.html">Cohabiting Feature</a>
</div>
```

## Implementation Steps

1. **Update `netlify.toml`**
   - Add the new redirects for documentation paths
   - Test the redirects locally using the Netlify CLI

2. **Update Build Process**
   - Install the `copyfiles` package if using the cross-platform approach
   - Update the scripts in `package.json`
   - Test the build process to ensure all files are copied correctly

3. **Create Documentation Index Page**
   - Create the `examples/docs/index.html` file
   - Test the page locally to ensure all links work correctly

4. **Update Navigation in Existing Documentation**
   - Update the navigation links in all existing documentation files
   - Test navigation between documentation pages

## Testing Plan

1. **Local Testing**
   - Install the Netlify CLI: `npm install -g netlify-cli`
   - Build the project: `npm run build`
   - Start the Netlify dev server: `netlify dev`
   - Test all documentation paths:
     - `/docs`
     - `/docs/`
     - `/docs/index.html`
     - `/docs/cohabiting_feature.html`
     - `/docs/readme.html`
     - `/docs/development.html`

2. **Deploy Preview Testing**
   - Push changes to a feature branch
   - Create a pull request to trigger a Netlify deploy preview
   - Test all documentation paths in the deploy preview

3. **Production Testing**
   - After merging to the main branch, test all documentation paths in the production environment

## GitHub Integration

To maintain privacy while integrating with GitHub:

1. **Configure Repository Settings**
   - Ensure the repository is private if it contains sensitive information
   - Set up branch protection rules for the main branch

2. **Configure Netlify Build Settings**
   - Connect Netlify to the GitHub repository
   - Configure build settings to only build from the main branch and pull requests
   - Set up environment variables in Netlify for any sensitive information

3. **Set Up Continuous Deployment**
   - Configure Netlify to automatically deploy when changes are pushed to the main branch
   - Set up notifications for successful/failed deployments

## Conclusion

This plan outlines the steps needed to properly configure Netlify to handle the documentation files for the UK Intestacy Calculator. By implementing these changes, we will ensure that all documentation is accessible through the deployed Netlify site with proper routing and organization.