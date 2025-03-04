# PROPRIETARY SOFTWARE
This software is proprietary and confidential. No license is granted for its use, modification, or distribution.
Unauthorized deployment or distribution of this calculator is strictly prohibited.

Copyright © 2025 Richard Farnhill. All rights reserved.

# Intestacy Calculator Project Structure

## Core Components

### Calculator Logic
- Main calculator implementation handling intestacy rules
- Located in src/ directory
- Processes estate value and family relationships to determine inheritance

### Integration Components
- IntestacyWidget.js: Main widget for embedding calculator
- Handles user interface and question flow
- Direct module import integration

### Testing Tools
- Jest for testing
- NPM scripts for test automation

## Documentation Structure

### Documentation
- /README.md: Main project documentation (root directory)
- /DEVELOPMENT.md: Development guidelines (root directory)
- /DEPLOYMENT.md: Deployment procedures (root directory)
- /*.md: Feature planning documents in root directory

### Examples
- /examples/: Directory containing example implementations
  - Various HTML files showing different integration methods
  - CSS for styling examples

## File Organization

### Source Code
- /src/core/: Core calculation logic
- /src/ui/: User interface components
- /src/integration/: Integration modules
- /src/styles/: CSS stylesheets

### Configuration
- package.json: Node.js dependencies and scripts
- netlify.toml: Netlify deployment configuration 