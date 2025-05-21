# Manual Backend Setup Script

# Change to the root directory
cd "$PSScriptRoot"

# Create solution file
dotnet new sln -n ContainerTrackingSystem

# Create projects
dotnet new webapi -n ContainerTrackingSystem.API -o CTS\Backend\ContainerTrackingSystem.API
dotnet new classlib -n ContainerTrackingSystem.Core -o CTS\Backend\ContainerTrackingSystem.Core
dotnet new classlib -n ContainerTrackingSystem.Data -o CTS\Backend\ContainerTrackingSystem.Data

# Add projects to solution
dotnet sln add CTS\Backend\ContainerTrackingSystem.API\ContainerTrackingSystem.API.csproj
dotnet sln add CTS\Backend\ContainerTrackingSystem.Core\ContainerTrackingSystem.Core.csproj
dotnet sln add CTS\Backend\ContainerTrackingSystem.Data\ContainerTrackingSystem.Data.csproj

# Add references between projects
dotnet add CTS\Backend\ContainerTrackingSystem.API\ContainerTrackingSystem.API.csproj reference CTS\Backend\ContainerTrackingSystem.Core\ContainerTrackingSystem.Core.csproj
dotnet add CTS\Backend\ContainerTrackingSystem.API\ContainerTrackingSystem.API.csproj reference CTS\Backend\ContainerTrackingSystem.Data\ContainerTrackingSystem.Data.csproj
dotnet add CTS\Backend\ContainerTrackingSystem.Data\ContainerTrackingSystem.Data.csproj reference CTS\Backend\ContainerTrackingSystem.Core\ContainerTrackingSystem.Core.csproj

# Add required packages
cd CTS\Backend\ContainerTrackingSystem.API
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Swashbuckle.AspNetCore

cd ..\ContainerTrackingSystem.Data
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools

# Copy our model files to appropriate directories
# (This would normally copy the files we created earlier)

Write-Host "Backend project structure created. Now copy the model files."