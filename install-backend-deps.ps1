$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Install backend deps
Write-Output "=== Installing backend deps ==="
$install = @{
    command = "cd /opt/app/leadradar-master/backend && npm install dotenv express better-sqlite3 cors node-cron 2>&1 && echo INSTALL_DONE"
    timeout = 120
} | ConvertTo-Json

$r1 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $install
Write-Output $r1.data.stdout

# Check node_modules
Write-Output "`n=== Check node_modules ==="
$check = @{ command = "ls /opt/app/leadradar-master/backend/node_modules/dotenv/package.json && echo OK"; timeout = 10 } | ConvertTo-Json
$r2 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $check
Write-Output $r2.data.stdout

# Kill any stuck processes
Write-Output "`n=== Kill stuck processes ==="
$kill = @{ command = "fuser -k 3000/tcp 2>/dev/null; sleep 1; echo killed"; timeout = 10 } | ConvertTo-Json
$r3 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $kill
Write-Output $r3.data.stdout

# Restart systemd service
Write-Output "`n=== Restart app service ==="
$restart = @{ command = "systemctl restart app && sleep 3 && systemctl status app --no-pager | head -10"; timeout = 30 } | ConvertTo-Json
$r4 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $restart
Write-Output $r4.data.stdout

Write-Output "`n=== DONE ==="
