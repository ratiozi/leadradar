$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"
$zipPath = "C:\Users\Polina\Documents\Bitrix24\LeadRadar\leads-dashboard-html-bundle.zip"

# Read zip and convert to base64
$bytes = [System.IO.File]::ReadAllBytes($zipPath)
$base64 = [Convert]::ToBase64String($bytes)
Write-Output "Zip size: $($bytes.Length) bytes, base64: $($base64.Length) chars"

# Upload via VibeCode API
$uploadBody = @{
    source = @{
        type = "inline"
        inline = @{
            format = "base64"
            content = $base64
        }
    }
    path = "/tmp/frontend-bundle.zip"
} | ConvertTo-Json -Depth 5

Write-Output "Uploading..."
try {
    $resp = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/upload" -Method POST -Headers $headers -ContentType 'application/json' -Body $uploadBody
    Write-Output "Upload OK: $($resp.success)"
} catch {
    Write-Output "Upload error: $_"
}

# Extract to frontend dist
Write-Output "`nExtracting to /opt/app/leadradar-master/frontend/dist..."
$extract = @{
    command = "cd /opt/app && mkdir -p frontend/dist && cd frontend/dist && rm -rf * && python3 -c `"import zipfile,sys; z=zipfile.ZipFile('/tmp/frontend-bundle.zip'); z.extractall('.')`" && ls -la"
    timeout = 30
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $extract
    Write-Output "Extract: $($resp.data.stdout.Substring(0, [Math]::Min(500, $resp.data.stdout.Length)))"
} catch {
    Write-Output "Extract error: $_"
}

# Check if index.html has correct encoding
Write-Output "`n=== Verify index.html ==="
$verify = @{ command = "head -c 500 /opt/app/leadradar-master/frontend/dist/index.html | grep -o 'title.*'"; timeout = 10 } | ConvertTo-Json
$resp = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $verify
Write-Output $resp.data.stdout

Write-Output "`n=== DONE ==="
