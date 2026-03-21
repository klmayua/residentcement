# ResidentCement Database Backup Script for Windows
# Usage: .\backup-database.ps1

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupDir = "C:\Backups\Postgres"
$RetentionDays = $env:BACKUP_RETENTION_DAYS -or 30

# Database credentials
$DbUser = $env:DB_USER -or "residentcement"
$DbPassword = $env:DB_PASSWORD
$DbName = $env:DB_NAME -or "residentcement"
$DbHost = $env:DB_HOST -or "localhost"

if (-not $DbPassword) {
    Write-Error "Error: DB_PASSWORD not set"
    exit 1
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "ResidentCement Database Backup" -ForegroundColor Cyan
Write-Host "Timestamp: $Timestamp" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Create backup directory
New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null

# Perform backup
Write-Host "Creating full backup..."
$BackupFile = "$BackupDir\full_$Timestamp.sql"

$env:PGPASSWORD = $DbPassword
& pg_dump `
    --host=$DbHost `
    --username=$DbUser `
    --dbname=$DbName `
    --verbose `
    --file=$BackupFile

if ($LASTEXITCODE -ne 0) {
    Write-Error "Backup failed"
    exit 1
}

# Compress the backup
Write-Host "Compressing backup..."
Compress-Archive -Path $BackupFile -DestinationPath "$BackupFile.zip"
Remove-Item $BackupFile

$BackupFile = "$BackupFile.zip"

# Verify backup
if (Test-Path $BackupFile) {
    $Size = (Get-Item $BackupFile).Length / 1MB
    Write-Host "Backup created successfully: $BackupFile" -ForegroundColor Green
    Write-Host "Size: $([math]::Round($Size, 2)) MB" -ForegroundColor Green
} else {
    Write-Error "Error: Backup file not created"
    exit 1
}

# Clean up old backups
Write-Host "Cleaning up old backups..."
Get-ChildItem -Path $BackupDir -Filter "*.zip" | Where-Object {
    $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays)
} | Remove-Item -Force

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Backup complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
