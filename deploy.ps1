$deployBody = @"
{
  "source": { "url": "https://gitverse.ru/nozzless/LeadRadar/archive/master.tar.gz" },
  "runtime": "node20",
  "install": "cd /opt/app && npm install --production",
  "start": "cd /opt/app/backend && node server.js",
  "port": 3000,
  "displayName": "LeadRadar — Аналитика лидов",
  "description": "Дашборд для визуализации и аналитики лидов из Битрикс24. 15 метрик, графики динамики, UTM-аналитика.",
  "extractTo": "/opt/app",
  "systemd": true
}
"@

$headers = @{
    "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/e2677ee0-e3d1-4670-a674-7853f054b62b/deploy" -Method Post -Headers $headers -Body $deployBody
    Write-Host "Deploy started!"
    $response | ConvertTo-Json
} catch {
    Write-Host "Error: $_"
}
