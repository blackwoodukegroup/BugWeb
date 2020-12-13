
function Get-MD5Hash($string){

    $bytes = [System.Text.Encoding]::UTF8.GetBytes($string)
    $md5 = [System.Security.Cryptography.HashAlgorithm]::Create("MD5")
    $sb = New-Object System.Text.StringBuilder

    $md5.ComputeHash($bytes) |
        ForEach-Object -Process {
            $null = $sb.Append($_.ToString("x2"))
        }

    $sb.ToString()
}

function BugApiCommand($token, $method, $command, $parameters){

    $bugUrl = "https://script.google.com/macros/s/AKfycbxoeTQ5zyiDHMa3pUAbGk4Navv2gzJqnZOd_X3YuQvSLIV2gBA/exec"

    $wrParams = @{
        Uri = $bugUrl + "?command=" + $command
        Method = $method
    }

    if ( $token ) {
        $wrParams.Uri += ( "&user-token=" + $token )
    }

    if ( $parameters ) {
        $wrParams.Body = ( $parameters | ConvertTo-JSON )
        $wrParams.ContentType = "application/json"
    }

    $result = $null

    try {
        $response = Invoke-WebRequest @wrParams

        if ( $response.StatusCode -ge 200 -and $response.StatusCode -lt 300 ) {
            $payload = $response.content | ConvertFrom-Json

            if ( $payload.status -eq "success" ) {

                $result = $payload.data
            }
            else {
                throw $payload.message
            }
        }
        else {
            throw "API request failed"
        }
    }
    catch {
        throw
    }

    return $result
}


$creds = @{
    username = "admin"
    password = "password"
}

$userToken = BugApiCommand -method "POST" -command "login" -parameters $creds |
                Select-Object -ExpandProperty "user-token"

$result = BugApiCommand -token $userToken -method "GET" -command "getPlaylistData"

$result | ft