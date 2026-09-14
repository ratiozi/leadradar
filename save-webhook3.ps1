$headers = @{
    "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
    "Content-Type" = "application/json"
}

$webhookUrl = "https://nskstroy.bitrix24.ru/rest/1/q8ajzohkclzl3t930c15yehotp6u78y0/"

# Upload the JS file
$jsContent = @"
const db = require('./db/init');
const stmt = db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)");
stmt.run('BITRIX_WEBHOOK_URL', '$webhookUrl');
console.log('Webhook saved:', '$webhookUrl');
"@

$jsBytes = [System.Text.Encoding]::UTF8.GetBytes($jsContent)
$jsBase64 = [Convert]::ToBase64String($jsBytes)

$uploadBody = @"
{
  "path": "/opt/app/backend/save-webhook.js",
  "content": "$jsBase64",
  "mode": "0644"
}
"@

$uploadBytes = [System.Text.Encoding]::UTF8.GetBytes($uploadBody)

try {
    Write-Host "Uploading file..."
    $uploadResp = Invoke-WebRequest -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/e2677ee0-e3d1-4670-a674-7853f054b62b/upload" -Method Post -Headers $headers -Body $uploadBytes -UseBasicParsing
    Write-Host "Upload result:"
    $uploadResp.Content
    
    # Now execute the script
    Write-Host "`nExecuting script..."
    $execBody = @{
        command = "cd /opt/app/backend && node save-webhook.js"
        timeout = 30
    } | ConvertTo-Json
    $execBytes = [System.Text.Encoding]::UTF8.GetBytes($execBody)
    
    $execResp = Invoke-WebRequest -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/e2677ee0-e3d1-4670-a674-7853f054b62b/exec" -Method Post -Headers $headers -Body $execBytes -UseBasicParsing
    Write-Host "Exec result:"
    $execResp.Content
} catch {
    Write-Host "Error: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        Write-Host $reader.ReadToEnd()
    }
}
