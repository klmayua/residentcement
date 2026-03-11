param(
  [string]$ManifestPath = "docs/architecture/module-boundaries.json"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\\.." )).Path
$manifestFile = Join-Path $projectRoot $ManifestPath
$reportsDir = Join-Path $projectRoot "reports"
New-Item -ItemType Directory -Force -Path $reportsDir | Out-Null

if (-not (Test-Path $manifestFile)) {
  throw "Manifest not found: $manifestFile"
}

$manifest = Get-Content -Path $manifestFile -Raw | ConvertFrom-Json
$checks = New-Object System.Collections.Generic.List[object]
$violations = New-Object System.Collections.Generic.List[object]

function Add-Check {
  param(
    [string]$Name,
    [bool]$Passed,
    [string]$Detail
  )
  $status = if ($Passed) { "passed" } else { "failed" }
  $item = [pscustomobject]@{ name = $Name; status = $status; detail = $Detail }
  $checks.Add($item) | Out-Null
  if (-not $Passed) {
    $violations.Add([pscustomobject]@{ check = $Name; detail = $Detail }) | Out-Null
  }
}

function Relative-Path {
  param([string]$AbsolutePath)
  $prefix = $projectRoot + "\\"
  if ($AbsolutePath.StartsWith($prefix)) {
    return $AbsolutePath.Substring($prefix.Length).Replace("\\", "/")
  }
  return $AbsolutePath.Replace("\\", "/")
}

foreach ($module in $manifest.modules) {
  $moduleFile = Join-Path $projectRoot $module.file
  $moduleName = [string]$module.id
  Add-Check -Name ("module-file:" + $moduleName) -Passed (Test-Path $moduleFile) -Detail ("Expected module file " + $module.file)
  if (-not (Test-Path $moduleFile)) { continue }
  $content = Get-Content -Path $moduleFile -Raw
  if ($module.PSObject.Properties.Name -contains "port" -and $null -ne $module.port) {
    $portToken = [string]$module.port
    $hasPort = $content.Contains($portToken)
    Add-Check -Name ("module-port:" + $moduleName) -Passed $hasPort -Detail ("Expected port token " + $portToken + " in " + $module.file)
  }

  if ($module.PSObject.Properties.Name -contains "routes") {
    foreach ($route in $module.routes) {
      $present = $content.Contains([string]$route)
      Add-Check -Name ("module-route:" + $moduleName + ":" + $route) -Passed $present -Detail ("Expected route " + $route + " in " + $module.file)
    }
  }
  if ($module.PSObject.Properties.Name -contains "topics") {
    foreach ($topic in $module.topics) {
      $present = $content.Contains([string]$topic)
      Add-Check -Name ("module-topic:" + $moduleName + ":" + $topic) -Passed $present -Detail ("Expected topic " + $topic + " in " + $module.file)
    }
  }
  if ($module.PSObject.Properties.Name -contains "gatewayMarkers") {
    foreach ($marker in $module.gatewayMarkers) {
      $present = $content.Contains([string]$marker)
      Add-Check -Name ("frontend-marker:" + $moduleName + ":" + $marker) -Passed $present -Detail ("Expected marker " + $marker + " in " + $module.file)
    }
  }
}

$gateway = $manifest.modules | Where-Object { $_.id -eq "api-gateway" }
$gatewayRoutes = @()
if ($null -ne $gateway -and $gateway.PSObject.Properties.Name -contains "routes") {
  $gatewayRoutes = @($gateway.routes | ForEach-Object { [string]$_ })
}

$frontendModules = $manifest.modules | Where-Object { $_.type -eq "frontend" }
foreach ($frontend in $frontendModules) {
  $frontendPath = Join-Path $projectRoot $frontend.file
  if (-not (Test-Path $frontendPath)) { continue }
  $content = Get-Content -Path $frontendPath -Raw
  $routeMatches = [regex]::Matches($content, "/api/v[0-9]+/[a-zA-Z0-9-]+")
  $prefixes = New-Object System.Collections.Generic.HashSet[string]
  foreach ($m in $routeMatches) { [void]$prefixes.Add($m.Value) }
  foreach ($prefix in $prefixes) {
    $covered = $false
    foreach ($mounted in $gatewayRoutes) { if ($prefix.StartsWith($mounted)) { $covered = $true; break } }
    Add-Check -Name ("frontend-route-coverage:" + $frontend.id + ":" + $prefix) -Passed $covered -Detail ("Gateway route coverage for " + $prefix)
  }
  $servicePortHits = [regex]::Matches($content, "localhost:300[2-7]")
  Add-Check -Name ("frontend-direct-service-port:" + $frontend.id) -Passed ($servicePortHits.Count -eq 0) -Detail "Frontend should not call service ports directly"
}

$serviceModules = $manifest.modules | Where-Object { $_.type -eq "service" }
$serviceNames = @($serviceModules | ForEach-Object { [string]$_.id })
$serviceRoot = Join-Path $projectRoot "backend/services"
if (Test-Path $serviceRoot) {
  $codeFiles = Get-ChildItem -Path $serviceRoot -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx | Where-Object { $_.FullName -notmatch "node_modules|dist" }
  foreach ($file in $codeFiles) {
    $rel = Relative-Path -AbsolutePath $file.FullName
    if ($rel -notmatch "backend/services/([^/]+)/") { continue }
    $owner = $Matches[1]
    $content = Get-Content -Path $file.FullName -Raw
    foreach ($serviceName in $serviceNames) {
      if ($serviceName -eq $owner) { continue }
      $hasAliasRef = $content.Contains("@resident-cement/" + $serviceName)
      $hasPathRef = $content.Contains("/" + $serviceName + "/")
      if ($hasAliasRef -or $hasPathRef) {
        Add-Check -Name ("cross-service-import:" + $rel) -Passed $false -Detail ("Potential direct service coupling with " + $serviceName)
      }
    }
  }
}

$failed = @($checks | Where-Object { $_.status -eq "failed" }).Count
$passed = @($checks | Where-Object { $_.status -eq "passed" }).Count
$report = New-Object psobject
$report | Add-Member -NotePropertyName generated_at_utc -NotePropertyValue ((Get-Date).ToUniversalTime().ToString("o"))
$report | Add-Member -NotePropertyName manifest -NotePropertyValue (Relative-Path -AbsolutePath $manifestFile)
$report | Add-Member -NotePropertyName checks_total -NotePropertyValue $checks.Count
$report | Add-Member -NotePropertyName checks_passed -NotePropertyValue $passed
$report | Add-Member -NotePropertyName checks_failed -NotePropertyValue $failed
$report | Add-Member -NotePropertyName violations -NotePropertyValue ($violations.ToArray())

$jsonPath = Join-Path $reportsDir "module_boundary_verification.json"
$report | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonPath -Encoding UTF8

$mdPath = Join-Path $reportsDir "module_boundary_verification.md"
$md = @()
$md += "# Module Boundary Verification"
$md += ""
$md += ("- Generated At UTC: " + $report.generated_at_utc)
$md += ("- Manifest: " + $report.manifest)
$md += ("- Checks Total: " + $report.checks_total)
$md += ("- Checks Passed: " + $report.checks_passed)
$md += ("- Checks Failed: " + $report.checks_failed)
$md += ""
if ($report.checks_failed -gt 0) {
  $md += "## Violations"
  foreach ($v in $violations) {
    $md += ("- " + $v.check + ": " + $v.detail)
  }
} else {
  $md += "## Status"
  $md += "- All boundary checks passed."
}
$md | Set-Content -Path $mdPath -Encoding UTF8
Write-Host ("[architecture] checks total=" + $report.checks_total + " passed=" + $report.checks_passed + " failed=" + $report.checks_failed)
if ($report.checks_failed -gt 0) { exit 1 }
exit 0



