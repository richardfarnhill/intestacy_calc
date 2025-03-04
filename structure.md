# Intestacy Calculator Project Structure

## Core Components

### Calculator Logic
- Main calculator implementation handling intestacy rules
- Located in src/ directory
- Processes estate value and family relationships to determine inheritance

### Integration Components
- IntestacyWidget.js: Main widget for embedding calculator
- Handles user interface and question flow
- Built using Rollup for distribution

### Build Tools
- Rollup for bundling
- Jest for testing
- Copyfiles for documentation management
- NPM scripts for build automation

## Documentation Structure

### Private Documentation (GitHub Repository)
- /README.md: Main project documentation (root directory)
- /DEVELOPMENT.md: Development guidelines (root directory)
- /DEPLOYMENT.md: Deployment procedures (root directory)
- /docs/: Technical implementation documents
  - cohabiting_feature.md
  - [other technical docs]
- /*.md: Feature planning documents in root directory

### Public Documentation (Redacted for External Use)
- Source: /docs/ directory
  - Contains redacted versions of documentation
- Built: /dist/docs/ directory
  - README.md (redacted version)
  - DEVELOPMENT.md (redacted version)
  - Feature documentation
- All docs accessible via picker page links

### Documentation Copy Process
- Automated process monitors changes to:
  - /README.md
  - /DEVELOPMENT.md
- When changes detected:
  1. Copy content to temporary processing area
  2. Remove GitHub-specific content (repository URLs, private information)
  3. Copy processed files to /docs/ directory
  4. Build process then copies to /dist/docs/
- Process triggered by:
  - Pre-commit hook for local development
  - Build process for deployment

## Picker Page ("Review Page")
- Purpose: Allow colleagues to review different implementations
- Deployed on Netlify
- Contains:
  - Branded header with logo
  - Explanatory text about available implementations
  - Links to different example implementations
  - Links to redacted documentation
- Source: examples/index.html
- Built version: dist/index.html

## Build and Deployment Flow
1. Source files processed by Rollup
2. Documentation copied and processed
3. Examples copied to dist/
4. Netlify deploys from dist/ directory

## File Structure 