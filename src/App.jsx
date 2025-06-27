import React, { useState, useEffect } from 'react'
import CrochetChart from './components/CrochetChart'
import TextInput from './components/TextInput'
import AlphabetInfo from './components/AlphabetInfo'
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
                <button
                  key={key}
                  onClick={() => setCurrentAlphabet(alphabet)}
                  className={`alphabet-btn ${currentAlphabet.name === name ? 'active' : ''}`}
                >
                  {name}
                </button>
              ))}
            </div>
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