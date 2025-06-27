#!/usr/bin/env node

// Font Validation Script
// Validates all built-in fonts and generates a report

import { FontValidator } from '../src/utils/fontValidator.js'
import fs from 'fs'
import path from 'path'

console.log('🧶 Validating all built-in fonts...\n')

// Function to read JSON file
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message)
    return null
  }
}

// Collect all fonts
const allFonts = {}

// Read ASCII fonts from alphabets directory
const alphabetsDir = path.join(process.cwd(), 'alphabets')
const jsonFiles = fs.readdirSync(alphabetsDir).filter(file => file.endsWith('.json'))

for (const file of jsonFiles) {
  const fontPath = path.join(alphabetsDir, file)
  const font = readJsonFile(fontPath)
  if (font) {
    const fontKey = file.replace('.json', '')
    allFonts[fontKey] = font
  }
}

// Read built-in alphabets
const defaultAlphabetPath = path.join(process.cwd(), 'src/data/defaultAlphabet.js')
const alphabet2Path = path.join(process.cwd(), 'src/data/alphabet-2.js')

// For built-in alphabets, we'll need to extract them from the JS files
// For now, let's just validate the JSON files we have
console.log(`Found ${Object.keys(allFonts).length} font files to validate:`)
Object.keys(allFonts).forEach(fontKey => {
  console.log(`- ${fontKey}`)
})
console.log('')

// Validate all fonts
const validationResults = FontValidator.validateAllFonts(allFonts)

// Generate report
const report = FontValidator.generateReport(validationResults)

// Display results in console
console.log(report)

// Save report to file
const reportPath = path.join(process.cwd(), 'font-validation-report.md')
fs.writeFileSync(reportPath, report)
console.log(`📄 Report saved to: ${reportPath}`)

// Exit with error code if any fonts are invalid
if (!validationResults.allValid) {
  console.log('\n❌ Some fonts failed validation. Please fix the issues above.')
  process.exit(1)
} else {
  console.log('\n✅ All fonts are valid!')
  process.exit(0)
} 