$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Test the app
Write-Output "=== Test app ==="
$test = @{
    command = @"
# Test health
echo "--- Health ---"
curl -s http://localhost:3000/api/health

# Test index.html serving
echo ""
echo "--- Index HTML ---"
curl -s http://localhost:3000/ | head -c 300

# Check if title is correct
echo ""
echo "--- Title ---"
curl -s http://localhost:3000/ | grep -o '<title>.*</title>'

# Test API
echo "--- API ---"
curl -s http://localhost:3000/api/config
"@
    timeout = 15
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $test
Write-Output $r.data.stdout

Write-Output "`n=== DONE ==="
