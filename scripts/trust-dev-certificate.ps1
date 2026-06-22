$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$certificatePath = Join-Path $projectRoot ".dev-certs\localhost.crt"

if (-not (Test-Path -LiteralPath $certificatePath)) {
  throw "Development certificate is missing. Run 'npm run dev:https' once before trusting it."
}

$certificate = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($certificatePath)
$rootStore = New-Object System.Security.Cryptography.X509Certificates.X509Store("Root", "CurrentUser")

try {
  $rootStore.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)
  $existingCertificate = $rootStore.Certificates | Where-Object { $_.Thumbprint -eq $certificate.Thumbprint } | Select-Object -First 1

  if ($null -eq $existingCertificate) {
    $rootStore.Add($certificate)
    Write-Output "Trusted development certificate for CurrentUser: $($certificate.Thumbprint)"
  } else {
    Write-Output "Development certificate is already trusted: $($certificate.Thumbprint)"
  }
} finally {
  $rootStore.Close()
}
