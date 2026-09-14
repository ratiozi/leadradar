$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Check raw bytes of the title
Write-Output "=== Raw bytes check ==="
$check = @{
    command = "python3 -c \"
data = open('/opt/app/leadradar-master/frontend/dist/index.html', 'rb').read()
# Find '<title>' and show next 100 bytes
idx = data.find(b'<title>')
if idx >= 0:
    chunk = data[idx:idx+100]
    print('Hex:', chunk.hex())
    print('Bytes:', [hex(b) for b in chunk[:80]])
    print('Len:', len(chunk))
\""
    timeout = 10
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $check
Write-Output $r.data.stdout

# Also check the zip file on server
Write-Output "`n=== Check zip ==="
$check2 = @{
    command = "find /opt -name '*.zip' -not -path '*/node_modules/*' 2>/dev/null"
    timeout = 10
} | ConvertTo-Json

$r2 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $check2
Write-Output $r2.data.stdout

Write-Output "`n=== DONE ==="
