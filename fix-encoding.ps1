$srcDir = "C:\Users\Polina\Documents\Bitrix24\LeadRadar\frontend\src"
$exts = @("*.jsx","*.js","*.css")
$fixed = 0

Get-ChildItem $srcDir -Recurse -Include $exts | ForEach-Object {
    $f = $_.FullName
    $raw = [System.IO.File]::ReadAllBytes($f)
    
    # Detect double-encoded UTF-8: look for 0xD0 or 0xD1 bytes
    $double = $false
    for ($i = 0; $i -lt $raw.Length - 1; $i++) {
        if ($raw[$i] -eq 0xD0 -or $raw[$i] -eq 0xD1) { $double = $true; break }
    }
    
    if ($double) {
        # Read as UTF-8 (gives garbled text)
        $garbled = [System.Text.Encoding]::UTF8.GetString($raw)
        # Re-encode garbled text as CP1251 bytes (reverses the bad encoding)
        $cp1251 = [System.Text.Encoding]::GetEncoding(1251)
        $realBytes = $cp1251.GetBytes($garbled)
        # Now these bytes are proper UTF-8
        $utf8 = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllBytes($f, $realBytes)
        Write-Output "FIXED: $($_.Name)"
        $fixed++
    }
}

Write-Output "`nTotal fixed: $fixed"
