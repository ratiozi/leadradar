$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Check if frontend dist exists
Write-Output "=== Check frontend dist ==="
$check = @{ command = "ls -la /opt/app/leadradar-master/frontend/dist/ 2>&1 || echo 'NO_DIST'"; timeout = 10 } | ConvertTo-Json
$r1 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $check
Write-Output $r1.data.stdout

# Check if backend serves frontend
Write-Output "`n=== Check backend routes ==="
$check2 = @{ command = "ls -la /opt/app/leadradar-master/frontend/ 2>&1"; timeout = 10 } | ConvertTo-Json
$r2 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $check2
Write-Output $r2.data.stdout

# Check server health
Write-Output "`n=== Health check via exec ==="
$health = @{ command = "curl -s http://localhost:3000/api/health"; timeout = 10 } | ConvertTo-Json
$r3 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $health
Write-Output $r3.data.stdout

Write-Output "`n=== DONE ==="
