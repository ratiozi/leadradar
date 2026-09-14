$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Fix encoding on server
Write-Output "=== Fixing encoding on server ==="
$fixScript = @'
cd /opt/app/leadradar-master/frontend/dist

# Fix double-encoded UTF-8 in all files
find . -type f \( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.txt" \) | while read f; do
  python3 << PYEOF
import os, sys
path = '$f'
with open(path, 'rb') as fh:
    data = fh.read()

# Check if file contains double-encoded UTF-8 (0xD0 or 0xD1 bytes)
has_double = False
for i in range(len(data) - 1):
    if data[i] == 0xD0 or data[i] == 0xD1:
        has_double = True
        break

if has_double:
    try:
        # Read as UTF-8 (gives garbled text)
        text = data.decode('utf-8')
        # Re-encode as CP1251 to get original bytes
        cp1251 = __import__('codecs').getencoder('cp1251')
        real_bytes = cp1251(text)[0]
        # Decode as proper UTF-8
        result = real_bytes.decode('utf-8')
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(result)
        print(f'Fixed: {path}')
    except Exception as e:
        print(f'Error {path}: {e}')
else:
    print(f'Skipped (already OK): {path}')
PYEOF
done

echo "--- Encoding fix done ---"

# Verify
echo "=== Verification ==="
grep -o '<title>.*</title>' index.html | head -1
'@

$body = @{
    command = $fixScript
    timeout = 60
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $body
Write-Output "Exit: $($r.data.exitCode)"
Write-Output $r.data.stdout

Write-Output "`n=== DONE ==="
