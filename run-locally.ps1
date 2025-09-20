Write-Host "AI Career Playlist Builder - Local Development Setup" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Setting up for LOCAL development (no Google Cloud billing required)" -ForegroundColor Yellow
Write-Host ""

# Setup backend
Write-Host "Setting up backend..." -ForegroundColor Cyan
Set-Location backend

Write-Host "Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv

Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

Write-Host "Installing minimal dependencies..." -ForegroundColor Yellow
pip install functions-framework requests

Write-Host "Setting environment variables..." -ForegroundColor Yellow
$env:YOUTUBE_API_KEY = "AIzaSyD3KLZWifSjKJDQeepHtgWNUiSeN72OSCo"
$env:GCP_PROJECT = "gen-a-472705"

Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; & venv\Scripts\Activate.ps1; `$env:YOUTUBE_API_KEY='AIzaSyD3KLZWifSjKJDQeepHtgWNUiSeN72OSCo'; functions-framework --target=career_playlist --debug"

Start-Sleep 3
Set-Location ..

# Setup frontend
Write-Host "Setting up frontend..." -ForegroundColor Cyan
Set-Location frontend

Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Creating local environment file..." -ForegroundColor Yellow
"REACT_APP_API_URL=http://localhost:8080" | Out-File -FilePath .env -Encoding utf8

Write-Host "Starting frontend..." -ForegroundColor Yellow
npm start

Write-Host ""
Write-Host "Local development setup complete!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan