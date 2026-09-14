$headers = @{
    "X-Api-Key" = "vibe_api_tDCw5urXF1inGgWgAJjfyQlNCnfAKaRF_8cb027"
    "Content-Type" = "application/json"
}

$body = @{
    command = "curl -L -o /tmp/leadradar.zip https://github.com/ratiozi/leadradar/archive/refs/heads/master.zip && ls -la /tmp/leadradar.zip"
    timeout = 120
}

$bytes = [System.Text.Encoding]::UTF8.GetBytes(($body | ConvertTo-Json))

try {
    $response = Invoke-WebRequest -Uri "https://vibecode.bitrix24.tech/v1/infra/servers/e2677ee0-e3d1-4670-a674-7853f054b62b/exec" -Method Post -Headers $headers -Body $bytes -UseBasicParsing
    Write-Host "Exec result:"
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
