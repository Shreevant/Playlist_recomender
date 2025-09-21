# Browser Extension Setup

## Quick Extension Installation

### 1. Load Extension in Chrome/Edge

1. Open Chrome or Edge browser
2. Navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the root folder: `D:\AA\network\geni\Playlist_recomender`
6. The extension will appear in your extensions list

### 2. Start Backend Server

Make sure your backend is running:
```bash
cd backend
# Activate virtual environment if needed
venv\Scripts\Activate.ps1
functions-framework --target=career_playlist --debug
```

### 3. Use the Extension

1. Click the extension icon in your browser toolbar
2. Enter your target career (e.g., "Data Scientist")
3. Optionally add known skills
4. Click "Build Playlist"
5. Browse learning resources directly in the popup

## Extension Features

### 🎯 Core Functionality
- **Career Analysis**: Enter any career and get skill requirements
- **Skill Gap Analysis**: See what you need to learn vs what you know
- **Resource Discovery**: Get YouTube videos and book recommendations
- **Persistent Storage**: Remembers your last search

### 📱 Extension-Specific Features
- **Compact Interface**: Optimized for browser popup (380x600px)
- **Quick Access**: One-click career playlist building
- **External Links**: Opens videos and books in new tabs
- **Full App Access**: Button to open complete web application

### 🔧 Technical Details
- **Manifest V3**: Latest Chrome extension format
- **Local Storage**: Saves your preferences
- **Secure**: Proper content security policies
- **Responsive**: Works in popup and as standalone page

## File Structure (Extension)

```
root/
├── manifest.json          # Extension configuration
├── index.html            # Extension popup interface
├── extension-styles.css  # Popup-optimized styling
├── extension-script.js   # Extension functionality
├── icons/               # Extension icons (16, 32, 48, 128px)
├── frontend/            # Original React web app (preserved)
├── backend/             # API server (preserved)
└── .env                 # API keys configuration
```

## Extension vs Web App

### Extension Popup (index.html)
- ✅ Quick access from browser toolbar
- ✅ Compact interface for fast lookup
- ✅ Integrated with browser
- ✅ Persistent across browsing sessions

### Full Web App (frontend/)
- ✅ Full-featured interface
- ✅ Better for detailed exploration
- ✅ Responsive design for all screen sizes
- ✅ Complete functionality

## Customization

### Icons
Replace placeholder icons in `icons/` folder with:
- `icon16.png` (16x16px) - Toolbar icon
- `icon32.png` (32x32px) - Extension management
- `icon48.png` (48x48px) - Extension management
- `icon128.png` (128x128px) - Chrome Web Store

### API Configuration
Update `extension-script.js` if your backend URL changes:
```javascript
this.API_URL = 'http://localhost:8080'; // Change if needed
```

### Permissions
The extension requires minimal permissions:
- `activeTab`: To open links in new tabs
- `storage`: To save user preferences
- `host_permissions`: To communicate with your API

## Publishing to Chrome Web Store

1. **Prepare icons**: Create proper 16, 32, 48, 128px PNG icons
2. **Test thoroughly**: Ensure all functionality works
3. **Package**: Zip the entire root folder
4. **Upload**: Submit to Chrome Web Store Developer Dashboard
5. **Review**: Google will review before publication

## Troubleshooting

### Extension Not Loading
- Check Developer mode is enabled
- Verify manifest.json is valid
- Look for errors in Extensions page

### API Connection Issues
- Ensure backend server is running on port 8080
- Check CORS settings if needed
- Verify .env file has correct API keys

### Popup Not Showing
- Check extension is pinned to toolbar
- Try reloading the extension
- Check for JavaScript errors in DevTools

## Next Steps

1. **Test the extension**: Load it and try building a playlist
2. **Customize icons**: Add proper branding icons
3. **Enhance features**: Add more extension-specific functionality
4. **Prepare for store**: If you want to publish publicly

Your extension is now ready to use! 🚀