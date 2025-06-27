// App Constants and Defaults

// Default text for the input field
export const DEFAULT_INPUT_TEXT = 'Hello World!'

// Chart display settings
export const CHART_SETTINGS = {
  CELL_SIZE: 20,
  CELL_GAP: 2,
  MIN_CELL_SIZE: 10,
  MAX_CELL_SIZE: 50
}

// Alphabet validation rules
export const ALPHABET_VALIDATION = {
  MIN_HEIGHT: 1,
  MAX_HEIGHT: 20,
  VALID_STITCH_CHARS: ['1', 'x', '█'],
  VALID_EMPTY_CHARS: [' ', '']
}

// UI Configuration
export const UI_CONFIG = {
  LOADING_MESSAGE: 'Loading alphabets...',
  ERROR_MESSAGE: 'No valid alphabets found. Please check the alphabets directory.',
  ALPHABET_SELECTOR_LABEL: 'Quick Alphabet Switch',
  CHART_PREVIEW_TITLE: 'Chart Preview',
  TEXT_INPUT_LABEL: 'Sample Text'
}

// Chart colors
export const CHART_COLORS = {
  MAIN_STITCH: '#667eea',      // Blue for main color stitches
  CONTRAST_STITCH: '#ff6b6b',  // Red for contrast color stitches
  EMPTY_CELL: '#f0f0f0',       // Gray for empty cells
  CELL_BORDER: '#ddd',         // Light gray for cell borders
  GRID_BACKGROUND: '#ffffff'   // White for grid background
}

// App metadata
export const APP_METADATA = {
  NAME: 'StitchSpeak',
  DESCRIPTION: 'Create beautiful needlework charts from your text',
  VERSION: '1.0.0'
}

// Development settings
export const DEV_CONFIG = {
  DEBUG_ALPHABET_LOADING: true,  // Enable console logging for alphabet loading
  SHOW_LOADING_STATES: true      // Show loading states in development
} 