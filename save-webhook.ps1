$headers = @{
    "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
    "Content-Type" = "application/json"
}

$webhookUrl = "https://nskstroy.bitrix24.ru/rest/1/q8ajzohkclzl3t930c15yehotp6u78y0/"

$deployBody = @"
{
  "webhookUrl": "$webhookUrl"
}
"@

$bytes = [System.Text.Encoding]::UTF8.GetBytes($deployBody)

try {
    $response = Invoke-WebRequest -Uri "https://app-e2677ee0-e3d1-4670-a674-7853f054b62b.vibecode.bitrix24.tech/api/config" -Method Post -Headers $headers -Body $bytes -UseBasicParsing
    Write-Host "=== CONFIG SAVED ==="
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
