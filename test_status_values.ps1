# Test script to check actual status values in database

Write-Host "Checking status values in database..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5062/api/test/status-values" -Method Get
    
    Write-Host "`nDistinct status values:" -ForegroundColor Yellow
    $response.DistinctStatuses | ForEach-Object { Write-Host " - '$_'" }
    
    Write-Host "`nStatus counts:" -ForegroundColor Yellow
    $response.StatusCounts | ForEach-Object { 
        Write-Host " - $($_.Status): $($_.Count) containers" 
    }
    
    Write-Host "`nTotal containers: $($response.TotalContainers)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n`nTesting 'On Vessel' status specifically..." -ForegroundColor Cyan
$encodedStatus = [System.Web.HttpUtility]::UrlEncode("On Vessel")
$url = "http://localhost:5062/api/containers/status/$encodedStatus"
Write-Host "URL: $url"

try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    Write-Host "Success! Found $($response.Count) containers" -ForegroundColor Green
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