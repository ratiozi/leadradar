$headers = @{
    'X-Api-Key' = 'vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027'
}

$serverId = 'e2677ee0-e3d1-4670-a674-7853f054b62b'

# Create token
$body = @{ mode = 'api-bearer'; ttlSeconds = 3600 } | ConvertTo-Json
$token = (Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/$serverId/access-tokens" -Method POST -Headers $headers -ContentType 'application/json' -Body $body).data.token

$authHeaders = @{ 'Authorization' = "Bearer $token" }
$appUrl = 'https://app-65a813be87d7.vibecode.bitrix24.tech'

# Check what files are served
Write-Output "=== Fetching index.html ==="
$html = Invoke-RestMethod -Uri "$appUrl/" -Headers $authHeaders -UseBasicParsing
Write-Output $html.Substring(0, [Math]::Min(2000, $html.Length))

# Check if there's a JS error by looking at the page title
Write-Output "`n=== Page title ==="
if ($html -match '<title>(.*?)</title>') {
    Write-Output $matches[1]
}
