$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Step 1: Check if python3 is available
Write-Output "=== Step 1: Check python3 ==="
$check = @{ command = "which python3"; timeout = 10 } | ConvertTo-Json
$r1 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $check
Write-Output $r1.data.stdout

# Step 2: Fix encoding and rebuild
Write-Output "`n=== Step 2: Fix encoding + rebuild ==="
$fixScript = @'
cd /opt/app/frontend

# Fix double-encoded UTF-8 in all frontend files
find src -name "*.jsx" -o -name "*.js" -o -name "*.css" | while read f; do
  python3 << PYEOF
import codecs
with open('$f', 'rb') as fh:
    data = fh.read()
try:
    text = data.decode('utf-8')
    real_bytes = codecs.getencoder('cp1251')(text)[0]
    result = real_bytes.decode('utf-8')
    with open('$f', 'w', encoding='utf-8') as fh:
        fh.write(result)
    print(f'Fixed: $f')
except Exception as e:
    print(f'Skipped $f: {e}')
PYEOF
done

echo "--- Encoding fixed ---"

# Build frontend
npm run build 2>&1
echo "BUILD_EXIT=$?"
'@

$body = @{ command = $fixScript; timeout = 180 } | ConvertTo-Json
$r2 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $body
Write-Output "Exit: $($r2.data.exitCode)"
Write-Output "Out: $($r2.data.stdout)"
if ($r2.data.stderr) { Write-Output "Err: $($r2.data.stderr)" }

# Step 3: Restart backend
Write-Output "`n=== Step 3: Restart backend ==="
$restart = @{ command = "cd /opt/app/backend && pm2 restart leadradar-backend 2>/dev/null || (pkill -f 'node server.js' && cd /opt/app/backend && nohup node server.js > /tmp/backend.log 2>&1 &) && sleep 2 && cat /tmp/backend.log"; timeout = 30 } | ConvertTo-Json
$r3 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $restart
Write-Output $r3.data.stdout

Write-Output "`n=== DONE ==="
