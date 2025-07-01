import React from 'react'
import { CHART_SETTINGS, CHART_COLORS, ALPHABET_VALIDATION } from '../constants'

function CrochetChart({ text, alphabet }) {
  // Helper function to trim empty columns from a character pattern
  const trimEmptyColumns = (pattern) => {
    if (!pattern || pattern.length === 0) return pattern
    
    // Find the rightmost column that has any filled cells
    let maxWidth = 0
    for (let row of pattern) {
      if (row) {
        // Find the rightmost filled cell in this row
        for (let i = row.length - 1; i >= 0; i--) {
          if (ALPHABET_VALIDATION.VALID_STITCH_CHARS.includes(row[i])) {
            maxWidth = Math.max(maxWidth, i + 1)
            break
          }
        }
      }
    }
    
    // Trim each row to the maximum width
    return pattern.map(row => row ? row.substring(0, maxWidth) : '')
  }

  const generateChart = () => {
    if (!text.trim() || !alphabet.characters) {
      return null
    }

    // Use the text as-is (preserve case)
    const characters = text.split('')
    const maxHeight = alphabet.height || 5
    const chart = []
    const spacing = 1

    // Pre-process all character patterns and get their heights and baselines
    const characterInfo = {}
    for (const [char, charData] of Object.entries(alphabet.characters)) {
      // Handle both old format (array) and new format (object with pattern and baseline)
      let pattern
      let baseline
      if (Array.isArray(charData)) {
        pattern = charData
        baseline = maxHeight - 1 // Default to bottom row for old format
      } else {
        pattern = charData.pattern || []
        baseline = charData.baseline !== undefined ? charData.baseline : maxHeight - 1
      }
      
      const trimmedPattern = trimEmptyColumns(pattern)
      const charHeight = trimmedPattern.length
      
      characterInfo[char] = {
        pattern: trimmedPattern,
        height: charHeight,
        baseline: baseline
      }
    }

    // Calculate the maximum extension above and below baseline across all characters
    const maxExtendsAbove = Math.max(...Object.values(characterInfo).map(info => info.baseline), 0)
    const maxExtendsBelow = Math.max(...Object.values(characterInfo).map(info => info.height - info.baseline - 1), 0)
    
    // Calculate the total chart height needed for baseline alignment
    const totalChartHeight = maxExtendsAbove + maxExtendsBelow + 1 // +1 for the baseline row itself

    // Generate the chart grid with baseline alignment
    for (let row = 0; row < totalChartHeight; row++) {
      const chartRow = []
      for (let char of characters) {
        if (char === ' ') {
          // Add empty space
          for (let i = 0; i < 3; i++) {
            chartRow.push({ type: 'empty', char: '' })
          }
        } else {
          // Try exact case, then fallback to other case
          let charInfo = characterInfo[char]
          if (!charInfo) {
            const altChar = char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()
            charInfo = characterInfo[altChar]
          }
          
          if (charInfo) {
            // Calculate which row of the character pattern corresponds to this chart row
            // The baseline is at row maxExtendsAbove in the chart
            const baselineRow = maxExtendsAbove
            const charPatternRow = charInfo.baseline - (baselineRow - row)
            
            if (charPatternRow >= 0 && charPatternRow < charInfo.height) {
              const pattern = charInfo.pattern[charPatternRow] || ''
              // Use the pattern as-is without padding to preserve variable widths
              for (let col = 0; col < pattern.length; col++) {
                chartRow.push({
                  type: (ALPHABET_VALIDATION.VALID_STITCH_CHARS.includes(pattern[col])) ? 'filled' : 'empty',
                  char: col === 0 ? char : ''
                })
              }
            } else {
              // This row is outside the character's height, add empty space
              const charWidth = charInfo.pattern[0] ? charInfo.pattern[0].length : 5
              for (let i = 0; i < charWidth; i++) {
                chartRow.push({ type: 'empty', char: '' })
              }
            }
          } else {
            // Fallback for missing characters
            for (let i = 0; i < 5; i++) {
              chartRow.push({ type: 'empty', char: i === 0 ? '?' : '' })
            }
          }
        }
        // Add spacing between characters
        if (char !== ' ') {
          for (let i = 0; i < spacing; i++) {
            chartRow.push({ type: 'empty', char: '' })
          }
        }
      }
      chart.push(chartRow)
    }

    // Pad all rows to the same length (max row length)
    const maxRowLength = Math.max(...chart.map(row => row.length))
    for (let row of chart) {
      while (row.length < maxRowLength) {
        row.push({ type: 'empty', char: '' })
      }
    }

    return chart
  }

  const chart = generateChart()
  const cellSize = CHART_SETTINGS.CELL_SIZE

  // Debugging output
  if (chart) {
    const rowLengths = chart.map((row, i) => `Row ${i}: ${row.length}`).join(', ')
    const gridCols = chart[0]?.length || 0
    
    // Calculate baseline alignment info
    const characterInfo = {}
    for (const [char, charData] of Object.entries(alphabet.characters)) {
      let pattern, baseline
      if (Array.isArray(charData)) {
        pattern = charData
        baseline = alphabet.height - 1
      } else {
        pattern = charData.pattern || []
        baseline = charData.baseline !== undefined ? charData.baseline : alphabet.height - 1
      }
      const charHeight = pattern.length
      characterInfo[char] = { height: charHeight, baseline: baseline }
    }
    
    const maxExtendsAbove = Math.max(...Object.values(characterInfo).map(info => info.baseline), 0)
    const maxExtendsBelow = Math.max(...Object.values(characterInfo).map(info => info.height - info.baseline - 1), 0)
    
    // eslint-disable-next-line
    console.log('[CrochetChart Debug]', {
      text,
      font: alphabet.name,
      rowLengths,
      gridTemplateColumns: gridCols,
      chartHeight: chart.length,
      variableHeight: true,
      baselineAlignment: true,
      maxExtendsAbove,
      maxExtendsBelow,
      baselineRow: maxExtendsAbove,
      characterInfo: Object.fromEntries(
        Object.entries(characterInfo).slice(0, 5) // Show first 5 characters
      )
    })
    
    // Print chart as string representation
    const chartString = chart.map(row => 
      row.map(cell => cell.type === 'filled' ? '█' : ' ').join('')
    ).join('\n')
    // eslint-disable-next-line
    console.log('[CrochetChart String Output]:\n' + chartString)
    
    // Detailed character breakdown with height and baseline info
    const characters = text.toUpperCase().split('')
    const detailedBreakdown = characters.map(char => {
      if (char === ' ') return { char: 'SPACE', width: 3, height: 1, baseline: 0 }
      const charData = alphabet.characters[char]
      if (!charData) return { char, width: 5, height: 5, baseline: 4, error: 'missing' }
      
      // Handle both old format (array) and new format (object with pattern and baseline)
      let pattern
      let baseline
      if (Array.isArray(charData)) {
        pattern = charData
        baseline = alphabet.height - 1
      } else {
        pattern = charData.pattern || []
        baseline = charData.baseline !== undefined ? charData.baseline : alphabet.height - 1
      }
      
      const widths = pattern.map(row => row.length)
      const height = pattern.length
      return { 
        char, 
        width: Math.max(...widths), 
        height: height,
        baseline: baseline,
        extendsAbove: baseline,
        extendsBelow: height - baseline - 1,
        widths 
      }
    })
    // eslint-disable-next-line
    console.log('[Character Breakdown with Heights]:', detailedBreakdown)
    
    // Show row-by-row character positions
    const rowAnalysis = chart.map((row, rowIndex) => {
      const charPositions = []
      let currentPos = 0
      for (const cell of row) {
        if (cell.char && cell.char !== '') {
          charPositions.push(`${cell.char}@${currentPos}`)
        }
        currentPos++
      }
      return `Row ${rowIndex}: ${charPositions.join(', ')}`
    })
    // eslint-disable-next-line
    console.log('[Row Analysis]:\n' + rowAnalysis.join('\n'))
  }

  return (
    <div className="preview-section">
      {chart ? (
        <div className="chart-wrapper">
          <div className="chart-container">
            {chart.map((row, rowIndex) => (
              <div 
                key={rowIndex}
                className="chart-row"
              >
                {row.map((cell, cellIndex) => (
                  <div
                    key={cellIndex}
                    className={`chart-cell ${cell.type}`}
                    title={cell.char || ''}
                  >
                    {cell.char}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <p>Enter some text to see your crochet chart!</p>
        </div>
      )}

      {chart && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <p><strong>Chart Info:</strong></p>
          <p>• Gray cells = Main color stitches</p>
          <p>• Blue cells = Contrast color stitches</p>
          <p>• Chart size: {chart[0]?.length || 0} columns × {chart.length} rows</p>
          <p>• Variable-width and variable-height characters supported</p>
          <p>• Characters aligned along baseline for proper typography</p>
          <p>• Baseline alignment: Characters of different heights line up properly</p>
        </div>
      )}
    </div>
  )
}

export default CrochetChart 