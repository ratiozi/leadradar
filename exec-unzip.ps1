$headers = @{
    "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
    "Content-Type" = "application/json"
}

# Step 1: Unzip
$body1 = @{
    command = "unzip -o /tmp/leadradar.zip -d /opt/app/ && ls -la /opt/app/"
    timeout = 60
}
$bytes1 = [System.Text.Encoding]::UTF8.GetBytes(($body1 | ConvertTo-Json))
$response1 = Invoke-WebRequest -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/e2677ee0-e3d1-4670-a674-7853f054b62b/exec" -Method Post -Headers $headers -Body $bytes1 -UseBasicParsing
Write-Host "=== UNZIP RESULT ==="
$response1.Content
