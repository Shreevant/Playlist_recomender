Write-Host "AI Career Playlist Builder - Cloud Deployment Script" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""

# Check if gcloud is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $gcloudVersion = gcloud version 2>$null
    Write-Host "✓ Google Cloud SDK found" -ForegroundColor Green
} catch {
    Write-Host "✗ Google Cloud SDK not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Google Cloud SDK first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Cyan
    Write-Host "2. Run the installer" -ForegroundColor Cyan
    Write-Host "3. Restart PowerShell" -ForegroundColor Cyan
    Write-Host "4. Run 'gcloud auth login' to authenticate" -ForegroundColor Cyan
    Write-Host "5. Run this script again" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if user is authenticated
Write-Host "Checking authentication..." -ForegroundColor Yellow
try {
    $authStatus = gcloud auth list --filter="status:ACTIVE" --format="value(account)" 2>$null
    if ([string]::IsNullOrWhiteSpace($authStatus)) {
        Write-Host "✗ Not authenticated with Google Cloud" -ForegroundColor Red
        Write-Host "Please run: gcloud auth login" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✓ Authenticated as: $authStatus" -ForegroundColor Green
} catch {
    Write-Host "✗ Authentication check failed" -ForegroundColor Red
    Write-Host "Please run: gcloud auth login" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

$PROJECT_ID = Read-Host "Enter your GCP Project ID"
$YOUTUBE_API_KEY = Read-Host "Enter your YouTube API Key"

Write-Host ""
Write-Host "Setting up Google Cloud Project..." -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

Write-Host ""
Write-Host "Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable aiplatform.googleapis.com cloudfunctions.googleapis.com cloudbuild.googleapis.com youtube.googleapis.com

Write-Host ""
Write-Host "Deploying backend to Cloud Functions..." -ForegroundColor Yellow
Set-Location backend
gcloud functions deploy career-playlist `
  --runtime python311 `
  --trigger-http `
  --allow-unauthenticated `
  --entry-point career_playlist `
  --set-env-vars "YOUTUBE_API_KEY=$YOUTUBE_API_KEY,GCP_PROJECT=$PROJECT_ID,LOCATION=us-central1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Backend deployment failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "Backend deployed successfully!" -ForegroundColor Green
Write-Host "Your API endpoint: https://us-central1-$PROJECT_ID.cloudfunctions.net/career-playlist" -ForegroundColor Cyan
Write-Host ""

Write-Host "Preparing frontend for deployment..." -ForegroundColor Yellow
Set-Location frontend
npm install

Write-Host "Creating .env file..." -ForegroundColor Yellow
"REACT_APP_API_URL=https://us-central1-$PROJECT_ID.cloudfunctions.net/career-playlist" | Out-File -FilePath .env -Encoding utf8

Write-Host "Building frontend..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "Frontend built successfully! Build folder is ready for deployment." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy to Firebase Hosting: firebase init hosting && firebase deploy" -ForegroundColor Cyan
Write-Host "2. Or upload the 'build' folder to your preferred hosting service" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to continue"