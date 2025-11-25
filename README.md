# GMGN Filter Extension

A Chrome extension that adds advanced filtering capabilities to gmgn.ai, specifically for the `/sol/address/` page.

## Features

- **Filter Icon**: A floating filter icon appears on gmgn.ai pages
- **Platform Selection**: Filter by multiple platforms (Uniswap, PancakeSwap, Raydium, Orca, Jupiter)
- **Range Filters**: 
  - First Buy Market Cap Range
  - First Buy Amount Range
  - First Sell Time Range
- **Local Storage**: Filter settings are automatically saved and restored
- **Modern UI**: Clean, responsive design with dark mode support

## Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. **Download/Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top right corner
4. **Click "Load unpacked"** and select the folder containing the extension files
5. **Pin the extension** to your toolbar for easy access

### Method 2: Install from Chrome Web Store (When Available)

1. Visit the Chrome Web Store
2. Search for "GMGN Filter Extension"
3. Click "Add to Chrome"

## Usage

### Basic Usage

1. **Navigate** to `https://gmgn.ai/sol/address/`
2. **Look for the filter icon** in the top-right corner of the page
3. **Click the icon** to open the filter dialog
4. **Configure your filters**:
   - Select platforms you want to include
   - Set minimum and maximum values for each range
5. **Click "Apply Filters"** to apply your settings
6. **Click "Clear All"** to reset all filters

### Filter Options

#### Platforms
- **Uniswap**: Ethereum-based DEX
- **PancakeSwap**: BSC-based DEX
- **Raydium**: Solana-based DEX
- **Orca**: Solana-based DEX
- **Jupiter**: Solana aggregator

#### Range Filters
- **First Buy MC Range**: Market cap range when first buying
- **First Buy Amount Range**: Amount range for first purchase
- **First Sell Time Range**: Time range (in hours) for first sell

### Extension Popup

- **Click the extension icon** in your Chrome toolbar
- **View current status** and access quick actions
- **Open filter dialog** directly from the popup
- **Clear all filters** with one click

## File Structure

```
gmgn-filter-extension/
├── manifest.json          # Extension configuration
├── content.js            # Main content script
├── styles.css            # CSS styles
├── popup.html            # Extension popup
├── popup.js              # Popup functionality
└── README.md             # This file
```

## Technical Details

### Storage
- Uses `localStorage` to persist filter settings
- Settings are saved per domain and persist across browser sessions
- Data is stored in JSON format for easy debugging

### Compatibility
- **Chrome**: Version 88+ (Manifest V3)
- **Target Site**: gmgn.ai (specifically `/sol/address/` pages)
- **Permissions**: Active tab access and storage

### Customization

#### Adding New Platforms
Edit the `content.js` file and add new platform options in the `createFilterDialog()` function:

```javascript
<label><input type="checkbox" value="newplatform"> New Platform</label>
```

#### Modifying Filter Logic
The `applyFiltersToPage()` function in `content.js` contains the main filtering logic. Customize this function based on the actual structure of gmgn.ai.

#### Styling
All styles are in `styles.css`. The extension uses CSS custom properties and supports dark mode automatically.

## Troubleshooting

### Extension Not Working
1. **Check the URL**: Ensure you're on `https://gmgn.ai/sol/address/`
2. **Refresh the page**: Sometimes the extension needs a page refresh
3. **Check console**: Open Developer Tools (F12) and look for any error messages
4. **Reinstall**: Try removing and re-adding the extension

### Filters Not Saving
1. **Check localStorage**: Open Developer Tools → Application → Local Storage
2. **Clear browser data**: Try clearing site data for gmgn.ai
3. **Check permissions**: Ensure the extension has storage permissions

### Icon Not Visible
1. **Check z-index**: The icon might be behind other elements
2. **Page structure**: The extension looks for header/nav elements to place the icon
3. **CSS conflicts**: Check if site CSS is interfering

## Development

### Local Development
1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension
4. Refresh the target page to see changes

### Debugging
- Use `console.log()` statements in `content.js`
- Check the Console tab in Developer Tools
- Use the Extensions page to view background script logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feature requests:
1. Check the troubleshooting section above
2. Open an issue on the GitHub repository
3. Contact the development team

---

**Note**: This extension is designed specifically for gmgn.ai and may not work on other websites. The filtering logic may need to be updated if the website structure changes. 