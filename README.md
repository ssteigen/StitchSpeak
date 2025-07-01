# StitchSpeak 🧶

A web application that converts text into crochet chart patterns using custom alphabets.

## Features

- **Text to Chart Conversion**: Convert any text into a crochet chart pattern
- **Multiple Alphabets**: Choose from different alphabet styles and sizes
- **Real-time Preview**: See your chart update as you type
- **Alphabet Editor**: Visually edit alphabet characters by clicking cells
- **Customizable Colors**: Blue for main color stitches, red for contrast
- **Responsive Design**: Works on desktop and mobile devices
- **Font Validation**: Built-in validation for alphabet files

## Quick Start

1. **Enter Text**: Type or paste your text in the input field
2. **Choose Alphabet**: Select from available alphabet styles
3. **View Chart**: See the crochet chart pattern generated in real-time
4. **Follow Pattern**: Use the chart to create your crochet project

### Editing Alphabets

You can edit any alphabet using the built-in editor:

1. **Click "Edit Alphabet"**: Use the green edit button below the alphabet selector
2. **Select Character**: Choose which character to edit from the character buttons
3. **Click Cells**: Toggle cells between filled and empty by clicking them
4. **Set Baseline**: Use the slider to set which row is the baseline (where the character bottom sits)
5. **Adjust Character Height**: Use "Change Character Height" to make characters taller or shorter
6. **Add/Delete Characters**: Use the grid controls to manage characters
7. **Change Grid Size**: Adjust the width and height of the character grid
8. **Save Changes**: Click "Save Alphabet" to apply your changes

The editor provides:
- **Visual Grid**: Click cells to toggle between filled (blue) and empty (gray)
- **Baseline Control**: Set the baseline row (highlighted in red) for proper character alignment
- **Variable Height Support**: Each character can have its own height while maintaining baseline alignment
- **Character Preview**: See how each character looks in real-time
- **Grid Controls**: Add, delete characters, change grid dimensions, and adjust individual character heights
- **Alphabet Info**: View current alphabet details and statistics

**Baseline Feature**: The baseline determines where the bottom of each character sits vertically. This is important for proper alignment when characters have different heights (like lowercase letters with descenders). The baseline row is highlighted in red in the editor grid. By default, the baseline is set to the bottom row of the character grid.

**Variable Height Feature**: Characters can now have different heights within the same alphabet. Each character maintains its own height while being properly aligned along the baseline. This allows for more realistic typography where characters like 'g', 'j', 'p', 'q', 'y' can have descenders that extend below the baseline, while other characters maintain their standard height.

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
    "A": {
      "pattern": [
        " █ ",
        "█ █",
        "███",
        "█ █",
        "█ █"
      ],
      "baseline": 3,
      "height": 5
    },
    "g": {
      "pattern": [
        " ███ ",
        "█   █",
        "█   █",
        " ███ ",
        "    █",
        " ███ "
      ],
      "baseline": 3,
      "height": 6
    }
  }
}
```

**Format Rules:**
- `name`: String - The name of your alphabet
- `description`: String - Description of the alphabet
- `height`: Number - Default number of rows for characters (1-20)
- `characters`: Object - Each character maps to an object with pattern, baseline, and height
- `pattern`: Array of strings - The character pattern using `1`, `x`, or `█` for stitches and spaces for empty cells
- `baseline`: Number - The row index (0-based) where the character bottom sits
- `height`: Number - The individual character height (can vary per character)
- Each row in a character pattern can have different widths (variable-width support)
- Each character can have different heights (variable-height support)
- All characters are aligned along their baselines for proper typography

**Legacy Format Support**: The app also supports the old format where characters are direct arrays of strings. When editing these alphabets, they will be automatically converted to the new format with baseline and height information.

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

- **Gray cells**: Main color stitches  
- **Blue cells**: Contrast color stitches
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
│   │   ├── TextInput.jsx                    # Text input handling
│   │   ├── CrochetChart.jsx                 # Chart rendering and display
│   │   ├── AlphabetInfo.jsx                 # Alphabet information display
│   │   └── AlphabetEditor.jsx               # Visual alphabet editor
│   ├── utils/
│   │   ├── alphabetLoader.js                # Dynamic alphabet loading utility
│   │   └── fontValidator.js                 # Font validation utility
│   ├── constants.js                         # App constants and configuration
│   ├── App.jsx                              # Main application logic
│   ├── main.jsx                             # Application entry point
│   └── index.css                            # Application styles
├── alphabets/                               # Alphabet files (auto-loaded)
│   ├── alphabet-1.json                      # Block-style alphabet
│   ├── alphabet-2.json                      # Clean pattern alphabet
│   └── decorative-serif.json                # Large decorative font
├── scripts/
│   └── validate-fonts.js                    # Command-line validation script
├── font-validation-report.md                # Generated validation report
└── README.md                                # This file
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
- `AlphabetInfo.jsx` - Alphabet information and validation display
- `App.jsx` - Main application logic
- `utils/alphabetLoader.js` - Dynamic alphabet loading
- `utils/fontValidator.js` - Font validation utility

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