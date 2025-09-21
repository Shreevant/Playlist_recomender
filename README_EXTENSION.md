# 🚀 AI Career Playlist Builder - Browser Extension

**Discover the skills you need for your dream career and get personalized learning resources powered by AI - directly from your browser toolbar!**

[![GitHub Stars](https://img.shields.io/github/stars/your-username/your-repo-name?style=social)](https://github.com/your-username/your-repo-name)
[![Browser Extension](https://img.shields.io/badge/Browser-Extension-blue)](./INSTALL_EXTENSION.md)
[![Web App](https://img.shields.io/badge/Web-App-green)](https://your-username.github.io/your-repo-name)

## 🎯 What This Does

- **Career Analysis**: Enter any career and get essential skill requirements
- **Skill Gap Detection**: See what you need to learn vs what you already know  
- **Learning Resources**: Get curated YouTube videos and book recommendations
- **Browser Extension**: Quick access directly from your browser toolbar
- **Offline Mode**: Works even when APIs are limited or unavailable

## 🚀 Quick Start (Browser Extension)

### 1. Download & Install

**Option A: From GitHub (Recommended)**
1. [Download ZIP](https://github.com/your-username/your-repo-name/archive/main.zip) or clone this repo
2. Extract files to your computer
3. Follow the [Installation Guide](./INSTALL_EXTENSION.md)

**Option B: Direct Install**
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
# Follow installation guide
```

### 2. Load in Browser

1. **Chrome/Edge**: Go to `chrome://extensions/` → Enable Developer mode → Load unpacked
2. **Firefox**: Go to `about:debugging` → Load Temporary Add-on
3. Select the folder containing `manifest.json`
4. Extension appears in toolbar! 🎉

### 3. Create Icons (Optional)

1. Open `create_icons.html` in your browser
2. Click "Download All Icons"
3. Save PNG files to `icons/` folder

## 📱 Features

### 🎯 Core Functionality
- ✅ **AI-Powered Career Analysis** with smart fallbacks
- ✅ **YouTube Video Recommendations** 
- ✅ **Google Books Integration**
- ✅ **Skill Gap Analysis**
- ✅ **Career Suggestions & Autocomplete**
- ✅ **Persistent Storage** (remembers your searches)

### 🛠️ Technical Features
- ✅ **Dual Architecture**: Browser Extension + Web App
- ✅ **Offline Mode**: Works without backend API
- ✅ **Responsive Design**: Optimized popup interface
- ✅ **Fallback System**: Graceful degradation when APIs fail
- ✅ **Cross-Browser**: Chrome, Edge, Firefox compatible

## 🎮 Usage

### Quick Workflow
1. **Click Extension Icon** in browser toolbar
2. **Enter Career** (e.g., "Data Scientist", "Frontend Developer")
3. **Add Known Skills** (optional - Python, React, etc.)
4. **Click "Build Playlist"**
5. **Browse Resources** - videos and books for each skill
6. **Open Full App** button for detailed view

### Example Careers
- Data Scientist
- Frontend Developer  
- DevOps Engineer
- UI/UX Designer
- Machine Learning Engineer
- Product Manager
- Cybersecurity Analyst

## 🏗️ Architecture

### Browser Extension
- **Popup Interface**: Compact 380x600px interface
- **Background Scripts**: Career analysis and API calls
- **Storage**: Saves preferences and last searches
- **Permissions**: Minimal - only what's needed

### Web Application (Also Included)
- **React Frontend**: Full-featured web interface
- **Python Backend**: API server with AI integration
- **Fallback System**: Works without external APIs

### APIs Used
- **Vertex AI**: Career skill extraction (with fallbacks)
- **YouTube Data API v3**: Video recommendations
- **Google Books API**: Book recommendations

## 🔧 Development

### Local Development
```bash
# Backend (optional - extension has fallbacks)
cd backend
pip install -r requirements.txt
functions-framework --target=career_playlist --debug

# Frontend (if you want to modify the web app)
cd frontend
npm install
npm start
```

### Extension Development
1. Make changes to extension files (`index.html`, `extension-script.js`, etc.)
2. Reload extension in browser
3. Test changes immediately

### Customization
- **Styling**: Edit `extension-styles.css`
- **Functionality**: Modify `extension-script.js`
- **Career Database**: Update static skills in script
- **API Endpoints**: Configure backend URLs

## 📦 File Structure

```
your-repo-name/
├── 📄 manifest.json          # Extension configuration
├── 📄 index.html            # Extension popup
├── 📄 extension-script.js   # Extension logic
├── 📄 extension-styles.css  # Extension styling
├── 📁 icons/               # Extension icons
├── 📁 frontend/            # React web app
├── 📁 backend/             # Python API server
├── 📄 create_icons.html    # Icon generator tool
└── 📄 INSTALL_EXTENSION.md # Installation guide
```

## 🚀 Publishing (Optional)

### Chrome Web Store
1. Package extension as ZIP
2. Create [Developer Account](https://chrome.google.com/webstore/devconsole/) ($5)
3. Upload and submit for review
4. Typically approved in 1-3 days

### Firefox Add-ons
1. Test in Firefox
2. Submit to [Mozilla Add-ons](https://addons.mozilla.org/developers/)
3. Free submission and review

## 🆘 Troubleshooting

### Common Issues
- **Extension not loading**: Check Developer mode is enabled
- **No icons showing**: Run `create_icons.html` to generate PNG files
- **API errors**: Extension works offline with static fallbacks
- **Popup not opening**: Reload extension after changes

### Support
- Check [Installation Guide](./INSTALL_EXTENSION.md)
- Review browser console for errors
- Ensure `manifest.json` is valid JSON
- Test in different browsers

## 🎉 Success Stories

Perfect for:
- **Students** planning their career path
- **Job Seekers** preparing for interviews
- **Career Changers** identifying skill gaps
- **Recruiters** understanding role requirements
- **Educators** creating learning curricula

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## 📜 License

MIT License - feel free to use, modify, and distribute!

---

**Ready to build your career playlist? Install the extension and start learning! 🚀📚**