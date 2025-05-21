# Add necessary packages for Entity Framework migrations

# Navigate to the Data project
cd "$PSScriptRoot\CTS\Backend\ContainerTrackingSystem.Data"

# Add Entity Framework packages
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.Extensions.Configuration
dotnet add package Microsoft.Extensions.Configuration.FileExtensions
dotnet add package Microsoft.Extensions.Configuration.Json

# Navigate to the API project
cd "$PSScriptRoot\CTS\Backend\ContainerTrackingSystem.API"

# Add Entity Framework packages
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

Write-Host "Entity Framework packages added successfully."
Write-Host "Now you can run: dotnet ef migrations add InitialCreate --project ..\ContainerTrackingSystem.Data"