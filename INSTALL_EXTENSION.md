# 🚀 Browser Extension Installation Guide

## Quick Installation (2 minutes)

### Step 1: Get the Extension Files

**Option A: Download from GitHub**
1. Go to your GitHub repository
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to your computer

**Option B: Clone the Repository**
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Step 2: Create Extension Icons

1. Open the `create_icons.html` file in your browser
2. Click "Download All Icons" button
3. Save the 4 PNG files to the `icons/` folder:
   - `icon16.png`
   - `icon32.png` 
   - `icon48.png`
   - `icon128.png`

### Step 3: Install in Browser

**For Chrome:**
1. Open Chrome
2. Navigate to `chrome://extensions/`
3. Toggle "Developer mode" ON (top right)
4. Click "Load unpacked"
5. Select the folder containing `manifest.json`
6. The extension appears in your toolbar! 🎉

**For Edge:**
1. Open Edge
2. Navigate to `edge://extensions/`
3. Toggle "Developer mode" ON (left sidebar)
4. Click "Load unpacked"
5. Select the folder containing `manifest.json`
6. The extension appears in your toolbar! 🎉

**For Firefox:**
1. Open Firefox
2. Navigate to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file
6. The extension appears in your toolbar! 🎉

## 🎯 Using the Extension

### Quick Start (No Setup Required)
1. Click the extension icon in your toolbar
2. Type your target career (e.g., "Data Scientist")
3. Add known skills (optional)
4. Click "Build Playlist"
5. Browse your learning resources via search links!

### Enhanced Mode (Optional API Setup)
For live recommendations instead of search links:

1. **Click Settings (⚙️)** in extension popup
2. **Add API Keys** (free from Google Cloud Console):
   - YouTube Data API v3 key
   - Google Books API key
3. **Save settings** and restart extension
4. **Get live data** instead of search links

### API Key Setup (Optional)
**Getting YouTube API Key (Free):**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable "YouTube Data API v3"
4. Go to Credentials → Create API Key
5. Copy to extension settings

**Getting Google Books API Key (Free):**
1. Same Google Cloud Console project
2. Enable "Books API"
3. Use same API key or create new one
4. Copy to extension settings

**Free Quotas:**
- YouTube: 10,000 requests/day (plenty for personal use)
- Google Books: 1,000 requests/day
- Cost: $0 (free tier is generous)

## 🔧 Configuration Options

### Backend API (Optional)
If you want full functionality with live API data:

1. **Local Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   functions-framework --target=career_playlist
   ```

2. **Update API URL:**
   Edit `extension-script.js` line 4:
   ```javascript
   this.API_ENDPOINTS = [
       'http://localhost:8080',  // Your backend URL
       'https://your-api.herokuapp.com'  // Alternative URL
   ];
   ```

### Customization
- **Icons**: Replace files in `icons/` folder with your branding
- **Colors**: Edit `extension-styles.css` for custom theme
- **Career Options**: Modify `popularCareers` array in `extension-script.js`

## 🚀 Publishing to Store (Optional)

### Chrome Web Store
1. **Package Extension:**
   - Zip the entire extension folder
   - Ensure all icons are PNG format
   - Test thoroughly in Chrome

2. **Submit:**
   - Create [Chrome Web Store Developer Account](https://chrome.google.com/webstore/devconsole/) ($5 fee)
   - Upload ZIP file
   - Fill out store listing details
   - Submit for review (typically 1-3 days)

### Firefox Add-ons
1. **Prepare:**
   - Test in Firefox Developer Edition
   - Sign extension at [addons.mozilla.org](https://addons.mozilla.org/developers/)

2. **Submit:**
   - Create Firefox Developer account (free)
   - Upload ZIP file
   - Review process varies

## 🆘 Troubleshooting

### Extension Not Loading
- ✅ Check Developer mode is enabled
- ✅ Verify `manifest.json` is valid
- ✅ Look for errors in Extensions page console

### Icons Not Showing
- ✅ Ensure PNG files exist in `icons/` folder
- ✅ Check file names match manifest exactly
- ✅ Reload extension after adding icons

### API Connection Issues
- ✅ Backend runs on `http://localhost:8080`
- ✅ Check browser console for errors
- ✅ Extension works in offline mode if API unavailable

### Permission Errors
- ✅ Check `manifest.json` permissions
- ✅ Reload extension after changes
- ✅ Clear browser data if persistent issues

## 📱 Mobile Support

While this is a desktop browser extension, you can also:

1. **Progressive Web App:** Add to mobile home screen from browser
2. **Mobile Extension:** Consider React Native version for mobile apps
3. **Web App:** Access full functionality at your GitHub Pages URL

## 🎉 Success!

Your AI Career Playlist Builder extension is now ready to help users discover their learning path directly from their browser toolbar!

**Next Steps:**
- Share with friends and colleagues
- Gather feedback for improvements  
- Consider publishing to browser stores
- Add more features and customizations

Happy learning! 🚀📚