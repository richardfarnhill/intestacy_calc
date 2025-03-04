import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILES_TO_PROCESS = ['README.md', 'DEVELOPMENT.md'];
const GITHUB_PATTERNS = [
    /https:\/\/github\.com\/richardfarnhill\/intestacy_calc/g,
    /git@github\.com:richardfarnhill\/intestacy_calc/g,
    // Add more patterns as needed
];

// Sections to remove from public documentation
const SECTIONS_TO_REMOVE = [
    '## Installation',
    '### Direct Download',
    '### Using NPM',
    '### Using npm',
    '## Development',
    '## Building',
    '## Running Locally',
    '## Setup',
    '## Local Development',
    '## Testing',
    '### Running Tests',
    '## Contributing',
    '## Build Process',
    '### Prerequisites',
    '### Build Steps',
    '## Configuration',
    '### Environment Setup',
    '### Setup',
    '### Building',
    '## License',
    '## Future Development',
    '## Getting Involved',
    '### Basic Integration',
    '### Usage',
    '### Configuration Options',
    '### Methods'
];

// Additional content patterns to remove
const CONTENT_PATTERNS = [
    /```bash[\s\S]*?```/g,    // Remove bash/command blocks
    /```shell[\s\S]*?```/g,   // Remove shell blocks
    /```html[\s\S]*?```/g,    // Remove HTML code blocks
    /```javascript[\s\S]*?```/g, // Remove JavaScript code blocks
    /```js[\s\S]*?```/g,      // Remove JS code blocks
    /`npm .*?`/g,             // Remove npm commands
    /`yarn .*?`/g,            // Remove yarn commands
    /clone.*repository/gi,     // Remove clone references
    /download.*release/gi,     // Remove download references
    /\[.*?clone.*?\]/g,       // Remove clone links
    /\[.*?download.*?\]/g,    // Remove download links
    /This will start.*browser\./g,  // Remove development server references
    /This will create.*styles/gs,   // Remove build output references
    /See \[DEVELOPMENT\.md\].*future enhancements\./g,  // Remove development.md references
    /Add a container element to your HTML:/g, // Remove integration instructions
    /Then include the script and initialize the widget:/g, // Remove script inclusion instructions
    /The widget accepts the following configuration options:/g, // Remove configuration instructions
    /The widget instance provides the following methods:/g, // Remove methods instructions
    /#### `.*?`[\s\S]*?(?=####|$)/g, // Remove method descriptions
    /\| Option \| Type \| Default \| Description \|[\s\S]*?\|/g, // Remove configuration tables
    /\|--------|------|---------|-------------|[\s\S]*?\|/g // Remove table formatting
];

function removePrivateSections(content) {
    let lines = content.split('\n');
    let filteredLines = [];
    let skipSection = false;
    let skipDepth = 0;
    let currentDepth = 0;
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Track code block state
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
        }

        // Track section depth
        if (!inCodeBlock && line.startsWith('#')) {
            currentDepth = line.match(/^#+/)[0].length;
        }
        
        // Check if this line starts a section we should remove
        if (!inCodeBlock && SECTIONS_TO_REMOVE.some(section => line.startsWith(section))) {
            skipSection = true;
            skipDepth = currentDepth;
            continue;
        }
        
        // If we're skipping and find a new section at same or higher level, stop skipping
        if (skipSection && line.startsWith('#')) {
            const newDepth = line.match(/^#+/)[0].length;
            if (newDepth <= skipDepth) {
                skipSection = false;
            }
        }
        
        // Add line if we're not skipping
        if (!skipSection) {
            filteredLines.push(line);
        }
    }

    let processedContent = filteredLines.join('\n');

    // Remove additional content patterns
    CONTENT_PATTERNS.forEach(pattern => {
        processedContent = processedContent.replace(pattern, '');
    });

    // Clean up any empty sections
    processedContent = processedContent.replace(/##.*\n\s*\n##/g, '##');
    processedContent = processedContent.replace(/\n\n\n+/g, '\n\n');
    
    // Remove any trailing sections that might be empty
    processedContent = processedContent.replace(/###.*\s*$/g, '');

    return processedContent;
}

function processFile(filename) {
    const sourcePath = path.join(__dirname, '..', filename);
    const targetPath = path.join(__dirname, '..', 'docs', filename);

    if (!fs.existsSync(sourcePath)) {
        console.log(`Source file ${filename} not found`);
        return;
    }

    let content = fs.readFileSync(sourcePath, 'utf8');

    // Remove GitHub-specific content
    GITHUB_PATTERNS.forEach(pattern => {
        content = content.replace(pattern, '[REPOSITORY_URL]');
    });

    // Remove private sections
    content = removePrivateSections(content);

    // Add proprietary notice
    content = `# PROPRIETARY SOFTWARE
This software is proprietary and confidential. No license is granted for its use, modification, or distribution.

Copyright © ${new Date().getFullYear()} Richard Farnhill. All rights reserved.

${content}`;

    // Ensure docs directory exists
    const docsDir = path.join(__dirname, '..', 'docs');
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }

    // Write processed content
    fs.writeFileSync(targetPath, content);
    console.log(`Processed ${filename} -> docs/${filename}`);
}

// Process each file
FILES_TO_PROCESS.forEach(processFile); 