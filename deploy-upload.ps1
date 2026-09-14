# Upload file to VibeCode
$content = Get-Content "C:/Users/Polina/Documents/Bitrix24/LeadRadar/archive-b64.txt" -Raw
# Remove newlines from base64
$content = $content -replace '\r?\n', ''
# Escape for JSON
$escaped = $content -replace '\\', '\\\\' -replace '"', '\"'
$jsonBody = @"
{
  "path": "/opt/app/leadradar.zip",
  "content": "$escaped",
  "extract": true,
  "extractTo": "/opt/app"
}
"@

Write-Host "JSON length: $($jsonBody.Length)"

$headers = @{
    "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/e2677ee0-e3d1-4670-a674-7853f054b62b/upload" -Method Post -Headers $headers -Body $jsonBody
    Write-Host "Success!"
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: $_"
}
