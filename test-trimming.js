// Simple test script to verify trimming functionality
import { ALPHABET_VALIDATION } from './src/constants.js'

// Define the trimming functions inline for testing
function trimCharacterPattern(pattern) {
  if (!pattern || pattern.length === 0) {
    return []
  }

  // Find the bounds of non-empty content
  let minRow = pattern.length
  let maxRow = -1
  let minCol = pattern[0] ? pattern[0].length : 0
  let maxCol = -1

  // Find the bounds of filled cells
  for (let row = 0; row < pattern.length; row++) {
    const rowStr = pattern[row] || ''
    for (let col = 0; col < rowStr.length; col++) {
      if (ALPHABET_VALIDATION.VALID_STITCH_CHARS.includes(rowStr[col])) {
        minRow = Math.min(minRow, row)
        maxRow = Math.max(maxRow, row)
        minCol = Math.min(minCol, col)
        maxCol = Math.max(maxCol, col)
      }
    }
  }

  // If no filled cells found, return empty pattern
  if (maxRow < minRow || maxCol < minCol) {
    return []
  }

  // Extract the trimmed pattern
  const trimmedPattern = []
  for (let row = minRow; row <= maxRow; row++) {
    const rowStr = pattern[row] || ''
    const trimmedRow = rowStr.substring(minCol, maxCol + 1)
    trimmedPattern.push(trimmedRow)
  }

  return trimmedPattern
}

function trimAlphabet(alphabet) {
  if (!alphabet || !alphabet.characters) {
    return alphabet
  }

  const trimmedAlphabet = {
    ...alphabet,
    characters: {}
  }

  // Process each character
  for (const [char, charData] of Object.entries(alphabet.characters)) {
    let pattern, baseline

    // Handle both old format (array) and new format (object with pattern and baseline)
    if (Array.isArray(charData)) {
      pattern = charData
      baseline = alphabet.height - 1 // Default to bottom row for old format
    } else {
      pattern = charData.pattern || []
      baseline = charData.baseline !== undefined ? charData.baseline : alphabet.height - 1
    }

    // Check if the character has any content
    const hasContent = pattern.some(row => 
      row && row.split('').some(char => ALPHABET_VALIDATION.VALID_STITCH_CHARS.includes(char))
    )

    if (hasContent) {
      // Trim the pattern if it has content
      const trimmedPattern = trimCharacterPattern(pattern)
      
      // Adjust baseline for trimmed pattern
      // Find the first row with content to calculate how many rows were removed from top
      let firstContentRow = 0
      for (let i = 0; i < pattern.length; i++) {
        const row = pattern[i] || ''
        if (row.split('').some(char => ALPHABET_VALIDATION.VALID_STITCH_CHARS.includes(char))) {
          firstContentRow = i
          break
        }
      }
      
      const rowsRemovedFromTop = firstContentRow
      const newBaseline = Math.max(0, baseline - rowsRemovedFromTop)

      // Store the trimmed character
      if (Array.isArray(charData)) {
        // Convert old format to new format
        trimmedAlphabet.characters[char] = {
          pattern: trimmedPattern,
          baseline: newBaseline
        }
      } else {
        // Keep new format
        trimmedAlphabet.characters[char] = {
          ...charData,
          pattern: trimmedPattern,
          baseline: newBaseline
        }
      }
    } else {
      // Keep empty characters as-is but ensure they have the new format
      if (Array.isArray(charData)) {
        // Convert old format to new format with minimal empty pattern
        trimmedAlphabet.characters[char] = {
          pattern: [' '],
          baseline: 0
        }
      } else {
        // Keep new format as-is
        trimmedAlphabet.characters[char] = charData
      }
    }
  }

  // Update the alphabet height to the maximum character height
  const maxHeight = Math.max(...Object.values(trimmedAlphabet.characters).map(charData => {
    if (Array.isArray(charData)) {
      return charData.length
    } else {
      return charData.pattern ? charData.pattern.length : 0
    }
  }), 1)

  trimmedAlphabet.height = maxHeight

  return trimmedAlphabet
}

// Read the decorative-serif.json file
import fs from 'fs'
const alphabetData = JSON.parse(fs.readFileSync('./alphabets/decorative-serif.json', 'utf8'))

console.log('Original alphabet:')
console.log(`- Name: ${alphabetData.name}`)
console.log(`- Height: ${alphabetData.height}`)
console.log(`- Characters: ${Object.keys(alphabetData.characters).length}`)

// Count characters with content vs empty
let withContent = 0
let empty = 0
for (const [char, charData] of Object.entries(alphabetData.characters)) {
  const pattern = charData.pattern || []
  const hasContent = pattern.some(row => 
    row && row.split('').some(c => ['█', '1', 'x'].includes(c))
  )
  if (hasContent) {
    withContent++
  } else {
    empty++
  }
}

console.log(`- Characters with content: ${withContent}`)
console.log(`- Empty characters: ${empty}`)

// Test trimming
const trimmedAlphabet = trimAlphabet(alphabetData)

console.log('\nTrimmed alphabet:')
console.log(`- Name: ${trimmedAlphabet.name}`)
console.log(`- Height: ${trimmedAlphabet.height}`)
console.log(`- Characters: ${Object.keys(trimmedAlphabet.characters).length}`)

// Count characters with content vs empty in trimmed version
let trimmedWithContent = 0
let trimmedEmpty = 0
for (const [char, charData] of Object.entries(trimmedAlphabet.characters)) {
  const pattern = charData.pattern || []
  const hasContent = pattern.some(row => 
    row && row.split('').some(c => ['█', '1', 'x'].includes(c))
  )
  if (hasContent) {
    trimmedWithContent++
  } else {
    trimmedEmpty++
  }
}

console.log(`- Characters with content: ${trimmedWithContent}`)
console.log(`- Empty characters: ${trimmedEmpty}`)

// Show some examples of trimmed characters
console.log('\nExamples of trimmed characters:')
const examples = ['A', 'B', 'C', 'a', 'b', 'c']
for (const char of examples) {
  if (trimmedAlphabet.characters[char]) {
    console.log(`${char}: ${trimmedAlphabet.characters[char].pattern.length} rows, baseline: ${trimmedAlphabet.characters[char].baseline}`)
  }
} 