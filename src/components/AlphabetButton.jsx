import React from 'react'
import { ALPHABET_VALIDATION } from '../constants'

function AlphabetButton({ alphabet, isActive, onClick }) {
  const renderMiniPreview = () => {
    if (!alphabet || !alphabet.characters) return null

    // Try to render "ABC" as a preview
    const previewText = "ABC"
    const characters = previewText.split('')
    const maxHeight = alphabet.height || 5
    
    // Get character patterns
    const charPatterns = {}
    for (const char of characters) {
      const charData = alphabet.characters[char]
      if (charData) {
        // Handle both old format (array) and new format (object with pattern and baseline)
        let pattern
        let baseline
        if (Array.isArray(charData)) {
          pattern = charData
          baseline = maxHeight - 1
        } else {
          pattern = charData.pattern || []
          baseline = charData.baseline !== undefined ? charData.baseline : maxHeight - 1
        }
        
        // Trim empty columns
        const trimmedPattern = pattern.map(row => {
          if (!row) return ''
          // Find the rightmost filled cell
          let maxWidth = 0
          for (let i = row.length - 1; i >= 0; i--) {
            if (ALPHABET_VALIDATION.VALID_STITCH_CHARS.includes(row[i])) {
              maxWidth = i + 1
              break
            }
          }
          return row.substring(0, maxWidth)
        })
        
        // Find the maximum width for this character across all rows
        const charMaxWidth = Math.max(...trimmedPattern.map(row => row.length), 3)
        
        // Pad each row to the character's maximum width
        const paddedPattern = trimmedPattern.map(row => row.padEnd(charMaxWidth, ' '))
        
        charPatterns[char] = {
          pattern: paddedPattern,
          height: paddedPattern.length,
          baseline: baseline
        }
      }
    }

    // Calculate the maximum extension above and below baseline
    const maxExtendsAbove = Math.max(...Object.values(charPatterns).map(info => info.baseline), 0)
    const maxExtendsBelow = Math.max(...Object.values(charPatterns).map(info => info.height - info.baseline - 1), 0)
    const totalHeight = maxExtendsAbove + maxExtendsBelow + 1

    // Generate the preview grid
    const previewGrid = []
    for (let row = 0; row < totalHeight; row++) {
      const previewRow = []
      for (const char of characters) {
        const charInfo = charPatterns[char]
        if (charInfo) {
          // Calculate which row of the character pattern corresponds to this preview row
          const baselineRow = maxExtendsAbove
          const charPatternRow = charInfo.baseline - (baselineRow - row)
          
          if (charPatternRow >= 0 && charPatternRow < charInfo.height) {
            const pattern = charInfo.pattern[charPatternRow] || ''
            // Use the pattern as-is without padding to preserve variable widths
            for (let col = 0; col < pattern.length; col++) {
              previewRow.push({
                type: ALPHABET_VALIDATION.VALID_STITCH_CHARS.includes(pattern[col]) ? 'filled' : 'empty'
              })
            }
          } else {
            // This row is outside the character's height, add empty space
            const charWidth = charInfo.pattern[0] ? charInfo.pattern[0].length : 3
            for (let i = 0; i < charWidth; i++) {
              previewRow.push({ type: 'empty' })
            }
          }
        } else {
          // Fallback for missing characters
          for (let i = 0; i < 3; i++) {
            previewRow.push({ type: 'empty' })
          }
        }
        // Add small spacing between characters
        previewRow.push({ type: 'empty' })
      }
      previewGrid.push(previewRow)
    }

    return (
      <div className="alphabet-preview-grid">
        {previewGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="alphabet-preview-row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`alphabet-preview-cell ${cell.type}`}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`alphabet-btn ${isActive ? 'active' : ''}`}
    >
      <div className="alphabet-btn-content">
        <div className="alphabet-name">{alphabet.name}</div>
        <div className="alphabet-preview">
          {renderMiniPreview()}
        </div>
      </div>
    </button>
  )
}

export default AlphabetButton 