$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Check what's happening
Write-Output "=== PM2 logs ==="
$logs = @{
    command = "pm2 logs leadradar-backend --lines 30 --nostream"
    timeout = 15
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $logs
Write-Output $r.data.stdout

# Check port
Write-Output "`n=== Port check ==="
$port = @{
    command = "ss -tlnp | grep 3000 || echo 'NOT LISTENING'; ps aux | grep node | grep -v grep"
    timeout = 10
} | ConvertTo-Json

$r2 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $port
Write-Output $r2.data.stdout

Write-Output "`n=== DONE ==="
