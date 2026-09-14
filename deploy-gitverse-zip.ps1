$headers = @{
    "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
    "Content-Type" = "application/json"
    "X-Skip-Source-Snapshot" = "deploy from GitHub API"
}

$deployBody = @"
{
  "source": { "url": "https://gitverse.ru/nozzless/LeadRadar/-/archive/master/LeadRadar-master.zip" },
  "runtime": "node20",
  "install": "cd /opt/app/LeadRadar-master && npm install --production",
  "start": "cd /opt/app/LeadRadar-master/backend && node server.js",
  "port": 3000,
  "displayName": "LeadRadar — Аналитика лидов",
  "description": "Дашборд для визуализации и аналитики лидов из Битрикс24. 15 метрик, графики динамики, UTM-аналитика.",
  "extractTo": "/opt/app/LeadRadar-master",
  "systemd": true
}
"@

$bytes = [System.Text.Encoding]::UTF8.GetBytes($deployBody)

try {
    $response = Invoke-WebRequest -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/e2677ee0-e3d1-4670-a674-7853f054b62b/deploy" -Method Post -Headers $headers -Body $bytes -UseBasicParsing
    Write-Host "=== DEPLOY RESULT ==="
    $response.Content
} catch {
    Write-Host "Error: $_"
}
