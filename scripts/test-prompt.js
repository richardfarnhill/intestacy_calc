/**
 * Test Prompt Script
 * 
 * This script helps ensure tests are run after UI changes.
 * It can be integrated into the development workflow to prompt
 * for testing after UI-related files are modified.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { execSync } from 'child_process';

// UI-related file patterns
const UI_FILE_PATTERNS = [
  /ui\/.*\.js$/,
  /styles\/.*\.css$/,
  /templates\/.*\.html$/
];

// Check if a file is UI-related
function isUIFile(filePath) {
  return UI_FILE_PATTERNS.some(pattern => pattern.test(filePath));
}

// Get recently modified files
function getRecentlyModifiedFiles() {
  // This is a simplified implementation
  // In a real scenario, you might use git to get recently modified files
  console.log('Checking for recently modified UI files...');
  
  // Example implementation using git
  try {
    const output = execSync('git diff --name-only HEAD').toString();
    
    return output
      .split('\n')
      .filter(file => file && isUIFile(file));
  } catch (error) {
    console.error('Error getting modified files:', error.message);
    return [];
  }
}

// Prompt for testing
function promptForTesting(modifiedFiles) {
  if (modifiedFiles.length === 0) {
    console.log('No UI files have been modified. No tests needed.');
    return;
  }
  
  console.log('The following UI files have been modified:');
  modifiedFiles.forEach(file => console.log(`- ${file}`));
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Would you like to run tests now? (y/n) ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('Running tests...');
      // Execute tests
      try {
        const output = execSync('npm test').toString();
        console.log(output);
        console.log('Tests completed successfully.');
      } catch (error) {
        console.error('Tests failed. This may be due to UI changes that require test updates.');
        if (error.stdout) {
          console.log(error.stdout.toString());
        }
        rl.question('Would you like to update the tests to match the new UI? (y/n) ', (updateAnswer) => {
          if (updateAnswer.toLowerCase() === 'y') {
            console.log('Please update the tests to match the new UI.');
          }
          rl.close();
        });
        return;
      }
    } else {
      console.log('Tests skipped. Remember to run tests before committing.');
    }
    rl.close();
  });
}

// Main function
function main() {
  const modifiedFiles = getRecentlyModifiedFiles();
  promptForTesting(modifiedFiles);
}

// Run the script
main(); 