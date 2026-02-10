# CLAUDE.md - Project Guidelines for Claude Code

## Project Overview

**UK Intestacy Calculator Widget** - A JavaScript widget that calculates estate distribution under UK intestacy rules. Pure frontend implementation with no backend dependencies. The project is proprietary and only for authorized deployment by WillSolicitor.co.uk.

This is part of a larger initiative to create a suite of professional tools and lead magnets:
- **Primary Product:** UK Intestacy Calculator (current)
- **Planned:** Advisor Architect (guidance tool for complex matters)
- **Planned:** Will Builder (lead magnet for lead capture)
- **Planned:** Other estate planning tools (see ROADMAP.md)

### Key Resources
- **Live Demo:** https://intestacycalculator.netlify.app/
- **Current Version:** 1.3.1
- **Repository:** Private (richardfarnhill/intestacy_calc)
- **Planning:** See PLANNING_homepage.md for new homepage design (in development)

---

## Project Structure

```
src/
├── core/IntestacyCalculator.js      # Core calculation logic - CRITICAL
├── integration/IntestacyWidget.js   # Widget initialization & integration
├── ui/IntestacyUI.js                # UI component rendering
└── styles/main.css                  # Styling

dist/                                # Built/minified distribution files
examples/                            # Integration examples (HTML)
tests/                              # Test suite
README.md                           # Root documentation
CLAUDE.md                           # This file
```

---

## Critical Areas - Extra Care Required

### ⚠️ Calculation Logic (src/core/IntestacyCalculator.js)

**Why:** Accuracy is paramount. Incorrect calculations could mislead users about their inheritance.

**Requirements:**
- Always run tests before finalizing changes to calculation logic
- Changes must align with current UK intestacy law (deaths post-Oct 2014)
- Test with multiple scenarios: married with/without children, cohabiting, widowed, etc.
- Preserve existing test cases; add new ones for any new scenarios

**Key Methods to Understand:**
- `calculateDistribution()` - Main calculation entry point
- `getInheritanceHierarchyText()` - Determines beneficiary order
- `_populateDistributionData()` - Builds detailed distribution breakdown

---

## Git Workflow

**Approach:** Feature branches + direct merge to main

1. **Branch Naming:** Use descriptive names
   - `fix/description` - Bug fixes
   - `feat/description` - New features
   - `refactor/description` - Code refactoring

2. **Commit Messages:** Clear and specific
   ```
   fix: brief description of what was fixed

   Optional longer explanation if needed.
   ```

3. **Merging:**
   - Create feature branch from main
   - Merge directly to main when ready (no formal PR required)
   - Delete feature branch after merging
   - Push to remote immediately after merge

4. **Version Bumps:**
   - Update `package.json` version only for **production releases**
   - Use Semantic Versioning (MAJOR.MINOR.PATCH)
   - Create git tag when releasing: `git tag -a v1.3.1 -m "Release v1.3.1"`

---

## Development Setup

### Installation
```bash
npm install
```

### Commands

**Development Server:**
```bash
npm run serve
```
Starts local server on port 3000 with example files.

**Build:**
```bash
npm run build
```
Creates minified distribution in `dist/intestacy-widget.min.js` using esbuild.

**Tests:**
```bash
npm test
```
Runs test suite using Jest. Tests are in `tests/` directory.

---

## Code Style & Standards

### JavaScript
- Use ES6+ syntax (modules, arrow functions, template literals)
- Consistent indentation (2 spaces)
- Descriptive variable/function names
- Add comments only when logic isn't self-evident

### HTML/CSS
- Semantic HTML structure
- BEM-like class naming in styles
- Accessibility first (ARIA labels, semantic elements, keyboard navigation)
- WCAG 2.1 AA compliance required

### No External Dependencies
- Pure JavaScript only - no frameworks or libraries
- No jQuery, React, Vue, etc.
- No npm packages beyond dev dependencies

---

## Testing Requirements

### When to Test
- **Always:** Changes to calculation logic (IntestacyCalculator.js)
- **Always:** Changes to question flow or data validation
- **Optional:** UI styling, layout changes
- **Optional:** Documentation updates

### Running Tests
```bash
npm test
```

### Test Files Location
- `tests/IntestacyCalculator.test.js` - Main test suite
- Tests use Jest framework

### Key Test Scenarios
- Single person, no children
- Married with children
- Married without children
- Cohabiting with/without children
- Widowed with/without children
- Multiple family configurations

---

## Sensitive Areas - Legal & Messaging

### Cohabiting Partner Warnings

This is legally sensitive. The UK law treats cohabiting partners differently from spouses (no automatic inheritance rights).

**Requirements:**
- Warnings must be prominent and persistent throughout the flow
- Must clearly state that cohabiting partners have NO inheritance rights
- Must recommend creating a Will
- Contact information must be current and accurate

**Current Implementation:**
- Red warning banner appears when "cohabiting" is selected
- Warning persists through entire question flow
- Results emphasize lack of inheritance rights
- Contact info displays in results: 0161 348 7581 / hello@WillSolcitor.co.uk

### Proprietary Notices

This is proprietary software. All files should include proprietary notice where appropriate:
- README.md - Top of file
- License in package.json: "Proprietary"
- No open-source licenses or permissive licensing

---

## Dependencies & External Services

**✅ No external APIs or credentials needed.**

This is a pure frontend calculator - no backend, no databases, no third-party services.

**Build Tools:**
- esbuild (0.27.3+) - For bundling/minifying
- Jest - For testing
- npm/Node.js - For package management

---

## Common Tasks

### Fix a Bug
1. Create branch: `git checkout -b fix/description-of-bug`
2. Make changes
3. If calculation logic: run `npm test` to verify
4. Commit: `git add . && git commit -m "fix: description"`
5. Merge to main: `git checkout main && git merge fix/description-of-bug`
6. Push: `git push origin main`
7. Delete branch: `git branch -D fix/description-of-bug && git push origin --delete fix/description-of-bug`

### Add a Feature
1. Create branch: `git checkout -b feat/description`
2. Implement feature
3. Test thoroughly: `npm test`
4. Update README.md if needed
5. Commit & merge following same process as above

### Security Checks
```bash
npm audit
npm audit fix
```
Fix vulnerabilities immediately. Run before deployments.

---

## Deployment

The project deploys to **Netlify** at https://intestacycalculator.netlify.app/

**Before Deploying:**
1. Ensure main branch is clean: `git status` shows nothing
2. Run full test suite: `npm test`
3. Build locally: `npm run build`
4. Verify examples work in browser
5. Check no console errors in example files

**Version Bump Only:**
- Update `package.json` version
- Create git tag: `git tag -a v1.3.1 -m "Release v1.3.1"`
- Push tag: `git push origin v1.3.1`

---

## Important Notes for Claude

- **Always read files first** before suggesting changes
- **Calculation logic changes:** Always run `npm test` and verify results
- **No breaking changes** without discussion - this is production code
- **Preserve backwards compatibility** when possible
- **Update README.md** if user-facing functionality changes
- **Keep it simple** - avoid over-engineering solutions
- **Security first** - check for XSS, injection, data leaks in any user input handling

---

**Last Updated:** February 2025
**Maintained By:** Richard Farnhill
**License:** Proprietary - All Rights Reserved
