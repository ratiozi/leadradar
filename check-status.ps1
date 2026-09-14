$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Check systemd status
Write-Output "=== Systemd status ==="
$s1 = @{ command = "systemctl status app 2>&1 || true"; timeout = 15 } | ConvertTo-Json
$r1 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $s1
Write-Output $r1.data.stdout

# Check logs
Write-Output "`n=== App logs (last 50 lines) ==="
$s2 = @{ command = "journalctl -u app -n 50 --no-pager 2>&1"; timeout = 15 } | ConvertTo-Json
$r2 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $s2
Write-Output $r2.data.stdout

# Check if port 3000 is in use
Write-Output "`n=== Port 3000 ==="
$s3 = @{ command = "ss -tlnp | grep 3000 || echo 'Port 3000 free'"; timeout = 10 } | ConvertTo-Json
$r3 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $s3
Write-Output $r3.data.stdout

# Try to start manually
Write-Output "`n=== Manual start ==="
$s4 = @{ command = "cd /opt/app/leadradar-master/backend && node server.js 2>&1 &"; timeout = 5 } | ConvertTo-Json
$r4 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $s4
Write-Output $r4.data.stdout

Write-Output "`n=== DONE ==="
