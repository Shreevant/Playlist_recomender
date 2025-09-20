@echo off
echo AI Career Playlist Builder - Cloud Deployment Script
echo =====================================================
echo.

set /p PROJECT_ID="Enter your GCP Project ID: "
set /p YOUTUBE_API_KEY="Enter your YouTube API Key: "

echo.
echo Setting up Google Cloud Project...
gcloud config set project %PROJECT_ID%

echo.
echo Enabling required APIs...
gcloud services enable aiplatform.googleapis.com cloudfunctions.googleapis.com cloudbuild.googleapis.com youtube.googleapis.com

echo.
echo Deploying backend to Cloud Functions...
cd backend
gcloud functions deploy career-playlist ^
  --runtime python311 ^
  --trigger-http ^
  --allow-unauthenticated ^
  --entry-point career_playlist ^
  --set-env-vars YOUTUBE_API_KEY=%YOUTUBE_API_KEY%,GCP_PROJECT=%PROJECT_ID%,LOCATION=us-central1

if %errorlevel% neq 0 (
    echo Error: Backend deployment failed!
    pause
    exit /b 1
)

cd ..

echo.
echo Backend deployed successfully!
echo Your API endpoint: https://us-central1-%PROJECT_ID%.cloudfunctions.net/career-playlist
echo.

echo Preparing frontend for deployment...
cd frontend
call npm install

echo Creating .env file...
echo REACT_APP_API_URL=https://us-central1-%PROJECT_ID%.cloudfunctions.net/career-playlist > .env

echo Building frontend...
call npm run build

echo.
echo Frontend built successfully! Build folder is ready for deployment.
echo.
echo Next steps:
echo 1. Deploy to Firebase Hosting: firebase init hosting && firebase deploy
echo 2. Or upload the 'build' folder to your preferred hosting service
echo.
pause