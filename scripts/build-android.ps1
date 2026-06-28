[CmdletBinding()]
param(
    [string]$Task = "assembleDebug",
    [string]$SiteUrl = $env:NEXT_PUBLIC_SITE_URL
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSCommandPath)
$androidRoot = Join-Path $projectRoot "android"

if ([string]::IsNullOrWhiteSpace($SiteUrl)) {
    $SiteUrl = "https://world-cup-desk.example.com"
}

try {
    $parsedSiteUrl = [Uri]$SiteUrl
} catch {
    throw "SiteUrl must be a valid URL. Received: $SiteUrl"
}

$isLocalHttp =
    $parsedSiteUrl.Scheme -eq "http" -and
    @("localhost", "127.0.0.1", "10.0.2.2", "::1").Contains($parsedSiteUrl.Host)

if ($parsedSiteUrl.Scheme -ne "https" -and -not $isLocalHttp) {
    throw "SiteUrl must use HTTPS, except local emulator development hosts. Received: $SiteUrl"
}

$gradlewPath = Join-Path $androidRoot "gradlew.bat"

if (Test-Path $gradlewPath) {
    & $gradlewPath "-PworldCupDeskSiteUrl=$SiteUrl" $Task
    exit $LASTEXITCODE
}

$gradleCommand = Get-Command gradle -ErrorAction SilentlyContinue

if (-not $gradleCommand) {
    throw "Android build requires Gradle or an Android Studio Gradle runner. Open android/ in Android Studio, or install Gradle and run this script again."
}

Push-Location $androidRoot
try {
    & $gradleCommand.Source "-PworldCupDeskSiteUrl=$SiteUrl" $Task
    exit $LASTEXITCODE
} finally {
    Pop-Location
}
