$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Check what files exist
Write-Output "=== Check files ==="
$check = @{
    command = @"
cd /opt/app/leadradar-master/frontend/src
echo "=== Components ==="
ls -la components/
echo "=== Hooks ==="
ls -la hooks/
echo "=== Styles ==="
ls -la styles/
echo "=== Root files ==="
ls -la *.jsx *.js *.css 2>/dev/null || echo "none"
echo "=== Check Dashboard.jsx encoding ==="
python3 -c "
data = open('components/Dashboard.jsx', 'rb').read()
print('Size:', len(data))
print('Has D0:', 0xD0 in data)
print('Has D1:', 0xD1 in data)
# Show first 200 bytes as hex
print('First 200 hex:', data[:200].hex())
"
"@
    timeout = 15
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $check
Write-Output $r.data.stdout

Write-Output "`n=== DONE ==="
