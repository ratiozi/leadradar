$headers = @{
    'X-Api-Key' = 'vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027'
}

try {
    $servers = Invoke-RestMethod -Uri 'https://vibecode.bitrix24.tech/v1/infra/servers' -Method GET -Headers $headers
    Write-Output ($servers | ConvertTo-Json -Depth 10)
} catch {
    Write-Error $_.Exception.Message
}
