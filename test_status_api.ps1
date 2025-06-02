# Test script to check container status API

Write-Host "Testing Container Status API" -ForegroundColor Cyan

# Test different status values
$statuses = @("All", "Not Sailed", "On Vessel", "At Port", "On Rail", "Delivered", "Returned")

foreach ($status in $statuses) {
    Write-Host "`nTesting status: $status" -ForegroundColor Yellow
    
    if ($status -eq "All") {
        $url = "http://localhost:5062/api/containers?page=1&pageSize=10"
    } else {
        $encodedStatus = [System.Web.HttpUtility]::UrlEncode($status)
        $url = "http://localhost:5062/api/containers/status/$encodedStatus"
    }
    
    Write-Host "URL: $url"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get
        if ($status -eq "All") {
            Write-Host "Success! Found $($response.TotalCount) containers total" -ForegroundColor Green
        } else {
            Write-Host "Success! Found $($response.Count) containers with status '$status'" -ForegroundColor Green
        }
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $reader.BaseStream.Position = 0
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response body: $responseBody" -ForegroundColor Red
        }
    }
}

Write-Host "`n`nChecking actual status values in database..." -ForegroundColor Cyan
$url = "http://localhost:5062/api/test/status-values"
try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    Write-Host "Distinct status values in database:" -ForegroundColor Green
    $response | ForEach-Object { Write-Host " - $_" }
} catch {
    Write-Host "Could not fetch status values from test endpoint" -ForegroundColor Yellow
}