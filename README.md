# 🚀 AI Career Playlist Builder

**Discover the skills you need for your dream career and get personalized learning resources powered by AI - available as both a browser extension and standalone web application!**

[![GitHub Stars](https://img.shields.io/github/stars/your-username/your-repo-name?style=social)](https://github.com/your-username/your-repo-name)
[![Browser Extension](https://img.shields.io/badge/Browser-Extension-blue)](#-browser-extension-quick-install)
[![Web App](https://img.shields.io/badge/Web-App-green)](#-web-application-development-mode)

---

## 🎯 What This Does

- **Career Analysis**: Enter any career and get essential skill requirements
- **Skill Gap Detection**: See what you need to learn vs what you already know  
- **Learning Resources**: Get curated YouTube videos and book recommendations
- **Professional Certifications**: Discover industry-recognized certification programs
- **Browser Extension**: Quick access directly from your browser toolbar
- **Web Application**: Full-featured development environment with hot reload
- **Offline Mode**: Works even when APIs are limited or unavailable
- **Dual Architecture**: Choose between quick extension or full development setup

---

## 🚀 Quick Start Options

### Option 1: Browser Extension (Recommended for Users)
**⏱️ Setup Time: 2 minutes**

### **Browser Extension Installation**

#### Step 1: Download Extension
1. **[Download ZIP](https://github.com/your-username/your-repo-name/archive/main.zip)** or clone this repository
2. **Extract files** to a folder on your computer

#### Step 2: Create Icons (30 seconds)
1. **Open `create_icons.html`** in your browser
2. **Click "Download All Icons"** button
3. **Save the 4 PNG files** to the `icons/` folder

#### Step 3: Install in Browser (1 minute)

**For Chrome/Edge:**
1. Open browser and go to `chrome://extensions/`
2. **Turn ON "Developer mode"** (toggle in top right)
3. **Click "Load unpacked"**
4. **Select the folder** containing `manifest.json`
5. **Done!** Extension appears in your toolbar 🎉

**For Firefox:**
1. Go to `about:debugging`
2. Click "This Firefox" → "Load Temporary Add-on"
3. Select the `manifest.json` file

#### Step 4: Use Extension
1. **Click extension icon** in browser toolbar
2. **Type your career** (e.g., "Data Scientist", "Frontend Developer")
3. **Add known skills** (optional)
4. **Click "Build Playlist"**
5. **Browse learning resources!** 🎓

### ✨ Extension Features
- ✅ **Works immediately** - no setup required
- ✅ **Search links** to YouTube videos and books
- ✅ **Certification programs** from leading providers
- ✅ **Career suggestions** with autocomplete
- ✅ **Skill gap analysis** - shows what to learn
- ✅ **Remembers searches** - saves your progress
- ✅ **Optional APIs** - add your keys for enhanced features

### 🔑 Optional: Enhanced Features (API Keys)

For live recommendations instead of search links:

1. **Click Settings (⚙️)** in extension
2. **Get free API keys** from [Google Cloud Console](https://console.cloud.google.com/):
   - YouTube Data API v3 (10,000 free requests/day)
   - Google Books API (1,000 free requests/day)
   - Knowledge Graph Search API (100,000 free requests/day)
3. **Add keys to extension settings**
4. **Enjoy live data!**

---

### Option 2: Web Application (Development Mode)
**⏱️ Setup Time: 5 minutes**

For developers who want the complete development environment with backend API and React frontend:

#### Quick Local Setup
```bash
# 1. Clone repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 2. Start backend server (Terminal 1)
cd backend
pip install -r requirements.txt

# Option A: Using Functions Framework (recommended)
functions-framework --target=career_playlist --debug
# Backend runs on http://localhost:8080

# Option B: Using Flask wrapper (if functions-framework fails)
python server.py
# Backend runs on http://localhost:8080

# 3. Start frontend development server (Terminal 2)
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000 with hot reload
```

#### What You Get
- ✅ **Full React Development Environment** with hot reload
- ✅ **Backend API Server** with Python Flask
- ✅ **Live Development Testing** - see changes instantly
- ✅ **Complete Debugging** capabilities
- ✅ **Vertex AI Integration** for smart skill extraction
- ✅ **All API Integrations** (YouTube, Books, Knowledge Graph)
- ✅ **CORS Enabled** for frontend-backend communication
- ✅ **Fallback Systems** when APIs are unavailable

#### Development Features
- **Frontend**: React app with responsive design
- **Backend**: Python with Flask/Functions Framework  
- **AI**: Vertex AI (with intelligent fallbacks)
- **APIs**: YouTube Data API, Google Books API, Knowledge Graph
- **Storage**: Browser local storage for preferences
- **Testing**: Comprehensive test suite included

---

## ⚙️ Configuration & Setup

### API Keys Setup (Optional)
Both extension and web app work without API keys using fallback data and search links. Add keys for enhanced features:

#### Getting Free API Keys
1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create new project** or select existing
3. **Enable APIs**:
   - YouTube Data API v3 (10,000 free requests/day)
   - Google Books API (1,000 free requests/day) 
   - Knowledge Graph Search API (100,000 free requests/day)
4. **Go to Credentials → Create API Key**
5. **Copy keys to:**
   - **Extension**: Click Settings (⚙️) in extension popup
   - **Web App**: Add to `.env` file in backend folder

#### Environment File (.env)
For web application development, create `.env` file in backend folder:
```
YOUTUBE_API_KEY=your_youtube_api_key_here
GOOGLE_BOOKS_API_KEY=your_books_api_key_here
KNOWLEDGE_GRAPH_API_KEY=your_knowledge_graph_key_here
```

---

## 🔧 Development & Customization

### Project Structure
```
AI-Career-Playlist-Builder/
├── 📄 manifest.json          # Extension configuration
├── 📄 index.html            # Extension popup interface
├── 📄 extension-script.js   # Extension logic & functionality
├── 📄 extension-styles.css  # Extension styling
├── 📱 icons/               # Extension icons (16, 32, 48, 128px)
│   ├── icon16.png
│   ├── icon32.png  
│   ├── icon48.png
│   └── icon128.png
├── 📱 frontend/            # React web application
│   ├── src/
│   │   ├── App.js           # Main React component
│   │   └── index.js         # React entry point
│   ├── public/
│   └── package.json         # React dependencies
├── 📱 backend/             # Python API server
│   ├── main.py              # Main API functions
│   ├── server.py            # Flask server wrapper
│   └── requirements.txt     # Python dependencies
├── 📄 create_icons.html    # Icon generator utility
├── 📄 .env                 # API keys (create this file)
├── 📄 README.md            # This documentation
```

### Customization Options

#### Extension Customization
- **Styling**: Edit `extension-styles.css` for custom themes and colors
- **Careers**: Modify `popularCareers` array in `extension-script.js`
- **Skills Database**: Update `getStaticSkills()` function for offline skills
- **Icons**: Replace PNG files in `icons/` folder with your branding
- **API Endpoints**: Update backend URL in extension settings

#### Web App Customization  
- **React Components**: Modify `frontend/src/App.js` for UI changes
- **Backend Logic**: Update `backend/main.py` for API behavior
- **Styling**: Edit React component styles for web interface
- **Port Configuration**: Change ports in startup commands if needed

#### Brand Customization
```javascript
// In extension-script.js - update these arrays:
const popularCareers = [
    'Data Scientist', 'Frontend Developer', 'Your Custom Career'
];

// In extension-styles.css - update color scheme:
.ext-build-btn {
    background: linear-gradient(135deg, #your-color1, #your-color2);
}
```

### Development Workflows

#### Extension Development
1. **Make changes** to extension files (`index.html`, `extension-script.js`, `extension-styles.css`)
2. **Reload extension** in browser (`chrome://extensions/` → reload button)
3. **Test changes** by clicking extension icon
4. **Debug issues** using browser DevTools (F12)

#### Web App Development  
1. **Start both servers** (backend + frontend as shown above)
2. **Make changes** to React components in `frontend/src/`
3. **View changes** automatically with hot reload at `http://localhost:3000`
4. **Test API changes** by modifying `backend/main.py`
5. **Restart backend** after API changes

#### Testing Both Modes
```bash
# Test extension functionality
# Load extension → Test career input → Check results

# Test web application  
# Visit http://localhost:3000 → Test same functionality

# Run comprehensive tests
python test_final_verification.py
```

---

## 🎆 Example Careers

Try these career examples in the extension:
- Data Scientist
- Frontend Developer  
- DevOps Engineer
- UI/UX Designer
- Machine Learning Engineer
- Product Manager
- Cybersecurity Analyst
- Full Stack Developer
- Cloud Architect
- Mobile Developer

---

## 🎓 How It Works

### For Users
1. **Enter Career**: Type any job title
2. **AI Analysis**: System identifies required skills
3. **Gap Analysis**: Compares with your known skills
4. **Resources**: Provides learning materials for each skill
5. **Track Progress**: Saves your learning journey

### Under the Hood
- **Frontend**: React app + Browser extension
- **Backend**: Python with Flask/Functions Framework
- **AI**: Vertex AI (with intelligent fallbacks)
- **APIs**: YouTube Data API, Google Books API
- **Storage**: Browser local storage for preferences

---

## 🎆 Success Stories

Perfect for:
- 🎓 **Students** planning their career path
- 🔍 **Job Seekers** preparing for interviews
- 🔄 **Career Changers** identifying skill gaps
- 💼 **Recruiters** understanding role requirements
- 🏫 **Educators** creating learning curricula

---

## 🎆 Troubleshooting

### Extension Issues
- **Extension not loading**: Enable Developer mode in browser extensions page
- **Icons not showing**: Run `create_icons.html` to generate PNG files
- **Popup not opening**: Reload extension after making changes
- **Settings not saving**: Check browser storage permissions
- **API errors**: Extension works offline with search links as fallback

### Web Application Issues  
- **Backend not starting**: Try using `python server.py` instead of functions-framework
- **Frontend not loading**: Check if port 3000 is available, try `npm start` again
- **CORS errors**: Ensure backend is running and CORS is enabled
- **API quota exceeded**: System automatically falls back to offline mode
- **Dependencies missing**: Run `pip install -r requirements.txt` and `npm install`

### Common Solutions
- **Chrome**: Go to `chrome://extensions/` and reload extension
- **Firefox**: Go to `about:debugging` and reload temporary add-on
- **Permissions**: Check `manifest.json` is valid JSON
- **Console Errors**: Check browser DevTools (F12) for detailed error messages
- **Port Conflicts**: Change ports in startup commands if needed

### Development Tips
```bash
# If functions-framework fails, use Flask wrapper:
cd backend
python server.py

# If React won't start, clear cache:
cd frontend
npm start -- --reset-cache

# Check all processes:
# Backend: http://localhost:8080
# Frontend: http://localhost:3000  
# Extension: Click browser extension icon
```

---

## 🚀 Publishing (Optional)

### Chrome Web Store
1. **Package**: Zip the extension folder
2. **Account**: Create [Chrome Web Store Developer](https://chrome.google.com/webstore/devconsole/) account ($5)
3. **Upload**: Submit extension for review
4. **Wait**: Approval typically takes 1-3 days

### Firefox Add-ons
1. **Test**: Verify in Firefox Developer Edition
2. **Submit**: Upload to [Mozilla Add-ons](https://addons.mozilla.org/developers/)
3. **Review**: Free submission and review process

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** branch: `git push origin amazing-feature`
5. **Submit** pull request

---

## 📜 License

MIT License - feel free to use, modify, and distribute!

---

## 🚀 Quick Start Summary

### For Users (Browser Extension):
1. **[Download ZIP](https://github.com/your-username/your-repo-name/archive/main.zip)** → Extract files
2. **Open `create_icons.html`** → Download icons → Save to `icons/` folder
3. **Chrome**: `chrome://extensions/` → Developer mode → Load unpacked
4. **Click extension icon** → Enter career → Build playlist! 🎓

### For Developers (Full Development Setup):
1. **Clone repository**: `git clone [repo-url]` 
2. **Backend**: `cd backend` → `pip install -r requirements.txt` → `functions-framework --target=career_playlist`
3. **Frontend**: `cd frontend` → `npm install` → `npm start`
4. **Open**: Backend (`http://localhost:8080`) + Frontend (`http://localhost:3000`) 🚀

### Both Options Available:
- ✅ **Browser Extension**: Quick access, lightweight, works offline
- ✅ **Web Application**: Full development environment, hot reload, debugging
- ✅ **API Integration**: Optional enhanced features with free API keys
- ✅ **Offline Mode**: Works without APIs using fallback data and search links

**Ready to discover your career path? Choose your setup and start building! 🚀📚**