import React, { useState, useEffect } from 'react'
import CrochetChart from './components/CrochetChart'
import TextInput from './components/TextInput'
import AlphabetInfo from './components/AlphabetInfo'
import AlphabetEditor from './components/AlphabetEditor'
import AlphabetButton from './components/AlphabetButton'
import { loadAllAlphabets, getDefaultAlphabet } from './utils/alphabetLoader'
import { 
  DEFAULT_INPUT_TEXT, 
  UI_CONFIG, 
  APP_METADATA 
} from './constants'

function App() {
  const [inputText, setInputText] = useState(DEFAULT_INPUT_TEXT)
  const [allAlphabets, setAllAlphabets] = useState([])
  const [currentAlphabet, setCurrentAlphabet] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Load all alphabets on component mount
    const alphabets = loadAllAlphabets()
    setAllAlphabets(alphabets)
    
    // Set default alphabet
    const defaultAlphabet = getDefaultAlphabet(alphabets)
    setCurrentAlphabet(defaultAlphabet)
    setIsLoading(false)
  }, [])

  const handleTextChange = (text) => {
    setInputText(text)
  }

  const handleEditAlphabet = () => {
    setIsEditing(true)
  }

  const handleSaveAlphabet = (editedAlphabet) => {
    // Update the current alphabet
    setCurrentAlphabet(editedAlphabet)
    
    // Update the alphabet in the allAlphabets array
    setAllAlphabets(prevAlphabets => 
      prevAlphabets.map(({ key, name, alphabet }) => 
        alphabet.name === editedAlphabet.name 
          ? { key, name, alphabet: editedAlphabet }
          : { key, name, alphabet }
      )
    )
    
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">{UI_CONFIG.LOADING_MESSAGE}</div>
      </div>
    )
  }

  if (!currentAlphabet) {
    return (
      <div className="container">
        <div className="error">{UI_CONFIG.ERROR_MESSAGE}</div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="container">
        <AlphabetEditor 
          alphabet={currentAlphabet}
          onSave={handleSaveAlphabet}
          onCancel={handleCancelEdit}
        />
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🧶 {APP_METADATA.NAME}</h1>
        <p className="subtitle">{APP_METADATA.DESCRIPTION}</p>
      </header>

      <main className="main-content">
        <section className="input-section">
          <div className="alphabet-selector">
            <label>{UI_CONFIG.ALPHABET_SELECTOR_LABEL}</label>
            <div className="alphabet-buttons">
              {allAlphabets.map(({ key, name, alphabet }) => (
                <AlphabetButton
                  key={key}
                  alphabet={alphabet}
                  isActive={currentAlphabet.name === name}
                  onClick={() => setCurrentAlphabet(alphabet)}
                />
              ))}
            </div>
            <button 
              onClick={handleEditAlphabet}
              className="edit-alphabet-btn"
            >
              ✏️ Edit Alphabet
            </button>
          </div>
        </section>

        <section className="preview-section">
          <div className="preview-header">
            <h3>{UI_CONFIG.CHART_PREVIEW_TITLE}</h3>
          </div>
          <TextInput 
            value={inputText}
            onChange={handleTextChange}
          />
          <CrochetChart 
            text={inputText}
            alphabet={currentAlphabet}
          />
          <AlphabetInfo 
            alphabet={currentAlphabet}
          />
        </section>
      </main>
    </div>
  )
}

export default App 