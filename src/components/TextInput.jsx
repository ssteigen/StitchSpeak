import React from 'react'

function TextInput({ value, onChange }) {
  return (
    <div className="input-group">
      <label htmlFor="text-input">Sample Text</label>
      <textarea
        id="text-input"
        className="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your text here to see the crochet chart preview..."
      />
    </div>
  )
}

export default TextInput 