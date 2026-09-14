$headers = @{
    'X-Api-Key' = 'vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027'
}

$body = @{
    ttl = 3600
} | ConvertTo-Json

try {
    $resp = Invoke-RestMethod -Uri 'https://vibecode.bitrix24.tech/v1/infra/e2677ee0-e3d1-4670-a674-7853f054b624/access-tokens' -Method POST -Headers $headers -ContentType 'application/json' -Body $body
    Write-Output ($resp | ConvertTo-Json)
} catch {
    Write-Error $_.Exception.Message
}
