$headers = @{ "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027" }
$serverId = "e2677ee0-e3d1-4670-a674-7853f054b62b"

$body = @{
    command = "which node && node --version && which npm && npm --version && ls -la /home/app/frontend/src/components/"
    timeout = 30
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/exec" -Method POST -Headers $headers -ContentType 'application/json' -Body $body
    Write-Output ($resp | ConvertTo-Json -Depth 10)
} catch {
    Write-Error $_.Exception.Message
    Write-Error $_.ErrorDetails.Message
}
