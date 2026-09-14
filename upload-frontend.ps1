$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"
$frontendSrc = "C:\Users\Polina\Documents\Bitrix24\LeadRadar\frontend"
$zipPath = "C:\Users\Polina\Documents\Bitrix24\LeadRadar\frontend-src.zip"

# Create zip of frontend source
Set-Location $frontendSrc
Compress-Archive -Path "src","index.html","package.json","vite.config.js","postcss.config.js","tailwind.config.js" -DestinationPath $zipPath -Force

Write-Output "Zip size: $((Get-Item $zipPath).Length) bytes"

# Read zip as base64
$zipBytes = [System.IO.File]::ReadAllBytes($zipPath)
$zipBase64 = [Convert]::ToBase64String($zipBytes)

Write-Output "Base64 length: $($zipBase64.Length)"

# Upload via VibeCode API
$uploadBody = @{
    source = @{
        type = "inline"
        inline = @{
            format = "base64"
            content = $zipBase64
        }
    }
} | ConvertTo-Json -Depth 5

Write-Output "Uploading..."
try {
    $uploadResp = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/upload" -Method POST -Headers $headers -ContentType 'application/json' -Body $uploadBody
    Write-Output "Upload: $($uploadResp | ConvertTo-Json -Depth 3)"
} catch {
    Write-Error $_.Exception.Message
}
