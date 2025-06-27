// Dynamic alphabet loader
// Loads all valid JSON alphabet files from the alphabets directory

import { DEV_CONFIG } from '../constants.js'

// Import all alphabet files using Vite's glob import
// Note: Vite requires literal strings for import.meta.glob, not variables
const alphabetModules = import.meta.glob('../../alphabets/*.json', { eager: true })

export function loadAllAlphabets() {
  const alphabets = []
  
  if (DEV_CONFIG.DEBUG_ALPHABET_LOADING) {
    console.log('Available alphabet modules:', Object.keys(alphabetModules))
  }
  
  for (const path in alphabetModules) {
    try {
      const alphabet = alphabetModules[path]
      
      if (DEV_CONFIG.DEBUG_ALPHABET_LOADING) {
        console.log(`Loading alphabet from ${path}:`, alphabet)
      }
      
      // Validate that it's a proper alphabet object
      if (alphabet && typeof alphabet === 'object' && alphabet.name && alphabet.characters) {
        // Extract key from filename (remove path and .json extension)
        const key = path.split('/').pop().replace('.json', '')
        
        alphabets.push({
          key,
          name: alphabet.name,
          alphabet: alphabet
        })
        
        if (DEV_CONFIG.DEBUG_ALPHABET_LOADING) {
          console.log(`Successfully loaded alphabet: ${alphabet.name}`)
        }
      } else {
        console.warn(`Invalid alphabet structure in ${path}:`, alphabet)
      }
    } catch (error) {
      console.warn(`Failed to load alphabet from ${path}:`, error)
    }
  }
  
  if (DEV_CONFIG.DEBUG_ALPHABET_LOADING) {
    console.log('Total alphabets loaded:', alphabets.length)
  }
  
  // Sort alphabets by name for consistent ordering
  alphabets.sort((a, b) => a.name.localeCompare(b.name))
  
  return alphabets
}

export function getDefaultAlphabet(alphabets) {
  // Try to find an alphabet named "default" or "Basic" first
  const defaultAlphabet = alphabets.find(a => 
    a.key === 'default' || 
    a.name.toLowerCase().includes('basic') ||
    a.name.toLowerCase().includes('default')
  )
  
  // If no default found, use the first alphabet
  return defaultAlphabet ? defaultAlphabet.alphabet : (alphabets[0]?.alphabet || null)
} 