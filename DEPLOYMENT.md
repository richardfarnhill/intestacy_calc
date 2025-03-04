# Deployment Guide

## Netlify Deployment

The UK Intestacy Calculator is deployed on Netlify at [https://intestacycalculator.netlify.app/](https://intestacycalculator.netlify.app/). This page serves as a demonstration site showing different implementation examples of the calculator.

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
    from = "/*"
    to = "/examples/index.html"
    status = 200
```

### Deployment Process

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