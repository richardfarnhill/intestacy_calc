# PROPRIETARY SOFTWARE
This software is proprietary and confidential. No license is granted for its use, modification, or distribution.
Unauthorized deployment or distribution of this calculator is strictly prohibited.

Copyright © 2025 Richard Farnhill. All rights reserved.

# Deployment Guide (For Authorized Licensees Only)

## Netlify Deployment

The UK Intestacy Calculator is deployed on Netlify at [https://intestacycalculator.netlify.app/](https://intestacycalculator.netlify.app/). This page serves as an official demonstration site showing different implementation examples of the calculator.

### Important Notice
This deployment guide is intended for authorized licensees only. Unauthorized deployment of the UK Intestacy Calculator is strictly prohibited and may result in legal action.

### Recent Updates

- **Spouse's Interest Description Corrected**: Updated spouse's inheritance description from "life interest" to "absolute interest" aligning with UK law.
- **Question Section UI Fixed**: Resolved issues with unnecessary text and incorrect padding in the question section.
- **Cohabiting No Children Distribution Fixed**: Corrected distribution logic and display for cohabiting individuals without children.
- **Improved Routing Configuration**: Fixed routing issues to ensure all examples and resources are properly accessible
- **Streamlined UI**: Removed redundant documentation sections from the examples page
- **Consolidated Documentation**: Single source of truth for documentation files to simplify maintenance

### Deployment Configuration

1. **Build Settings**
   - Build command: None (direct deployment)
   - Publish directory: Root directory (`.`)
   - Node.js version: 16.x

2. **Environment Variables**
   - No environment variables are required for basic deployment

### Netlify Configuration

The project includes a `netlify.toml` file that configures the deployment:

```toml
[build]
  command = ""
  publish = "."

[context.production]
  publish = "."
  [[redirects]]
    from = "/"
    to = "/examples/index.html"
    status = 200
    force = true
  [[redirects]]
    from = "/examples/*"
    to = "/examples/:splat"
    status = 200
    force = true
  [[redirects]]
    from = "/docs"
    to = "/DOCUMENTATION/README.md"
    status = 200
    force = true
  [[redirects]]
    from = "/docs/"
    to = "/DOCUMENTATION/README.md"
    status = 200
    force = true
  [[redirects]]
    from = "/docs/*"
    to = "/DOCUMENTATION/:splat"
    status = 200
    force = true
  # Fallback redirect
  [[redirects]]
    from = "/*"
    to = "/examples/index.html"
    status = 200
```

### Deployment Process (Authorized Licensees Only)

1. **Initial Setup**
   - Create a Netlify account at [https://www.netlify.com/](https://www.netlify.com/)
   - Connect your GitHub repository
   - Configure build settings as specified above

2. **Continuous Deployment**
   - Netlify automatically deploys when changes are pushed to the main branch
   - Each pull request gets a preview deployment
   - Deploy previews are available for testing before merging

3. **Manual Deployment**
   ```bash
   # Deploy using Netlify CLI
   netlify deploy
   ```

### Examples Page

The main deployment serves an examples page that showcases different implementations:

1. **Basic Example**: Simple widget integration
2. **Simple Include Example**: Module import implementation
3. **Custom Theme Example**: Styled implementation
4. **Email Compatible Example**: Email newsletter integration

### Troubleshooting

Common deployment issues and solutions:

1. **Asset Loading Issues**
   - Check file paths in redirects
   - Verify CORS settings if needed
   - Ensure assets are in the correct locations

2. **Preview Deployment Issues**
   - Clear cache and rebuild
   - Check branch settings
   - Verify deploy settings in Netlify UI 
   
3. **404 Errors**
   - Ensure all redirects in netlify.toml use status 200
   - Check path patterns in redirects
   - Verify file locations match redirect destinations

## Security and Access Control

As this is proprietary software, ensure that:

1. Repository access is restricted to authorized personnel only
2. Deployment platforms have appropriate access controls
3. All demonstration deployments include the proprietary notice
4. Any publicly accessible instances are for demonstration purposes only 