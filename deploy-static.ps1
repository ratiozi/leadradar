$headers = @{
    "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
    "Content-Type" = "application/json"
    "X-Skip-Source-Snapshot" = "deploy static frontend from Dropbox"
}

$deployBody = @"
{
  "source": { "url": "https://dl.dropboxusercontent.com/scl/fi/iyvei533af5mrui902oi6/leads-dashboard-html.zip?rlkey=pl7ukc3e59fp1to3fqlkrw0qo&st=o91c4xoy&dl=1" },
  "runtime": "node20",
  "install": "",
  "start": "echo no backend needed",
  "port": 3000,
  "displayName": "LeadRadar — Аналитика лидов",
  "description": "Static frontend deployment",
  "extractTo": "/opt/app/leadradar-master/frontend/dist",
  "systemd": false
}
"@

$bytes = [System.Text.Encoding]::UTF8.GetBytes($deployBody)

try {
    $response = Invoke-WebRequest -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/e2677ee0-e3d1-4670-a674-7853f054b62b/deploy" -Method Post -Headers $headers -Body $bytes -UseBasicParsing
    Write-Host "Deploy started!"
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
