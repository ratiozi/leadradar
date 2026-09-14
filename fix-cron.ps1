$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Fix the cron line in server.js
Write-Output "=== Fix cron line ==="
$fix = @{
    command = @"
cd /opt/app/leadradar-master/backend

# Fix the broken cron schedule line
sed -i 's/syncCron = cron.schedule(\\\\\*\\\\\/\\\\\ \\\\* \\\\* \\\\* \\\\*,/syncCron = cron.schedule("*\* * * *",/' server.js

# Show the problematic line
grep -n 'cron.schedule' server.js

# Restart
pm2 restart leadradar-backend
sleep 3

# Check
pm2 logs leadradar-backend --lines 10 --nostream
"@
    timeout = 30
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $fix
Write-Output $r.data.stdout

Write-Output "`n=== DONE ==="
