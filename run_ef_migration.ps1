# Script to run EF migrations with full paths

$rootDir = $PSScriptRoot
$apiProjectPath = Join-Path -Path $rootDir -ChildPath "CTS\Backend\ContainerTrackingSystem.API"
$dataProjectPath = Join-Path -Path $rootDir -ChildPath "CTS\Backend\ContainerTrackingSystem.Data"

# Display current paths for verification
Write-Host "API Project Path: $apiProjectPath"
Write-Host "Data Project Path: $dataProjectPath"

# Ensure we're in the API project directory
cd $apiProjectPath

# Add required packages
Write-Host "Adding required packages..."
dotnet add package Microsoft.EntityFrameworkCore.Design
cd $dataProjectPath
dotnet add package Microsoft.EntityFrameworkCore.Design

# Return to API project
cd $apiProjectPath

# Create migration
Write-Host "Creating migration..."
dotnet ef migrations add InitialCreate --project $dataProjectPath --startup-project $apiProjectPath

# Apply migration
Write-Host "Applying migration..."
dotnet ef database update --project $dataProjectPath --startup-project $apiProjectPath

Write-Host "Migration commands completed."