# Convert all JSX/JS/CSS/HTML files from Windows-1251 to UTF-8
$frontendDir = "C:/Users/Polina/Documents/Bitrix24/LeadRadar/frontend/src"
$extensions = @('*.jsx', '*.js', '*.css', '*.html')
$count = 0

Get-ChildItem -Path $frontendDir -Recurse -Include $extensions | ForEach-Object {
    $file = $_.FullName
    $content = [System.IO.File]::ReadAllText($file)
    
    # Try to detect if file contains Windows-1251 encoded UTF-8
    # Read bytes and check if they look like double-encoded UTF-8
    $bytes = [System.IO.File]::ReadAllBytes($file)
    
    # Check if file contains non-ASCII bytes that look like double-encoded UTF-8
    $text = [System.Text.Encoding]::Default.GetString($bytes)
    
    # Check for common double-encoding patterns (characters like в,Ђ, Р, etc.)
    if ($text -match '[вР][ЂЅЅЉЅ]' -or $text -match 'Рђ|Рі|Р°|Р»|Рё|Рґ|Рє') {
        Write-Output "Converting: $($_.Name)"
        
        # Read as Windows-1251 (current PS encoding), interpret as UTF-8 bytes
        $cp1251Bytes = [System.Text.Encoding]::GetEncoding(1251).GetBytes($content)
        
        # These bytes are actually UTF-8 encoded, so convert back
        $utf8Content = [System.Text.Encoding]::UTF8.GetString($cp1251Bytes)
        
        # Save as UTF-8 without BOM
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($file, $utf8Content, $utf8NoBom)
        
        $count++
    }
}

Write-Output "`nConverted $count files"
