$file = "C:/Users/Polina/Documents/Bitrix24/LeadRadar/frontend/src/components/Dashboard.jsx"
$bytes = [System.IO.File]::ReadAllBytes($file)

# Find the h1 line and show bytes around it
for ($i = 0; $i -lt $bytes.Length; $i++) {
    if ($bytes[$i] -eq 0x68 -and $bytes[$i+1] -eq 0x65 -and $bytes[$i+2] -eq 0x6c) {
        Write-Output "Found 'hel' at offset $i"
        $chunk = $bytes[($i-5)..($i+50)]
        $chunk | ForEach-Object { Write-Output "{0:X2}" -f $_ }
        break
    }
}
