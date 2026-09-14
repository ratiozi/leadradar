$apiToken = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"
$zipPath = "C:/Users/Polina/Documents/Bitrix24/LeadRadar/leadradar-frontend.zip"
$projectRoot = "C:/Users/Polina/Documents/Bitrix24/LeadRadar"

# Create zip of frontend source
Set-Location "$projectRoot/frontend"
Compress-Archive -Path "src","index.html","package.json","vite.config.js","postcss.config.js","tailwind.config.js" -DestinationPath $zipPath -Force

Write-Output "Zip created: $((Get-Item $zipPath).Length) bytes"

# Upload to VibeCode
$headers = @{ "X-Api-Key" = $apiToken }
$uploadBody = @{
    source = @{
        type = "archive"
        archive = @{
            format = "zip"
        }
    }
}

Write-Output "Uploading..."
$uploadResp = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/upload" -Method POST -Headers $headers -ContentType 'application/json' -Body (ConvertTo-Json $uploadBody)

Write-Output "Upload response: $uploadResp"
