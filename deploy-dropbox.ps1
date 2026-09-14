$headers = @{
    "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
    "Content-Type" = "application/json"
    "X-Skip-Source-Snapshot" = "deploy from Dropbox"
}

$deployBody = @"
{
  "source": { "url": "https://dl.dropboxusercontent.com/scl/fi/abq8u41hlllkzbc9088sm/leadradar-archive.zip?rlkey=5da566yz3uh36tr0c4sq1o5ai&st=i3ufcuqu&dl=1" },
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

$bytes = [System.Text.Encoding]::UTF8.GetBytes($deployBody)

try {
    $response = Invoke-WebRequest -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/e2677ee0-e3d1-4670-a674-7853f054b62b/deploy" -Method Post -Headers $headers -Body $bytes -UseBasicParsing
    Write-Host "=== DEPLOY RESULT ==="
    $response.Content
} catch {
    Write-Host "Error: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        Write-Host $reader.ReadToEnd()
    }
}
