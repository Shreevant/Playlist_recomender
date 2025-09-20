Write-Host "Google Cloud SDK Setup for AI Career Playlist Builder" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

Write-Host "This script will help you set up Google Cloud SDK for deployment." -ForegroundColor Yellow
Write-Host ""

# Check if gcloud is already installed
$gcloudInstalled = $false
try {
    $null = Get-Command gcloud -ErrorAction Stop
    $gcloudInstalled = $true
    Write-Host "✓ Google Cloud SDK is already installed!" -ForegroundColor Green
    Write-Host ""
    
    # Check authentication
    try {
        $authStatus = gcloud auth list --filter="status:ACTIVE" --format="value(account)" 2>$null
        if ([string]::IsNullOrWhiteSpace($authStatus)) {
            Write-Host "Setting up authentication..." -ForegroundColor Yellow
            gcloud auth login
            gcloud auth application-default login
        } else {
            Write-Host "✓ Already authenticated as: $authStatus" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "Setting up authentication..." -ForegroundColor Yellow
        gcloud auth login
        gcloud auth application-default login
    }
    
    Write-Host ""
    Write-Host "Google Cloud SDK is ready! You can now run:" -ForegroundColor Green
    Write-Host ".\deploy.ps1" -ForegroundColor Cyan
}
catch {
    Write-Host "Google Cloud SDK is not installed. Let's set it up!" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "Step 1: Download Google Cloud SDK" -ForegroundColor Cyan
    Write-Host "Opening download page in your browser..." -ForegroundColor Yellow
    Start-Process "https://cloud.google.com/sdk/docs/install-sdk#windows"
    
    Write-Host ""
    Write-Host "Manual Installation Steps:" -ForegroundColor Yellow
    Write-Host "1. Download the Google Cloud SDK installer from the opened page" -ForegroundColor White
    Write-Host "2. Run the installer (GoogleCloudSDKInstaller.exe)" -ForegroundColor White
    Write-Host "3. Follow the installation wizard" -ForegroundColor White
    Write-Host "4. When prompted, check 'Run gcloud init'" -ForegroundColor White
    Write-Host "5. Restart PowerShell after installation" -ForegroundColor White
    Write-Host "6. Run this script again to complete setup" -ForegroundColor White
    
    Write-Host ""
    Write-Host "Alternative: Install via Chocolatey (if you have it):" -ForegroundColor Yellow
    Write-Host "choco install gcloudsdk" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Press Enter to continue"