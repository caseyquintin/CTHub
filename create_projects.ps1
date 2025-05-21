# Script to create all necessary .NET project files

# Navigate to root directory
cd $PSScriptRoot

# Create Core project
$coreProject = @"
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore.Abstractions" Version="7.0.14" />
  </ItemGroup>

</Project>
"@
Set-Content -Path "CTS\Backend\ContainerTrackingSystem.Core\ContainerTrackingSystem.Core.csproj" -Value $coreProject

# Create Data project
$dataProject = @"
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.EntityFrameworkCore" Version="7.0.14" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="7.0.14" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="7.0.14">
      <PrivateAssets>all</PrivateAssets>
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.Extensions.Configuration" Version="7.0.0" />
    <PackageReference Include="Microsoft.Extensions.Configuration.FileExtensions" Version="7.0.0" />
    <PackageReference Include="Microsoft.Extensions.Configuration.Json" Version="7.0.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\ContainerTrackingSystem.Core\ContainerTrackingSystem.Core.csproj" />
  </ItemGroup>

</Project>
"@
Set-Content -Path "CTS\Backend\ContainerTrackingSystem.Data\ContainerTrackingSystem.Data.csproj" -Value $dataProject

# Create API project
$apiProject = @"
<Project Sdk="Microsoft.NET.Sdk.Web">

  <PropertyGroup>
    <TargetFramework>net7.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="7.0.14" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="7.0.14">
      <PrivateAssets>all</PrivateAssets>
      <IncludeAssets>runtime; build; native; contentfiles; analyzers; buildtransitive</IncludeAssets>
    </PackageReference>
    <PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="7.0.14" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  </ItemGroup>

  <ItemGroup>
    <ProjectReference Include="..\ContainerTrackingSystem.Core\ContainerTrackingSystem.Core.csproj" />
    <ProjectReference Include="..\ContainerTrackingSystem.Data\ContainerTrackingSystem.Data.csproj" />
  </ItemGroup>

</Project>
"@
Set-Content -Path "CTS\Backend\ContainerTrackingSystem.API\ContainerTrackingSystem.API.csproj" -Value $apiProject

Write-Host "Project files created successfully. Now you can restore packages and run the API."