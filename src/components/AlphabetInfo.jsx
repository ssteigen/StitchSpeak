import React from 'react'
import { FontValidator } from '../utils/fontValidator'

function AlphabetInfo({ alphabet }) {
  if (!alphabet) {
    return null
  }

  // Analyze supported characters
  const validationResult = FontValidator.validate(alphabet)
  const supportedChars = validationResult.supportedCharacters

  const formatCharacterList = (chars) => {
    if (chars.length === 0) return 'None'
    return chars.join(' ')
  }

  const getCharacterCategoryCount = (category) => {
    return supportedChars.categories[category]?.length || 0
  }

  return (
    <div className="alphabet-info">
      <h4>Alphabet Information</h4>
      
      <div className="info-grid">
        <div className="info-section">
          <h5>Basic Info</h5>
          <p><strong>Name:</strong> {alphabet.name || 'Unnamed Alphabet'}</p>
          <p><strong>Description:</strong> {alphabet.description || 'No description available'}</p>
          <p><strong>Height:</strong> {alphabet.height || 'Unknown'} rows</p>
          <p><strong>Total Characters:</strong> {supportedChars.total}</p>
        </div>

        <div className="info-section">
          <h5>Character Support</h5>
          <p><strong>Uppercase:</strong> {getCharacterCategoryCount('uppercase')} letters</p>
          <p><strong>Lowercase:</strong> {getCharacterCategoryCount('lowercase')} letters</p>
          <p><strong>Numbers:</strong> {getCharacterCategoryCount('numbers')} digits</p>
          <p><strong>Punctuation:</strong> {getCharacterCategoryCount('punctuation')} marks</p>
          <p><strong>Symbols:</strong> {getCharacterCategoryCount('symbols')} symbols</p>
          <p><strong>Spaces:</strong> {getCharacterCategoryCount('spaces')} supported</p>
        </div>

        <div className="info-section">
          <h5>Character Details</h5>
          {supportedChars.categories.uppercase.length > 0 && (
            <p><strong>A-Z:</strong> {formatCharacterList(supportedChars.categories.uppercase)}</p>
          )}
          {supportedChars.categories.lowercase.length > 0 && (
            <p><strong>a-z:</strong> {formatCharacterList(supportedChars.categories.lowercase)}</p>
          )}
          {supportedChars.categories.numbers.length > 0 && (
            <p><strong>0-9:</strong> {formatCharacterList(supportedChars.categories.numbers)}</p>
          )}
          {supportedChars.categories.punctuation.length > 0 && (
            <p><strong>Punctuation:</strong> {formatCharacterList(supportedChars.categories.punctuation)}</p>
          )}
          {supportedChars.categories.symbols.length > 0 && (
            <p><strong>Symbols:</strong> {formatCharacterList(supportedChars.categories.symbols)}</p>
          )}
        </div>
      </div>

      <div className="validation-status">
        <h5>Validation Status</h5>
        <p className={`status ${validationResult.isValid ? 'valid' : 'invalid'}`}>
          {validationResult.isValid ? '✅ Valid' : '❌ Invalid'}
        </p>
        {validationResult.errorCount > 0 && (
          <div className="error-list">
            <p className="error-count">Errors ({validationResult.errorCount}):</p>
            <ul>
              {validationResult.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        {validationResult.warningCount > 0 && (
          <div className="warning-list">
            <p className="warning-count">Warnings ({validationResult.warningCount}):</p>
            <ul>
              {validationResult.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlphabetInfo 