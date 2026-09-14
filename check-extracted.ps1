$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Check what was extracted
Write-Output "=== Check extracted files ==="
$check = @{
    command = "ls -la /opt/app/leadradar-master/frontend/dist/ && echo '---' && head -c 300 /opt/app/leadradar-master/frontend/dist/index.html"
    timeout = 15
} | ConvertTo-Json

$r1 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $check
Write-Output $r1.data.stdout

# Check if index.html has correct encoding
Write-Output "`n=== Check encoding ==="
$enc = @{
    command = "file /opt/app/leadradar-master/frontend/dist/index.html && grep -o '<title>.*</title>' /opt/app/leadradar-master/frontend/dist/index.html"
    timeout = 10
} | ConvertTo-Json

$r2 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $enc
Write-Output $r2.data.stdout

Write-Output "`n=== DONE ==="
