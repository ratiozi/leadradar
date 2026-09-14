$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Create token and check
Write-Output "=== Create token ==="
$tokenBody = @{ mode = 'api-bearer'; ttlSeconds = 3600 } | ConvertTo-Json
$token = (Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/access-tokens" -Method POST -Headers $headers -ContentType 'application/json' -Body $tokenBody).data.token

# Check raw bytes via the subdomain
Write-Output "`n=== Check via subdomain ==="
$check = @{
    command = "python3 -c \"
data = open('/opt/app/leadradar-master/frontend/dist/index.html', 'rb').read()
idx = data.find(b'<title>')
chunk = data[idx:idx+80]
print('Hex:', chunk.hex())
# Try to decode
try:
    text = chunk.decode('utf-8')
    print('UTF-8:', text)
except:
    print('Not valid UTF-8')
\""
    timeout = 10
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $check
Write-Output $r.data.stdout

Write-Output "`n=== DONE ==="
