# UK Intestacy Calculator - Roadmap

## Overview

This document outlines planned features and improvements for the UK Intestacy Calculator widget. Items are prioritized based on impact and effort.

---

## Planned Enhancements

### 🔥 High Priority (High Impact, Low Effort)

#### Publish npm Package
- **Status:** Planned
- **Description:** Create and publish `@willsolicitor/intestacy-calculator` to npm registry for easy installation
- **Rationale:** Allow developers to install via `npm install @willsolicitor/intestacy-calculator`
- **Work Involved:**
  - Set up package structure and build configuration
  - Create package metadata (package.json updates)
  - Test packaging locally
  - Publish to npm registry
- **Current Reference:** Commented out in `examples/index.html` - to be enabled when package is published

#### Enhanced PDF Reports
- **Status:** Planned
- **Description:** Generate downloadable PDF reports of distribution calculations
- **Rationale:** Users want to save and share their results
- **Work Involved:**
  - Integrate PDF generation library
  - Design PDF template
  - Add download button to results screen

#### Email Report Generation
- **Status:** Planned
- **Description:** Allow users to email their calculation results directly
- **Rationale:** Improve user engagement and follow-up conversion
- **Work Involved:**
  - Backend email service integration
  - Email template design
  - User email input validation

---

### 🚀 Medium Priority (High Impact, High Effort)

#### TypeScript Migration
- **Status:** Planned
- **Description:** Migrate JavaScript codebase to TypeScript for better type safety
- **Rationale:** Prevent bugs, improve developer experience, better code documentation
- **Work Involved:**
  - Convert all .js files to .ts
  - Add type definitions
  - Update build configuration
  - Update tests

#### Multi-Language Support
- **Status:** Planned
- **Languages:** Polish, Romanian (priority), others on request
- **Description:** Support multiple languages for broader accessibility
- **Rationale:** Expand market reach to non-English speaking users
- **Work Involved:**
  - Implement i18n framework
  - Create language translation files
  - Update UI for language switching
  - Test all calculation logic in different languages

#### Admin Dashboard
- **Status:** Planned
- **Description:** Create admin interface for configuration management
- **Features:**
  - Customize warning messages
  - Manage contact information
  - Configure branding (colors, logos)
  - View analytics
  - Manage user sessions
- **Rationale:** Enable non-technical staff to manage the calculator without code changes
- **Work Involved:**
  - Backend API development
  - Dashboard UI creation
  - Authentication and authorization
  - Database setup

#### CRM Integration
- **Status:** Planned
- **Integrations:** HubSpot (priority), others on request
- **Description:** Automatically capture leads and sync with CRM
- **Rationale:** Streamline lead capture and follow-up workflows
- **Work Involved:**
  - HubSpot API integration
  - Lead scoring logic
  - Automated workflow triggers
  - Data mapping and validation

---

### ⚡ Low Priority (Low Impact, Low Effort)

#### UI/UX Enhancements
- **Status:** Planned
- **Features:**
  - Animated transitions between questions
  - Progress indicator/progress bar
  - Breadcrumb navigation
  - Mobile-optimized animations
- **Rationale:** Improve user experience and engagement

#### Accessibility Improvements
- **Status:** Partially Complete (WCAG 2.1 AA achieved)
- **Remaining Items:**
  - Enhanced screen reader optimizations
  - Improved keyboard navigation patterns
  - High contrast mode toggle

#### Analytics Integration
- **Status:** Planned
- **Features:**
  - Track user interaction patterns
  - Measure completion rates
  - Monitor conversion points
  - Custom event tracking
- **Rationale:** Gather data to inform design improvements

---

### ⏱️ Future Consideration (Low Impact, High Effort)

#### Will Creation Integration
- **Status:** Future
- **Description:** Allow users to directly create a Will from their calculation results
- **Rationale:** Convert interested users into customers for Will services
- **Dependencies:** Requires integration with Will creation system

#### Inheritance Tax Calculator
- **Status:** Future
- **Description:** Extend calculator to estimate inheritance tax implications
- **Rationale:** Provide more comprehensive estate planning information
- **Complexity:** High - requires UK tax law expertise

#### White-Label Portal
- **Status:** Future
- **Description:** Partner program allowing other legal firms to rebrand the calculator
- **Rationale:** Generate licensing revenue and expand market presence
- **Requirements:** Admin dashboard, multi-tenancy support

---

## Development Timeline

### Current Sprint (February 2025)
- ✅ Fix critical and high-priority bugs
- ✅ Consolidate documentation
- ✅ Resolve npm security vulnerabilities
- 🔄 Publish npm package (`@willsolicitor/intestacy-calculator`)

### Q1 2025
- [ ] Publish npm package to registry
- [ ] Implement PDF report generation
- [ ] Begin TypeScript migration planning

### Q2 2025
- [ ] Complete TypeScript migration
- [ ] Email report functionality
- [ ] Begin multi-language support framework

### Q3 2025
- [ ] Launch multi-language support (Polish, Romanian)
- [ ] Admin dashboard MVP (configuration management)
- [ ] Basic analytics integration

### Q4 2025
- [ ] CRM integration (HubSpot)
- [ ] Enhanced UI/UX animations
- [ ] White-label portal planning

---

## Dependencies & Blockers

### External Dependencies
- **npm Registry Access:** Required to publish `@willsolicitor/intestacy-calculator`
- **HubSpot API Key:** Needed for CRM integration
- **PDF Library:** Need to evaluate and integrate (e.g., pdfkit, html2pdf)
- **Email Service:** Need SMTP or third-party email service (e.g., SendGrid, Mailgun)

### Internal Blockers
- TypeScript migration must complete before other refactoring work
- Admin dashboard required before multi-tenant white-label portal

---

## Metrics & Success Criteria

### npm Package Publication
- ✅ Package published and installable via npm
- ✅ 100+ weekly downloads within 3 months
- ✅ Positive community feedback

### PDF Reports
- ✅ Users can download PDFs of results
- ✅ 50%+ of users download their results
- ✅ No errors in PDF generation

### Multi-Language Support
- ✅ Polish and Romanian fully translated and tested
- ✅ No calculation errors in translated versions
- ✅ User satisfaction scores improve

---

## Contributing to the Roadmap

To suggest new features or changes to this roadmap:
1. Create an issue in the repository with the feature request
2. Include use cases and rationale
3. Discuss with the team before implementation

---

**Last Updated:** February 2025
**Maintained By:** Richard Farnhill
**Review Frequency:** Quarterly
