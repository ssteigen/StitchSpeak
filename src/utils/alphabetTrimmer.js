import { ALPHABET_VALIDATION } from '../constants'

/**
 * Trims empty rows and columns from a character pattern
 * @param {string[]} pattern - Array of strings representing the character pattern
 * @returns {string[]} - Trimmed pattern with empty rows and columns removed
 */
export function trimCharacterPattern(pattern) {
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

/**
 * Trims empty rows and columns from all characters in an alphabet
 * @param {Object} alphabet - The alphabet object to trim
 * @returns {Object} - The trimmed alphabet
 */
export function trimAlphabet(alphabet) {
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