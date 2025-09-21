# 🚀 AI Career Playlist Builder

**Discover the skills you need for your dream career and get personalized learning resources powered by AI - directly from your browser!**

[![GitHub Stars](https://img.shields.io/github/stars/your-username/your-repo-name?style=social)](https://github.com/your-username/your-repo-name)
[![Browser Extension](https://img.shields.io/badge/Browser-Extension-blue)](#-browser-extension-quick-install)
[![Web App](https://img.shields.io/badge/Web-App-green)](#-web-application)

---

## 🎯 What This Does

- **Career Analysis**: Enter any career and get essential skill requirements
- **Skill Gap Detection**: See what you need to learn vs what you already know  
- **Learning Resources**: Get curated YouTube videos and book recommendations
- **Browser Extension**: Quick access directly from your browser toolbar
- **Offline Mode**: Works even when APIs are limited or unavailable

---

## 🚀 Browser Extension (Quick Install)

### **Option 1: Install Browser Extension (Recommended - 2 minutes)**

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
3. **Add keys to extension settings**
4. **Enjoy live data!**

---

## 🌐 Web Application

### **Option 2: Run Full Web App (For Developers)**

If you want the complete web application with backend:

#### Quick Local Setup
```bash
# 1. Clone repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# 2. Run backend (Terminal 1)
cd backend
pip install -r requirements.txt
functions-framework --target=career_playlist --debug
# Backend runs on http://localhost:8080

# 3. Run frontend (Terminal 2)
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

#### Backend API Features
- ✅ **Vertex AI integration** for smart skill extraction
- ✅ **YouTube Data API** for live video recommendations  
- ✅ **Google Books API** for book suggestions
- ✅ **Fallback system** when APIs are unavailable
- ✅ **CORS enabled** for frontend communication

---

## 🔧 Development & Customization

### File Structure
```
your-repo-name/
├── 📄 manifest.json          # Extension configuration
├── 📄 index.html            # Extension popup
├── 📄 extension-script.js   # Extension logic
├── 📄 extension-styles.css  # Extension styling
├── 📱 icons/               # Extension icons
├── 📱 frontend/            # React web app
├── 📱 backend/             # Python API server
├── 📄 create_icons.html    # Icon generator
└── 📄 .env                 # API keys (optional)
```

### Customization Options
- **Styling**: Edit `extension-styles.css` for custom themes
- **Careers**: Modify `popularCareers` array in `extension-script.js`
- **Skills Database**: Update `getStaticSkills()` function
- **Icons**: Replace files in `icons/` folder with your branding

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
- **Extension not loading**: Enable Developer mode in browser
- **Icons not showing**: Run `create_icons.html` to generate PNG files
- **Popup not opening**: Reload extension after changes
- **API errors**: Extension works offline with search links

### Common Solutions
- **Chrome**: Go to `chrome://extensions/` and reload extension
- **Firefox**: Go to `about:debugging` and reload temporary add-on
- **Permissions**: Check `manifest.json` is valid JSON
- **Console**: Check browser DevTools for error messages

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

## 🎉 Quick Start Summary

### For Users (Extension):
1. [Download ZIP](https://github.com/your-username/your-repo-name/archive/main.zip)
2. Extract → Open `create_icons.html` → Download icons
3. Chrome: `chrome://extensions/` → Developer mode → Load unpacked
4. Click extension icon → Enter career → Build playlist!

### For Developers (Full App):
1. `git clone` → `cd backend` → `pip install -r requirements.txt`
2. `functions-framework --target=career_playlist`
3. New terminal: `cd frontend` → `npm install` → `npm start`
4. Open `http://localhost:3000`

**Ready to discover your career path? Start building your playlist! 🚀📚**

## Demo Tips

1. **Prepare fallback data**: The app includes fallback skills for common careers, so it works even without Vertex AI.

2. **Test with YouTube API**: Make sure your YouTube API key is working and has sufficient quota.

3. **Show skill gap analysis**: Enter some known skills to demonstrate the skill gap feature.

4. **Mobile-friendly**: The UI is responsive and works on mobile devices.

5. **Error handling**: The app gracefully handles API failures and shows appropriate messages.

---

## Architecture

- **Backend**: Google Cloud Functions with Python
- **AI**: Vertex AI Text Generation (with fallback)
- **Video Search**: YouTube Data API v3
- **Frontend**: React with minimal styling
- **State Management**: React useState (no external libraries)

---

## Next Steps / Extensions

- Add user authentication and save playlists
- Integrate with Firestore for persistence
- Add more detailed skill assessments
- Include other learning platforms (Coursera, Udemy, etc.)
- Add progress tracking and completion status
- Implement skill prerequisite mapping
- Add social features (sharing playlists)

---

## License

MIT License - feel free to use this for your hackathon projects!

---

## Troubleshooting

### Troubleshooting

**Deployment Issues:**
- Make sure you have gcloud SDK installed and authenticated
- Ensure billing is enabled on your GCP project
- Check that all required APIs are enabled
- Verify your YouTube API key is valid and has quota

**Frontend Issues:**
- Make sure the REACT_APP_API_URL matches your deployed Cloud Function URL
- Check browser console for CORS or network errors
- Verify the Cloud Function allows unauthenticated access

### Testing Without External APIs

The app is designed to work completely offline with fallback data:
- Skills are extracted from the built-in FALLBACK_SKILLS database
- YouTube videos will show "No videos found" but the interface still works
- Perfect for demonstrating the UI and basic functionality