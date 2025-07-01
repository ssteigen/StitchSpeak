// Test script to validate the decorative-serif alphabet with updated validation logic
import { FontValidator } from './src/utils/fontValidator.js'
import fs from 'fs'

// Read the decorative-serif.json file
const alphabetData = JSON.parse(fs.readFileSync('./alphabets/decorative-serif.json', 'utf8'))

console.log('=== Testing Decorative Serif Alphabet Validation ===\n')

// Validate the alphabet
const validationResult = FontValidator.validate(alphabetData)

console.log('Validation Results:')
console.log(`✅ Valid: ${validationResult.isValid}`)
console.log(`❌ Errors: ${validationResult.errorCount}`)
console.log(`⚠️  Warnings: ${validationResult.warningCount}\n`)

if (validationResult.errorCount > 0) {
  console.log('Errors:')
  validationResult.errors.forEach((error, index) => {
    console.log(`${index + 1}. ${error}`)
  })
  console.log()
}

if (validationResult.warningCount > 0) {
  console.log('Warnings:')
  validationResult.warnings.forEach((warning, index) => {
    console.log(`${index + 1}. ${warning}`)
  })
  console.log()
}

// Show character support information
console.log('Character Support:')
const chars = validationResult.supportedCharacters
console.log(`- Total characters: ${chars.total}`)
console.log(`- Uppercase: ${chars.categories.uppercase.length} letters`)
console.log(`- Lowercase: ${chars.categories.lowercase.length} letters`)
console.log(`- Numbers: ${chars.categories.numbers.length} digits`)
console.log(`- Punctuation: ${chars.categories.punctuation.length} marks`)
console.log(`- Symbols: ${chars.categories.symbols.length} symbols`)
console.log(`- Spaces: ${chars.categories.spaces.length} supported`)

// Show some character details
console.log('\nCharacter Details:')
const examples = ['A', 'B', 'C', 'a', 'b', 'c', 'I', 'i', 'j']
for (const char of examples) {
  if (alphabetData.characters[char]) {
    const charData = alphabetData.characters[char]
    const pattern = charData.pattern || charData
    const baseline = charData.baseline !== undefined ? charData.baseline : (pattern.length - 1)
    const hasContent = pattern.some(row => 
      row && row.split('').some(c => ['█', '1', 'x'].includes(c))
    )
    console.log(`${char}: ${pattern.length} rows, baseline: ${baseline}, has content: ${hasContent}`)
  }
}

// Test baseline validation specifically
console.log('\n=== Baseline Validation Test ===\n')
let baselineErrors = 0
let baselineWarnings = 0

for (const [char, charData] of Object.entries(alphabetData.characters)) {
  const pattern = charData.pattern || charData
  const baseline = charData.baseline !== undefined ? charData.baseline : (pattern.length - 1)
  
  // Check if baseline is within bounds
  if (baseline < 0 || baseline >= pattern.length) {
    console.log(`❌ ${char}: Baseline ${baseline} out of bounds for pattern height ${pattern.length}`)
    baselineErrors++
  } else {
    console.log(`✅ ${char}: Baseline ${baseline} within bounds (pattern height: ${pattern.length})`)
  }
  
  // Check for height mismatch with alphabet
  if (pattern.length !== alphabetData.height) {
    console.log(`⚠️  ${char}: Height ${pattern.length} doesn't match alphabet height ${alphabetData.height}`)
    baselineWarnings++
  }
}

console.log(`\nBaseline Summary: ${baselineErrors} errors, ${baselineWarnings} warnings`) 