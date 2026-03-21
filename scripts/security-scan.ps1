# Security Scan Script for Windows
# Runs security scans on the project

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "ResidentCement Security Scan" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

function Run-NpmAudit {
    param(
        [string]$Directory,
        [string]$Name
    )

    Write-Host ""
    Write-Host "Scanning $Name..."

    if (Test-Path $Directory) {
        Push-Location $Directory
        try {
            npm audit --audit-level=high 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ $Name passed" -ForegroundColor Green
            } else {
                Write-Host "⚠️  $Name has vulnerabilities" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "⚠️  Error scanning $Name" -ForegroundColor Yellow
        }
        Pop-Location
    } else {
        Write-Host "⚠️  $Name directory not found" -ForegroundColor Yellow
    }
}

# Run dependency audits
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Dependency Vulnerability Scan" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Run-NpmAudit -Directory "backend\gateway" -Name "Gateway API"
Run-NpmAudit -Directory "frontend\apps\distributor-portal" -Name "Distributor Portal"
Run-NpmAudit -Directory "frontend\apps\corporate-website" -Name "Corporate Website"
Run-NpmAudit -Directory "frontend\apps\sales-rep-app" -Name "Sales Rep App"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Security Scan Complete" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Review any warnings above and fix critical vulnerabilities"
