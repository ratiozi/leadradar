$headers = @{
    "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
    "Content-Type" = "application/json"
}

$webhookUrl = "https://nskstroy.bitrix24.ru/rest/1/q8ajzohkclzl3t930c15yehotp6u78y0/"

$body = @{
    command = "cd /opt/app/backend && node -e `"const db = require('./db/init'); db.prepare(\\\"INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)\\\").run('BITRIX_WEBHOOK_URL', '$webhookUrl'); console.log('Webhook saved:', '$webhookUrl');`""
    timeout = 30
}
$bytes = [System.Text.Encoding]::UTF8.GetBytes(($body | ConvertTo-Json))

try {
    $response = Invoke-WebRequest -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/e2677ee0-e3d1-4670-a674-7853f054b62b/exec" -Method Post -Headers $headers -Body $bytes -UseBasicParsing
    Write-Host "=== WEBHOOK SAVED ==="
    $response.Content
} catch {
    Write-Host "Error: $_"
}
