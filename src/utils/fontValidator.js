// Font Validator Utility
// Validates alphabet files for proper structure and format

export class FontValidator {
  constructor() {
    this.errors = []
    this.warnings = []
  }

  // Main validation method
  validate(alphabet) {
    this.errors = []
    this.warnings = []
    this.alphabet = alphabet // Store reference for character analysis

    // Check if alphabet is an object
    if (!alphabet || typeof alphabet !== 'object') {
      this.errors.push('Alphabet must be a valid JSON object')
      return this.getResult()
    }

    // Validate required top-level properties
    this.validateRequiredProperties(alphabet)
    
    // Validate character patterns
    this.validateCharacters(alphabet)

    // Validate character consistency
    this.validateConsistency(alphabet)

    return this.getResult()
  }

  // Validate required properties
  validateRequiredProperties(alphabet) {
    const required = ['name', 'description', 'height', 'characters']
    
    for (const prop of required) {
      if (!(prop in alphabet)) {
        this.errors.push(`Missing required property: ${prop}`)
      }
    }

    // Validate name
    if (alphabet.name !== undefined) {
      if (typeof alphabet.name !== 'string' || alphabet.name.trim() === '') {
        this.errors.push('Name must be a non-empty string')
      }
    }

    // Validate description
    if (alphabet.description !== undefined) {
      if (typeof alphabet.description !== 'string') {
        this.errors.push('Description must be a string')
      }
    }

    // Validate height
    if (alphabet.height !== undefined) {
      if (!Number.isInteger(alphabet.height) || alphabet.height < 1 || alphabet.height > 20) {
        this.errors.push('Height must be an integer between 1 and 20')
      }
    }
  }

  // Validate characters object
  validateCharacters(alphabet) {
    if (!alphabet.characters || typeof alphabet.characters !== 'object') {
      this.errors.push('Characters must be an object')
      return
    }

    const characters = alphabet.characters
    const height = alphabet.height

    // Check if characters object is empty
    if (Object.keys(characters).length === 0) {
      this.errors.push('Characters object cannot be empty')
      return
    }

    // Validate each character
    for (const [char, pattern] of Object.entries(characters)) {
      this.validateCharacter(char, pattern, height)
    }
  }

  // Validate individual character
  validateCharacter(char, pattern, expectedHeight) {
    // Check character key
    if (char.length !== 1) {
      this.errors.push(`Character key must be a single character: "${char}"`)
      return
    }

    // Check if pattern is an array
    if (!Array.isArray(pattern)) {
      this.errors.push(`Character "${char}" pattern must be an array`)
      return
    }

    // Check pattern length matches height
    if (pattern.length !== expectedHeight) {
      this.errors.push(`Character "${char}" has ${pattern.length} rows, expected ${expectedHeight}`)
      return
    }

    // Check for consistent row widths
    const rowWidths = pattern.map(row => typeof row === 'string' ? row.length : -1)
    const uniqueWidths = Array.from(new Set(rowWidths))
    if (uniqueWidths.length > 1) {
      this.errors.push(`Character "${char}" has inconsistent row widths: [${rowWidths.join(', ')}]`)
    }

    // Validate each row
    let maxWidth = 0
    for (let i = 0; i < pattern.length; i++) {
      const row = pattern[i]
      
      if (typeof row !== 'string') {
        this.errors.push(`Character "${char}" row ${i + 1} must be a string`)
        continue
      }

      // Check for invalid characters
      const invalidChars = this.findInvalidCharacters(row)
      if (invalidChars.length > 0) {
        this.errors.push(`Character "${char}" row ${i + 1} contains invalid characters: ${invalidChars.join(', ')}`)
      }

      // Track max width
      maxWidth = Math.max(maxWidth, row.length)
    }

    // Check for empty pattern
    if (maxWidth === 0) {
      this.warnings.push(`Character "${char}" has no visible content`)
    }
  }

  // Validate consistency across all characters
  validateConsistency(alphabet) {
    const characters = alphabet.characters
    const height = alphabet.height

    if (!characters || !height) return

    // Check for common width issues
    this.validateWidthConsistency(characters)
  }

  // Validate width consistency
  validateWidthConsistency(characters) {
    const widths = []
    
    for (const [char, pattern] of Object.entries(characters)) {
      const maxWidth = Math.max(...pattern.map(row => row.length))
      widths.push({ char, width: maxWidth })
    }

    // Check for significant width variations
    const avgWidth = widths.reduce((sum, w) => sum + w.width, 0) / widths.length
    const significantVariation = widths.filter(w => Math.abs(w.width - avgWidth) > 2)

    if (significantVariation.length > 0) {
      this.warnings.push('Some characters have significantly different widths, which may affect layout')
    }
  }

  // Find invalid characters in a row
  findInvalidCharacters(row) {
    const validChars = ['█', '1', 'x', ' ']
    const invalid = []
    
    for (const char of row) {
      if (!validChars.includes(char)) {
        invalid.push(`"${char}"`)
      }
    }
    
    return [...new Set(invalid)] // Remove duplicates
  }

  // Get validation result
  getResult() {
    const supportedCharacters = this.analyzeSupportedCharacters()
    
    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
      warnings: [...this.warnings],
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      supportedCharacters
    }
  }

  // Analyze supported characters in the alphabet
  analyzeSupportedCharacters() {
    if (!this.alphabet || !this.alphabet.characters) {
      return {
        total: 0,
        categories: {},
        characters: []
      }
    }

    const characters = Object.keys(this.alphabet.characters)
    const categories = {
      uppercase: [],
      lowercase: [],
      numbers: [],
      punctuation: [],
      symbols: [],
      spaces: []
    }

    for (const char of characters) {
      if (char === ' ') {
        categories.spaces.push(char)
      } else if (/[A-Z]/.test(char)) {
        categories.uppercase.push(char)
      } else if (/[a-z]/.test(char)) {
        categories.lowercase.push(char)
      } else if (/[0-9]/.test(char)) {
        categories.numbers.push(char)
      } else if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(char)) {
        categories.punctuation.push(char)
      } else {
        categories.symbols.push(char)
      }
    }

    return {
      total: characters.length,
      categories,
      characters: characters.sort()
    }
  }

  // Static method for quick validation
  static validate(alphabet) {
    const validator = new FontValidator()
    return validator.validate(alphabet)
  }

  // Validate file before upload
  static validateFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const content = e.target.result
          const alphabet = JSON.parse(content)
          const result = FontValidator.validate(alphabet)
          resolve(result)
        } catch (error) {
          resolve({
            isValid: false,
            errors: [`Invalid JSON: ${error.message}`],
            warnings: [],
            errorCount: 1,
            warningCount: 0
          })
        }
      }
      
      reader.onerror = () => {
        resolve({
          isValid: false,
          errors: ['Failed to read file'],
          warnings: [],
          errorCount: 1,
          warningCount: 0
        })
      }
      
      reader.readAsText(file)
    })
  }

  // Validate all built-in fonts
  static validateAllFonts(fonts) {
    const results = {}
    const summary = {
      total: 0,
      valid: 0,
      invalid: 0,
      totalErrors: 0,
      totalWarnings: 0
    }

    for (const [fontKey, font] of Object.entries(fonts)) {
      const result = FontValidator.validate(font)
      results[fontKey] = {
        ...result,
        fontName: font.name,
        fontDescription: font.description,
        supportedCharacters: result.supportedCharacters
      }

      summary.total++
      if (result.isValid) {
        summary.valid++
      } else {
        summary.invalid++
      }
      summary.totalErrors += result.errorCount
      summary.totalWarnings += result.warningCount
    }

    return {
      results,
      summary,
      allValid: summary.invalid === 0
    }
  }

  // Generate validation report
  static generateReport(validationResults) {
    const { results, summary } = validationResults
    let report = `# Font Validation Report\n\n`
    
    report += `## Summary\n`
    report += `- Total Fonts: ${summary.total}\n`
    report += `- Valid: ${summary.valid}\n`
    report += `- Invalid: ${summary.invalid}\n`
    report += `- Total Errors: ${summary.totalErrors}\n`
    report += `- Total Warnings: ${summary.totalWarnings}\n\n`

    if (summary.invalid === 0) {
      report += `✅ All fonts are valid!\n\n`
    } else {
      report += `❌ Found ${summary.invalid} invalid font(s)\n\n`
    }

    report += `## Detailed Results\n\n`

    for (const [fontKey, result] of Object.entries(results)) {
      report += `### ${result.fontName} (${fontKey})\n`
      report += `**Description:** ${result.fontDescription}\n`
      report += `**Status:** ${result.isValid ? '✅ Valid' : '❌ Invalid'}\n`
      
      // Add character support information
      if (result.supportedCharacters) {
        const chars = result.supportedCharacters
        report += `**Supported Characters:** ${chars.total} total\n`
        
        if (chars.categories.uppercase.length > 0) {
          report += `- Uppercase: ${chars.categories.uppercase.join('')}\n`
        }
        if (chars.categories.lowercase.length > 0) {
          report += `- Lowercase: ${chars.categories.lowercase.join('')}\n`
        }
        if (chars.categories.numbers.length > 0) {
          report += `- Numbers: ${chars.categories.numbers.join('')}\n`
        }
        if (chars.categories.punctuation.length > 0) {
          report += `- Punctuation: ${chars.categories.punctuation.join('')}\n`
        }
        if (chars.categories.symbols.length > 0) {
          report += `- Symbols: ${chars.categories.symbols.join('')}\n`
        }
        if (chars.categories.spaces.length > 0) {
          report += `- Spaces: ${chars.categories.spaces.length} supported\n`
        }
      }
      
      if (result.errorCount > 0) {
        report += `**Errors (${result.errorCount}):**\n`
        result.errors.forEach(error => {
          report += `- ${error}\n`
        })
      }
      
      if (result.warningCount > 0) {
        report += `**Warnings (${result.warningCount}):**\n`
        result.warnings.forEach(warning => {
          report += `- ${warning}\n`
        })
      }
      
      report += `\n`
    }

    return report
  }
}

// Export validation rules for reference
export const VALIDATION_RULES = {
  requiredProperties: ['name', 'description', 'height', 'characters'],
  validCharacters: ['█', '1', 'x', ' '],
  heightRange: { min: 1, max: 20 },
  maxCharacters: 100
} 