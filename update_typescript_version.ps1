# Update the package.json file to use a compatible TypeScript version

$packageJsonPath = "$PSScriptRoot\CTS\Frontend\package.json"

# Read the current package.json
$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json

# Update TypeScript version to 4.9.5 (compatible with react-scripts 5.0.1)
$packageJson.dependencies.typescript = "^4.9.5"

# Convert back to JSON and save
$packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath

Write-Host "Updated TypeScript version to ^4.9.5 in package.json"
Write-Host "Now you can run: cd $PSScriptRoot\CTS\Frontend && npm install --legacy-peer-deps"