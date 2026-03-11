Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..\\.." )).Path
$required = @("forensic_report.md","dependency_audit_report.yaml","installed_dependency_inventory.yaml","runtime_environment_report.yaml","docker_port_registry.yaml","playwright_test_results.json")
$missing = @()
foreach ($file in $required) { if (-not (Test-Path (Join-Path $root $file))) { $missing += $file } }
Write-Host ("[forensic] required=" + $required.Count + " missing=" + $missing.Count)
if ($missing.Count -gt 0) { exit 1 }
exit 0
