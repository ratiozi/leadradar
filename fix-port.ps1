$headers = @{
    "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
    "Content-Type" = "application/json"
}

$body = @{
    command = "fuser -k 3000/tcp && systemctl restart app && sleep 3 && systemctl status app"
    timeout = 60
}
$bytes = [System.Text.Encoding]::UTF8.GetBytes(($body | ConvertTo-Json))

try {
    $response = Invoke-WebRequest -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/e2677ee0-e3d1-4670-a674-7853f054b62b/exec" -Method Post -Headers $headers -Body $bytes -UseBasicParsing
    Write-Host "=== KILL + RESTART ==="
    $response.Content
} catch {
    Write-Host "Error: $_"
}
