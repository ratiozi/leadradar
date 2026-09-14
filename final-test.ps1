$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

# Test
Write-Output "=== Test ==="
$test = @{
    command = "curl -s http://localhost:3000/api/health && echo '' && curl -s http://localhost:3000/ | grep -o '<title>.*</title>'"
    timeout = 10
} | ConvertTo-Json

$r = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $test
Write-Output $r.data.stdout

Write-Output "`n=== DONE - check in browser ==="
