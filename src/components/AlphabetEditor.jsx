import React, { useState, useEffect } from 'react'
import { ALPHABET_VALIDATION } from '../constants'
import { trimAlphabet } from '../utils/alphabetTrimmer'

function AlphabetEditor({ alphabet, onSave, onCancel }) {
  const [editedAlphabet, setEditedAlphabet] = useState(null)
  const [selectedCharacter, setSelectedCharacter] = useState('A')
  const [gridSize, setGridSize] = useState({ width: 5, height: 5 })
  const [baseline, setBaseline] = useState(0)

  useEffect(() => {
    if (alphabet) {
      setEditedAlphabet(JSON.parse(JSON.stringify(alphabet)))
      // Determine grid size from existing characters
      const maxWidth = Math.max(...Object.values(alphabet.characters).map(charData => {
        // Handle both old format (array) and new format (object with pattern and baseline)
        let pattern
        if (Array.isArray(charData)) {
          pattern = charData
        } else {
          pattern = charData.pattern || []
        }
        return Math.max(...pattern.map(row => row.length))
      }))
      setGridSize({ width: maxWidth, height: alphabet.height })
      
      // Set baseline for selected character
      const charData = alphabet.characters[selectedCharacter]
      if (charData && typeof charData === 'object' && charData.baseline !== undefined) {
        setBaseline(charData.baseline)
      } else {
        // Default baseline is the bottom row
        setBaseline(alphabet.height - 1)
      }
    }
  }, [alphabet, selectedCharacter])

  // Update baseline when character changes
  useEffect(() => {
    if (editedAlphabet && selectedCharacter) {
      const charData = editedAlphabet.characters[selectedCharacter]
      if (charData && typeof charData === 'object' && charData.baseline !== undefined) {
        setBaseline(charData.baseline)
      } else {
        // Default baseline is the bottom row
        setBaseline(gridSize.height - 1)
      }
    }
  }, [selectedCharacter, editedAlphabet, gridSize.height])

  const toggleCell = (rowIndex, colIndex) => {
    if (!editedAlphabet) return

    const newAlphabet = { ...editedAlphabet }
    let charData = newAlphabet.characters[selectedCharacter]
    
    // Handle both old format (array) and new format (object with pattern and baseline)
    if (Array.isArray(charData)) {
      // Convert to new format
      charData = {
        pattern: [...charData],
        baseline: baseline
      }
      newAlphabet.characters[selectedCharacter] = charData
    }
    
    const charPattern = [...charData.pattern]
    
    // Ensure the row exists and is long enough
    while (charPattern.length <= rowIndex) {
      charPattern.push(' '.repeat(gridSize.width))
    }
    
    const currentRow = charPattern[rowIndex] || ''
    const paddedRow = currentRow.padEnd(gridSize.width, ' ')
    const rowArray = paddedRow.split('')
    
    // Toggle the cell
    rowArray[colIndex] = rowArray[colIndex] === '█' ? ' ' : '█'
    
    charPattern[rowIndex] = rowArray.join('')
    charData.pattern = charPattern
    charData.baseline = baseline
    
    setEditedAlphabet(newAlphabet)
  }

  const setCharacterBaseline = (newBaseline) => {
    if (!editedAlphabet) return
    
    setBaseline(newBaseline)
    
    const newAlphabet = { ...editedAlphabet }
    let charData = newAlphabet.characters[selectedCharacter]
    
    // Handle both old format (array) and new format (object with pattern and baseline)
    if (Array.isArray(charData)) {
      // Convert to new format
      charData = {
        pattern: [...charData],
        baseline: newBaseline
      }
    } else {
      charData = { ...charData, baseline: newBaseline }
    }
    
    newAlphabet.characters[selectedCharacter] = charData
    setEditedAlphabet(newAlphabet)
  }

  const addCharacter = () => {
    if (!editedAlphabet) return
    
    const newChar = prompt('Enter character to add:')
    if (!newChar || newChar.length !== 1) return
    
    const newAlphabet = { ...editedAlphabet }
    const defaultBaseline = gridSize.height - 1
    newAlphabet.characters[newChar] = {
      pattern: Array(gridSize.height).fill(' '.repeat(gridSize.width)),
      baseline: defaultBaseline,
      height: gridSize.height // Allow individual character height
    }
    setEditedAlphabet(newAlphabet)
    setSelectedCharacter(newChar)
    setBaseline(defaultBaseline)
  }

  const deleteCharacter = () => {
    if (!editedAlphabet || Object.keys(editedAlphabet.characters).length <= 1) return
    
    if (confirm(`Delete character "${selectedCharacter}"?`)) {
      const newAlphabet = { ...editedAlphabet }
      delete newAlphabet.characters[selectedCharacter]
      
      // Select first available character
      const firstChar = Object.keys(newAlphabet.characters)[0]
      setSelectedCharacter(firstChar)
      setEditedAlphabet(newAlphabet)
    }
  }

  const changeGridSize = () => {
    const newWidth = parseInt(prompt('Enter new width:', gridSize.width))
    const newHeight = parseInt(prompt('Enter new height:', gridSize.height))
    
    if (newWidth > 0 && newHeight > 0) {
      setGridSize({ width: newWidth, height: newHeight })
      
      // Update all characters to new size
      const newAlphabet = { ...editedAlphabet }
      newAlphabet.height = newHeight
      
      Object.keys(newAlphabet.characters).forEach(char => {
        let charData = newAlphabet.characters[char]
        
        // Handle both old format (array) and new format (object with pattern and baseline)
        if (Array.isArray(charData)) {
          // Convert to new format
          const pattern = charData
          const newPattern = []
          
          for (let i = 0; i < newHeight; i++) {
            if (i < pattern.length) {
              newPattern.push(pattern[i].padEnd(newWidth, ' ').substring(0, newWidth))
            } else {
              newPattern.push(' '.repeat(newWidth))
            }
          }
          
          newAlphabet.characters[char] = {
            pattern: newPattern,
            baseline: Math.min(charData.baseline || newHeight - 1, newHeight - 1)
          }
        } else {
          // Already in new format
          const pattern = charData.pattern
          const newPattern = []
          
          for (let i = 0; i < newHeight; i++) {
            if (i < pattern.length) {
              newPattern.push(pattern[i].padEnd(newWidth, ' ').substring(0, newWidth))
            } else {
              newPattern.push(' '.repeat(newWidth))
            }
          }
          
          charData.pattern = newPattern
          charData.baseline = Math.min(charData.baseline || newHeight - 1, newHeight - 1)
        }
      })
      
      setEditedAlphabet(newAlphabet)
    }
  }

  const changeCharacterHeight = () => {
    if (!editedAlphabet || !selectedCharacter) return
    
    const currentCharData = editedAlphabet.characters[selectedCharacter]
    let currentHeight = gridSize.height
    
    // Get current character height
    if (currentCharData && typeof currentCharData === 'object' && currentCharData.height) {
      currentHeight = currentCharData.height
    } else if (Array.isArray(currentCharData)) {
      currentHeight = currentCharData.length
    }
    
    const newHeight = parseInt(prompt('Enter new character height:', currentHeight))
    
    if (newHeight > 0 && newHeight <= 20) {
      const newAlphabet = { ...editedAlphabet }
      let charData = newAlphabet.characters[selectedCharacter]
      
      // Handle both old format (array) and new format (object with pattern and baseline)
      if (Array.isArray(charData)) {
        // Convert to new format
        const pattern = charData
        const newPattern = []
        
        for (let i = 0; i < newHeight; i++) {
          if (i < pattern.length) {
            newPattern.push(pattern[i].padEnd(gridSize.width, ' ').substring(0, gridSize.width))
          } else {
            newPattern.push(' '.repeat(gridSize.width))
          }
        }
        
        charData = {
          pattern: newPattern,
          baseline: Math.min(charData.baseline || newHeight - 1, newHeight - 1),
          height: newHeight
        }
      } else {
        // Already in new format
        const pattern = charData.pattern
        const newPattern = []
        
        for (let i = 0; i < newHeight; i++) {
          if (i < pattern.length) {
            newPattern.push(pattern[i].padEnd(gridSize.width, ' ').substring(0, gridSize.width))
          } else {
            newPattern.push(' '.repeat(gridSize.width))
          }
        }
        
        charData = {
          ...charData,
          pattern: newPattern,
          baseline: Math.min(charData.baseline || newHeight - 1, newHeight - 1),
          height: newHeight
        }
      }
      
      newAlphabet.characters[selectedCharacter] = charData
      setEditedAlphabet(newAlphabet)
      
      // Update grid size if this character is taller than current grid
      if (newHeight > gridSize.height) {
        setGridSize({ width: gridSize.width, height: newHeight })
      }
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave(editedAlphabet)
    }
  }

  const exportAlphabet = () => {
    if (!editedAlphabet) return
    
    // Create a clean filename from the alphabet name
    const filename = `${editedAlphabet.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`
    
    // Trim empty rows and columns from the alphabet
    const trimmedAlphabet = trimAlphabet(editedAlphabet)
    
    // Convert to JSON string with proper formatting and metadata at top
    // Also convert character data to new format if needed
    const formattedCharacters = {}
    Object.keys(trimmedAlphabet.characters).forEach(char => {
      const charData = trimmedAlphabet.characters[char]
      if (Array.isArray(charData)) {
        // Convert old format to new format
        formattedCharacters[char] = {
          pattern: charData,
          baseline: trimmedAlphabet.height - 1
        }
      } else {
        // Already in new format
        formattedCharacters[char] = charData
      }
    })
    
    const formattedAlphabet = {
      name: trimmedAlphabet.name,
      description: trimmedAlphabet.description,
      height: trimmedAlphabet.height,
      characters: formattedCharacters
    }
    const jsonContent = JSON.stringify(formattedAlphabet, null, 2)
    
    // Create and download the file
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const saveToFile = async () => {
    if (!editedAlphabet) return
    
    try {
      // Check if File System Access API is supported
      if (!('showSaveFilePicker' in window)) {
        // Fallback: Export with clear instructions for manual replacement
        const filename = `${editedAlphabet.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`
        
        // Trim empty rows and columns from the alphabet
        const trimmedAlphabet = trimAlphabet(editedAlphabet)
        
        // Convert character data to new format if needed
        const formattedCharacters = {}
        Object.keys(trimmedAlphabet.characters).forEach(char => {
          const charData = trimmedAlphabet.characters[char]
          if (Array.isArray(charData)) {
            formattedCharacters[char] = {
              pattern: charData,
              baseline: trimmedAlphabet.height - 1
            }
          } else {
            formattedCharacters[char] = charData
          }
        })
        
        const formattedAlphabet = {
          name: trimmedAlphabet.name,
          description: trimmedAlphabet.description,
          height: trimmedAlphabet.height,
          characters: formattedCharacters
        }
        const jsonContent = JSON.stringify(formattedAlphabet, null, 2)
        
        const blob = new Blob([jsonContent], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        // Show instructions for manual replacement
        const instructions = `
File System Access API not supported in this browser.

To save your alphabet:
1. The file "${filename}" has been downloaded
2. Navigate to your project's alphabets/ folder
3. Replace the existing file with the downloaded one
4. Refresh this page to load your changes

Alternatively, you can copy this JSON content and manually save it:

${jsonContent}
        `
        
        alert(instructions)
        return
      }
      
      // Trim empty rows and columns from the alphabet
      const trimmedAlphabet = trimAlphabet(editedAlphabet)
      
      // Convert to JSON string with proper formatting
      // Convert character data to new format if needed
      const formattedCharacters = {}
      Object.keys(trimmedAlphabet.characters).forEach(char => {
        const charData = trimmedAlphabet.characters[char]
        if (Array.isArray(charData)) {
          formattedCharacters[char] = {
            pattern: charData,
            baseline: trimmedAlphabet.height - 1
          }
        } else {
          formattedCharacters[char] = charData
        }
      })
      
      const formattedAlphabet = {
        name: trimmedAlphabet.name,
        description: trimmedAlphabet.description,
        height: trimmedAlphabet.height,
        characters: formattedCharacters
      }
      const jsonContent = JSON.stringify(formattedAlphabet, null, 2)
      
      // Create a file handle
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: `${trimmedAlphabet.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`,
        types: [{
          description: 'JSON Files',
          accept: {
            'application/json': ['.json'],
          },
        }],
      })
      
      // Create a writable stream
      const writable = await fileHandle.createWritable()
      
      // Write the content
      await writable.write(jsonContent)
      
      // Close the stream
      await writable.close()
      
      alert('Alphabet saved successfully! Refresh the page to load your updated alphabet.')
    } catch (error) {
      console.error('Error saving file:', error)
      if (error.name === 'AbortError') {
        // User cancelled the save dialog
        return
      }
      alert('Error saving file. Please try the export or copy options instead.')
    }
  }

  const copyToClipboard = async () => {
    if (!editedAlphabet) return
    
    try {
      // Trim empty rows and columns from the alphabet
      const trimmedAlphabet = trimAlphabet(editedAlphabet)
      
      // Format with metadata at top
      // Convert character data to new format if needed
      const formattedCharacters = {}
      Object.keys(trimmedAlphabet.characters).forEach(char => {
        const charData = trimmedAlphabet.characters[char]
        if (Array.isArray(charData)) {
          formattedCharacters[char] = {
            pattern: charData,
            baseline: trimmedAlphabet.height - 1
          }
        } else {
          formattedCharacters[char] = charData
        }
      })
      
      const formattedAlphabet = {
        name: trimmedAlphabet.name,
        description: trimmedAlphabet.description,
        height: trimmedAlphabet.height,
        characters: formattedCharacters
      }
      const jsonContent = JSON.stringify(formattedAlphabet, null, 2)
      await navigator.clipboard.writeText(jsonContent)
      alert('Alphabet JSON copied to clipboard! You can now paste it into your file editor.')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      // Fallback: show the JSON in an alert
      const trimmedAlphabet = trimAlphabet(editedAlphabet)
      const formattedCharacters = {}
      Object.keys(trimmedAlphabet.characters).forEach(char => {
        const charData = trimmedAlphabet.characters[char]
        if (Array.isArray(charData)) {
          formattedCharacters[char] = {
            pattern: charData,
            baseline: trimmedAlphabet.height - 1
          }
        } else {
          formattedCharacters[char] = charData
        }
      })
      
      const formattedAlphabet = {
        name: trimmedAlphabet.name,
        description: trimmedAlphabet.description,
        height: trimmedAlphabet.height,
        characters: formattedCharacters
      }
      const jsonContent = JSON.stringify(formattedAlphabet, null, 2)
      alert(`Copy this JSON content and save it to your file:\n\n${jsonContent}`)
    }
  }

  const renderCharacterGrid = () => {
    if (!editedAlphabet || !selectedCharacter) return null

    let charData = editedAlphabet.characters[selectedCharacter]
    let pattern = []
    
    // Handle both old format (array) and new format (object with pattern and baseline)
    if (Array.isArray(charData)) {
      pattern = charData
    } else {
      pattern = charData.pattern || []
    }
    
    return (
      <div className="character-editor-grid">
        <div className="grid-header">
          <h3>Editing: "{selectedCharacter}"</h3>
          <div className="grid-controls">
            <button onClick={addCharacter} className="btn-secondary">Add Character</button>
            <button onClick={deleteCharacter} className="btn-secondary">Delete Character</button>
            <button onClick={changeGridSize} className="btn-secondary">Change Grid Size</button>
            <button onClick={changeCharacterHeight} className="btn-secondary">Change Character Height</button>
          </div>
        </div>
        
        <div className="baseline-controls">
          <label htmlFor="baseline-slider">Baseline Row: {baseline + 1}</label>
          <input
            id="baseline-slider"
            type="range"
            min="0"
            max={gridSize.height - 1}
            value={baseline}
            onChange={(e) => setCharacterBaseline(parseInt(e.target.value))}
            className="baseline-slider"
          />
          <div className="baseline-info">
            <p>Baseline determines where the bottom of the character sits. Row {baseline + 1} is highlighted below.</p>
          </div>
        </div>
        
        <div 
          className="character-grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize.width}, 30px)`,
            gridTemplateRows: `repeat(${gridSize.height}, 30px)`
          }}
        >
          {Array.from({ length: gridSize.height }, (_, rowIndex) =>
            Array.from({ length: gridSize.width }, (_, colIndex) => {
              const row = pattern[rowIndex] || ''
              const cell = row[colIndex] || ' '
              const isFilled = ALPHABET_VALIDATION.VALID_STITCH_CHARS.includes(cell)
              const isBaseline = rowIndex === baseline
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`grid-cell ${isFilled ? 'filled' : 'empty'} ${isBaseline ? 'baseline' : ''}`}
                  onClick={() => toggleCell(rowIndex, colIndex)}
                  title={`Row ${rowIndex + 1}, Column ${colIndex + 1}${isBaseline ? ' (Baseline)' : ''}`}
                />
              )
            })
          )}
        </div>
        
        <div className="grid-info">
          <p>Grid size: {gridSize.width} × {gridSize.height}</p>
          <p>Click cells to toggle between filled and empty</p>
          <p>Baseline row (highlighted) shows where the character bottom sits</p>
          <p>Variable height support: Each character can have its own height</p>
        </div>
      </div>
    )
  }

  const renderCharacterSelector = () => {
    if (!editedAlphabet) return null

    const characters = Object.keys(editedAlphabet.characters).sort()
    
    return (
      <div className="character-selector">
        <h3>Characters</h3>
        <div className="character-buttons">
          {characters.map(char => (
            <button
              key={char}
              onClick={() => setSelectedCharacter(char)}
              className={`char-btn ${selectedCharacter === char ? 'active' : ''}`}
            >
              {char}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderPreview = () => {
    if (!editedAlphabet || !selectedCharacter) return null

    let charData = editedAlphabet.characters[selectedCharacter]
    let pattern = []
    
    // Handle both old format (array) and new format (object with pattern and baseline)
    if (Array.isArray(charData)) {
      pattern = charData
    } else {
      pattern = charData.pattern || []
    }
    
    return (
      <div className="character-preview">
        <h3>Preview: "{selectedCharacter}"</h3>
        <div className="preview-grid">
          {pattern.map((row, rowIndex) => (
            <div key={rowIndex} className="preview-row">
              {row.split('').map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`preview-cell ${ALPHABET_VALIDATION.VALID_STITCH_CHARS.includes(cell) ? 'filled' : 'empty'}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="preview-info">
          <p><strong>Baseline:</strong> Row {baseline + 1}</p>
          <p><strong>Character height:</strong> {pattern.length} rows</p>
          <p><strong>Extends above baseline:</strong> {baseline} rows</p>
          <p><strong>Extends below baseline:</strong> {Math.max(0, pattern.length - baseline - 1)} rows</p>
        </div>
      </div>
    )
  }

  if (!editedAlphabet) {
    return <div className="loading">Loading editor...</div>
  }

  return (
    <div className="alphabet-editor">
      <div className="editor-header">
        <h2>Alphabet Editor</h2>
        <div className="editor-controls">
          <button onClick={handleSave} className="btn-primary">Save Alphabet</button>
          <button onClick={saveToFile} className="btn-primary">Save to File</button>
          <button onClick={exportAlphabet} className="btn-secondary">Export Alphabet</button>
          <button onClick={copyToClipboard} className="btn-secondary">Copy JSON</button>
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
        </div>
      </div>

      <div className="editor-content">
        <div className="editor-left">
          {renderCharacterSelector()}
          {renderCharacterGrid()}
        </div>
        
        <div className="editor-right">
          {renderPreview()}
          
          <div className="alphabet-info">
            <h3>Alphabet Info</h3>
            <p><strong>Name:</strong> {editedAlphabet.name}</p>
            <p><strong>Description:</strong> {editedAlphabet.description}</p>
            <p><strong>Height:</strong> {editedAlphabet.height}</p>
            <p><strong>Characters:</strong> {Object.keys(editedAlphabet.characters).length}</p>
          </div>
          
          <div className="save-instructions">
            <h3>How to Save Your Alphabet</h3>
            <div className="instructions-content">
              <p><strong>Option 1: Save to File (Chrome/Edge)</strong></p>
              <ol>
                <li>Click "Save to File" to open a file save dialog</li>
                <li>Navigate to your <code>alphabets/</code> folder</li>
                <li>Choose the original file to overwrite or create a new one</li>
                <li>Click "Save" to overwrite the file</li>
                <li>Refresh the page to load your updated alphabet</li>
              </ol>
              
              <p><strong>Option 2: Copy JSON (All Browsers)</strong></p>
              <ol>
                <li>Click "Copy JSON" to copy the alphabet to your clipboard</li>
                <li>Open your file editor (VS Code, etc.)</li>
                <li>Open the alphabet file in <code>alphabets/</code> folder</li>
                <li>Paste the new content and save</li>
                <li>Refresh the page to load your updated alphabet</li>
              </ol>
              
              <p><strong>Option 3: Export Alphabet</strong></p>
              <ul>
                <li>Click "Export Alphabet" to download the JSON file</li>
                <li>Manually replace the file in your <code>alphabets/</code> folder</li>
                <li>Refresh the page to load your new alphabet</li>
              </ul>
              
              <p><strong>Option 4: Temporary Save</strong></p>
              <ul>
                <li>Click "Save Alphabet" to keep changes for this session</li>
                <li>Changes will be lost when you refresh the page</li>
              </ul>
              
              <p><strong>Note:</strong> The app automatically loads all JSON files from the <code>alphabets/</code> directory.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlphabetEditor 