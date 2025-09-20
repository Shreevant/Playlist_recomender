Write-Host "Installing Google Cloud SDK..." -ForegroundColor Green
Write-Host ""

# Download the installer
$url = "https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe"
$output = "$env:TEMP\GoogleCloudSDKInstaller.exe"

Write-Host "Downloading Google Cloud SDK installer..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Running installer..." -ForegroundColor Yellow
Start-Process -FilePath $output -Wait

Write-Host ""
Write-Host "Installation complete! Please:" -ForegroundColor Green
Write-Host "1. Restart PowerShell" -ForegroundColor Cyan
Write-Host "2. Run: gcloud auth login" -ForegroundColor Cyan
Write-Host "3. Run: gcloud auth application-default login" -ForegroundColor Cyan
Write-Host "4. Run: .\deploy.ps1" -ForegroundColor Cyan

Read-Host "Press Enter to continue"