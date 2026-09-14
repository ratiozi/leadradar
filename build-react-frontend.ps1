$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Step 1: Fix encoding of React frontend files on server
Write-Output "=== Step 1: Fix encoding ==="
$fix = @{
    command = @"
cd /opt/app/leadradar-master/frontend/src
find . -name '*.jsx' -o -name '*.js' -o -name '*.css' | while read f; do
  python3 -c "
import sys
try:
    with open(sys.argv[1], 'rb') as fh:
        data = fh.read()
    has_d0d1 = any(b == 0xD0 or b == 0xD1 for b in data[:2000])
    if has_d0d1:
        text = data.decode('utf-8', errors='replace')
        real_bytes = text.encode('latin-1')
        result = real_bytes.decode('utf-8')
        with open(sys.argv[1], 'wb') as fh:
            fh.write(result.encode('utf-8'))
        print('Fixed:', sys.argv[1])
    else:
        print('Skip:', sys.argv[1])
except Exception as e:
    print('Error', sys.argv[1], e)
" "$f"
done
echo "--- Done ---"
grep -c 'function' /opt/app/leadradar-master/frontend/src/components/Dashboard.jsx
"@
    timeout = 30
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $fix
Write-Output $r.data.stdout

# Step 2: Build
Write-Output "`n=== Step 2: Build ==="
$build = @{
    command = "cd /opt/app/leadradar-master/frontend && npm config delete registry && npm install --registry https://registry.npmjs.org 2>&1 | tail -3 && npm run build 2>&1 | tail -10 && echo BUILD_OK"
    timeout = 300
} | ConvertTo-Json

$r2 = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $build
Write-Output "Exit: $($r2.data.exitCode)"
Write-Output $r2.data.stdout

Write-Output "`n=== DONE ==="
