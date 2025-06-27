# 🧶 StitchSpeak

StitchSpeak is a modern web application for creating and previewing text needlework charts. Input your text and see how it would look as a needlework pattern!

## Features

- **Text Input**: Enter any text to see a live preview of the needlework chart
- **Dynamic Alphabets**: Automatically loads all valid alphabet files from the alphabets directory
- **Real-time Preview**: See your chart update as you type
- **Responsive Design**: Works on desktop and mobile devices
- **Font Validation Script**: Command-line tool for batch validation of alphabet files
- **Configurable Settings**: Centralized constants for easy customization

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and go to `http://localhost:3000` (or the port shown in the terminal)

## Usage

### Basic Usage

1. **Enter Text**: Type or paste your text in the "Sample Text" area
2. **Choose Font**: Select from available alphabets using the alphabet buttons
3. **View Preview**: See the needlework chart preview update in real-time

### Adding New Alphabets

To add a new alphabet:

1. Create a new JSON file in the `alphabets/` directory
2. Follow the alphabet format structure (see below)
3. The application will automatically detect and load it on startup

### Alphabet File Format

Your alphabet file should follow this JSON structure:

```json
{
  "name": "Your Alphabet Name",
  "description": "Description of your alphabet",
  "height": 5,
  "characters": {
    "A": [
      " █ ",
      "█ █",
      "███",
      "█ █",
      "█ █"
    ]
  }
}
```

**Format Rules:**
- `name`: String - The name of your alphabet
- `description`: String - Description of the alphabet
- `height`: Number - Number of rows for each character (1-20)
- `characters`: Object - Each character maps to an array of strings
- Character patterns use `1`, `x`, or `█` for stitches and spaces for empty cells
- Each row in a character pattern should have the same width
- All characters must have exactly the same number of rows as specified in `height`

### Built-in Alphabets

The app automatically loads all valid alphabet files from the `alphabets/` directory:

- **Alphabet 1**: 5-row alphabet with block-style characters using '█'
- **Alphabet 2**: 5-row alphabet with clean character patterns using '█'
- **Decorative Serif**: Large 13-row decorative font (if present)

### Command-Line Font Validation

Use the built-in validation script to check multiple alphabet files at once:

```bash
npm run validate-fonts
```

This will:
- Validate all JSON files in the `alphabets/` directory
- Generate a detailed validation report
- Save results to `font-validation-report.md`

### Understanding the Chart

- **Blue cells**: Main color stitches  
- **Red cells**: Contrast color stitches
- **Gray cells**: Skip/empty spaces
- **Character labels**: Show which character each column represents
- **Chart dimensions**: Displayed at the bottom of the preview

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run validate-fonts` - Validate all alphabet files and generate report

## Project Structure

```
StitchSpeak/
├── src/
│   ├── components/
│   │   ├── TextInput.jsx          # Text input handling
│   │   └── CrochetChart.jsx       # Chart rendering and display
│   ├── utils/
│   │   ├── alphabetLoader.js      # Dynamic alphabet loading utility
│   │   └── fontValidator.js       # Font validation utility
│   ├── constants.js               # App constants and configuration
│   ├── App.jsx                    # Main application logic
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Application styles
├── alphabets/                     # Alphabet files (auto-loaded)
│   ├── alphabet-1.json            # Block-style alphabet
│   ├── alphabet-2.json            # Clean pattern alphabet
│   └── decorative-serif.json      # Large decorative font
├── scripts/
│   └── validate-fonts.js          # Command-line validation script
├── font-validation-report.md      # Generated validation report
└── README.md                      # This file
```

## Configuration

### App Constants (`src/constants.js`)

The application uses a centralized constants system for easy customization:

```javascript
// Default text for the input field
export const DEFAULT_INPUT_TEXT = 'Hello World!'

// Chart display settings
export const CHART_SETTINGS = {
  CELL_SIZE: 20,
  CELL_GAP: 2,
  MIN_CELL_SIZE: 10,
  MAX_CELL_SIZE: 50
}

// Chart colors
export const CHART_COLORS = {
  MAIN_STITCH: '#667eea',      // Blue for main color stitches
  CONTRAST_STITCH: '#ff6b6b',  // Red for contrast color stitches
  EMPTY_CELL: '#f0f0f0',       // Gray for empty cells
  CELL_BORDER: '#ddd',         // Light gray for cell borders
  GRID_BACKGROUND: '#ffffff'   // White for grid background
}
```

### Customization Options

- **Default Text**: Change `DEFAULT_INPUT_TEXT` to set the initial text
- **Chart Colors**: Modify `CHART_COLORS` to change the visual appearance
- **Cell Size**: Adjust `CHART_SETTINGS.CELL_SIZE` for different chart scales
- **UI Messages**: Update `UI_CONFIG` to customize user-facing text
- **Debug Settings**: Toggle `DEV_CONFIG` options for development

## Customization

### Styling

The application uses CSS custom properties and modern styling. You can customize:

- Colors in `src/index.css` (using CSS custom properties)
- Layout in the component files
- Chart appearance in `CrochetChart.jsx`

### Adding Features

The modular component structure makes it easy to add new features:

- `TextInput.jsx` - Text input handling
- `CrochetChart.jsx` - Chart rendering and display
- `App.jsx` - Main application logic
- `utils/alphabetLoader.js` - Dynamic alphabet loading
- `utils/fontValidator.js` - Font validation utility
- `constants.js` - App configuration and defaults

### Extending the Font Validator

The font validator is extensible and can be customized:

- Add new validation rules in `src/utils/fontValidator.js`
- Modify validation criteria in the `VALIDATION_RULES` constant
- Add custom validation methods to the `FontValidator` class

## Development

### Debug Mode

Enable debug logging by setting `DEV_CONFIG.DEBUG_ALPHABET_LOADING: true` in `constants.js`. This will show:

- Available alphabet modules
- Loading progress for each alphabet
- Total number of alphabets loaded
- Validation results

### Hot Reload

The application supports hot module replacement (HMR) for fast development:

- Changes to alphabet files are automatically detected
- UI updates immediately when constants are modified
- Component changes are reflected instantly

## Documentation

- **[Font Validation Report](font-validation-report.md)**: Current status of all alphabet files

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License. 