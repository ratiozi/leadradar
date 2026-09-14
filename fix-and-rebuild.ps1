$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Fix encoding on server + rebuild frontend
$fixScript = @'
cd /opt/app/frontend

# Fix double-encoded UTF-8 in JSX files
for f in src/components/*.jsx src/hooks/*.js src/styles/*.css; do
  if [ -f "$f" ]; then
    # Check if file has double-encoded UTF-8 (contains 0xD0 or 0xD1 bytes)
    if file "$f" | grep -q "UTF-8 Unicode"; then
      # Read as UTF-8, re-encode as CP1251, then decode as UTF-8
      python3 -c "
import sys
with open('$f', 'rb') as fh:
    data = fh.read()
try:
    text = data.decode('utf-8')
    cp1251 = __import__('codecs').getencoder('cp1251')
    real_bytes = cp1251(text)[0]
    result = real_bytes.decode('utf-8')
    with open('$f', 'w', encoding='utf-8') as fh:
        fh.write(result)
    print(f'Fixed: $f')
except:
    print(f'Skipped (already OK): $f')
" 2>/dev/null || echo "Python not available for $f"
    fi
  fi
done

echo "--- Fixing encoding done ---"

# Build frontend
npm run build 2>&1
echo "--- Build exit code: $? ---"
'@

$body = @{
    command = $fixScript
    timeout = 120
} | ConvertTo-Json

Write-Output "Running fix + build on server..."
try {
    $resp = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $body
    Write-Output "Exit code: $($resp.data.exitCode)"
    Write-Output "STDOUT: $($resp.data.stdout)"
    if ($resp.data.stderr) { Write-Output "STDERR: $($resp.data.stderr)" }
} catch {
    Write-Error $_.Exception.Message
    Write-Error $_.ErrorDetails.Message
}
