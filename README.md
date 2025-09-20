# AI Career Playlist Builder — 24‑hour Hackathon Kit

> Complete, step‑by‑step repo layout + all code required to build and demo the project in 24 hours using **Google Cloud Functions, Vertex AI (with fallback), YouTube Data API, Firestore (optional)** and a minimal React frontend.

---

## Summary

A minimal, judge‑friendly prototype that:

* Accepts a career goal (e.g., "Data Scientist").
* Uses **Vertex AI** to extract the top skills required (with a built‑in fallback).
* Uses **YouTube Data API** to fetch short tutorial/video resources per skill.
* Returns a JSON playlist that the React UI renders as a Spotify‑like skill → track view.

This doc contains: repo tree, all code files, setup / deploy commands, and tips to make the demo shine.

---

## Repo structure

```
ai-career-playlist/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .gcloudignore
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js
│   │   ├── App.js
│   │   └── App.css
├── README.md
└── .gitignore
```

---

## Prerequisites

**Before deployment, you need:**

1. **Google Cloud SDK** - Install from [here](https://cloud.google.com/sdk/docs/install)
2. **Node.js** (v16+) - Install from [nodejs.org](https://nodejs.org/)
3. **Google Cloud Project** with billing enabled
4. **YouTube Data API Key** from Google Cloud Console

**Quick Setup:**

Run the setup script to install Google Cloud SDK:
```bash
.\setup-gcloud.ps1
```

This will:
- Check if gcloud is installed
- Guide you through installation if needed
- Set up authentication
- Prepare for deployment

---

## Quick Cloud Deployment

### Step 1: Setup Google Cloud Project

```bash
# Create and configure your GCP project
gcloud projects create YOUR_PROJECT_ID --name="AI Career Playlist"
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable aiplatform.googleapis.com cloudfunctions.googleapis.com cloudbuild.googleapis.com youtube.googleapis.com

# Authenticate
gcloud auth login
gcloud auth application-default login
```

### Step 2: Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Click "Create Credentials" → "API Key"
4. Copy your API key

### Step 3: Deploy Backend to Cloud Functions

```bash
cd backend

# Deploy the function with environment variables
gcloud functions deploy career-playlist \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point career_playlist \
  --set-env-vars YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY,GCP_PROJECT=YOUR_PROJECT_ID,LOCATION=us-central1
```

After deployment, you'll get a URL like:
`https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/career-playlist`

### Step 4: Deploy Frontend

**Option A: Firebase Hosting**

```bash
cd frontend

# Install dependencies
npm install

# Create .env file with your Cloud Function URL
echo REACT_APP_API_URL=https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/career-playlist > .env

# Build the app
npm run build

# Install Firebase CLI and deploy
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

**Option B: Netlify (Alternative)**

```bash
cd frontend
npm install
npm run build
# Upload the 'build' folder to Netlify
# Set environment variable: REACT_APP_API_URL=your_cloud_function_url
```

### Automated Deployment

**Step 1: Setup Prerequisites**
```bash
# Install Google Cloud SDK (run this first!)
.\setup-gcloud.ps1
```

**Step 2: Deploy Everything**
```bash
# Deploy backend and build frontend
.\deploy.ps1
```

The deployment script will:
1. Verify Google Cloud SDK is installed and authenticated
2. Set up your GCP project
3. Enable required APIs
4. Deploy the backend to Cloud Functions
5. Build the frontend with correct API URL
6. Prepare everything for hosting

---

## Deployment

### Deploy Backend to Google Cloud Functions

Navigate to the backend directory and deploy:

```bash
cd backend
gcloud functions deploy career-playlist \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point career_playlist \
  --set-env-vars YOUTUBE_API_KEY=your_youtube_api_key,GCP_PROJECT=your_project_id,LOCATION=us-central1
```

### Deploy Frontend

Option 1: Firebase Hosting

```bash
cd frontend
npm run build
firebase init hosting
firebase deploy
```

Option 2: Any static hosting service (Netlify, Vercel, etc.)

Build the app and upload the `build` folder:

```bash
npm run build
```

---

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