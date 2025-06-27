import React from 'react'
import { CHART_SETTINGS, CHART_COLORS, ALPHABET_VALIDATION } from '../constants'

function CrochetChart({ text, alphabet }) {
  const generateChart = () => {
    if (!text.trim() || !alphabet.characters) {
      return null
    }

    // Use the text as-is (preserve case)
    const characters = text.split('')
    const maxHeight = alphabet.height || 5
    const chart = []
    const spacing = 1

    // Generate the chart grid
    for (let row = 0; row < maxHeight; row++) {
      const chartRow = []
      for (let char of characters) {
        if (char === ' ') {
          // Add empty space
          for (let i = 0; i < 3; i++) {
            chartRow.push({ type: 'empty', char: '' })
          }
        } else {
          // Try exact case, then fallback to other case
          let charPattern = alphabet.characters[char]
          if (!charPattern) {
            const altChar = char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()
            charPattern = alphabet.characters[altChar]
          }
          if (charPattern && charPattern[row]) {
            const pattern = charPattern[row]
            // Pad this row to match the character's maximum width
            const maxCharWidth = Math.max(...charPattern.map(r => r.length))
            const paddedPattern = pattern.padEnd(maxCharWidth, ' ')
            for (let col = 0; col < paddedPattern.length; col++) {
              chartRow.push({
                type: (ALPHABET_VALIDATION.VALID_STITCH_CHARS.includes(paddedPattern[col])) ? 'filled' : 'empty',
                char: col === 0 ? char : ''
              })
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
    // eslint-disable-next-line
    console.log('[CrochetChart Debug]', {
      text,
      font: alphabet.name,
      rowLengths,
      gridTemplateColumns: gridCols
    })
    
    // Print chart as string representation
    const chartString = chart.map(row => 
      row.map(cell => cell.type === 'filled' ? '█' : ' ').join('')
    ).join('\n')
    // eslint-disable-next-line
    console.log('[CrochetChart String Output]:\n' + chartString)
    
    // Detailed character breakdown
    const characters = text.toUpperCase().split('')
    const detailedBreakdown = characters.map(char => {
      if (char === ' ') return { char: 'SPACE', width: 3 }
      const pattern = alphabet.characters[char]
      if (!pattern) return { char, width: 5, error: 'missing' }
      const widths = pattern.map(row => row.length)
      return { char, width: Math.max(...widths), widths }
    })
    // eslint-disable-next-line
    console.log('[Character Breakdown]:', detailedBreakdown)
    
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
      <div className="chart-preview">
        {chart ? (
          <div 
            className="chart-grid"
            style={{
              gridTemplateColumns: `repeat(${chart[0]?.length || 0}, ${cellSize}px)`,
              gap: `${CHART_SETTINGS.CELL_GAP}px`,
              maxWidth: '100%',
              overflow: 'auto'
            }}
          >
            {chart.flat().map((cell, index) => (
              <div
                key={index}
                className={`chart-cell ${cell.type}`}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  fontSize: `${Math.max(8, cellSize * 0.3)}px`
                }}
                title={cell.char || ''}
              >
                {cell.char}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <p>Enter some text to see your crochet chart!</p>
          </div>
        )}
      </div>

      {chart && (
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <p><strong>Chart Info:</strong></p>
          <p>• Gray cells = Main color stitches</p>
          <p>• Blue cells = Contrast color stitches</p>
          <p>• Chart size: {chart[0]?.length || 0} columns × {chart.length} rows</p>
        </div>
      )}
    </div>
  )
}

export default CrochetChart 