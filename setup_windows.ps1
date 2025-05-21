# Windows Setup Script for Container Tracking System

# Check for .NET SDK
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    Write-Host "Installing .NET SDK..."
    # Download .NET SDK installer and run it
    Invoke-WebRequest -Uri "https://dot.net/v1/dotnet-install.ps1" -OutFile "dotnet-install.ps1"
    ./dotnet-install.ps1 -Channel 7.0
    
    # Add to PATH for current session
    $env:Path += ";$env:USERPROFILE\.dotnet"
    
    Write-Host ".NET SDK installed. You may need to restart your terminal."
} else {
    Write-Host ".NET SDK already installed."
}

# Check for Node.js
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not found. Please install Node.js from https://nodejs.org/"
    exit
}

# Setup Backend
Write-Host "Setting up backend..."
cd "$PSScriptRoot\CTS\Backend\ContainerTrackingSystem.API"

# Create user secrets for connection string (safer than modifying appsettings.json)
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=(localdb)\MSSQLLocalDB;Database=ContainerTrackingSystem;Trusted_Connection=True;MultipleActiveResultSets=true"

# Install Entity Framework tools if needed
dotnet tool install --global dotnet-ef
dotnet add package Microsoft.EntityFrameworkCore.Design

# Create and apply migrations
dotnet ef migrations add InitialCreate -p ..\ContainerTrackingSystem.Data
dotnet ef database update

# Setup Frontend
Write-Host "Setting up frontend..."
cd "$PSScriptRoot\CTS\Frontend"

# Install dependencies
npm install

# Create .env file
Set-Content -Path .env -Value "REACT_APP_API_URL=https://localhost:7243/api"

Write-Host "Setup completed!"
Write-Host "To start the backend, run: cd $PSScriptRoot\CTS\Backend\ContainerTrackingSystem.API && dotnet run"
Write-Host "To start the frontend, run: cd $PSScriptRoot\CTS\Frontend && npm start"