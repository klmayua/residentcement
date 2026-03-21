#!/bin/bash
set -e

# Disaster Recovery Script for ResidentCement
# Restores database from backup

BACKUP_FILE=$1
DB_USER=${DB_USER:-residentcement}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME:-residentcement}
DB_HOST=${DB_HOST:-localhost}

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup-file>"
    echo ""
    echo "Available backups:"
    ls -la /backups/postgres/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
    echo "Error: DB_PASSWORD not set"
    exit 1
fi

echo "=========================================="
echo "DISASTER RECOVERY - Database Restore"
echo "=========================================="
echo "Backup file: $BACKUP_FILE"
echo "Target database: $DB_NAME"
echo "Host: $DB_HOST"
echo "=========================================="

read -p "This will OVERWRITE the current database. Are you sure? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Decompress if needed
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "Decompressing backup..."
    gunzip -c "$BACKUP_FILE" > /tmp/restore.sql
    BACKUP_FILE=/tmp/restore.sql
fi

# Drop and recreate database
echo "Dropping existing database..."
PGPASSWORD=$DB_PASSWORD psql \
    --host="$DB_HOST" \
    --username="$DB_USER" \
    --dbname="postgres" \
    --command="DROP DATABASE IF EXISTS $DB_NAME;"

echo "Creating new database..."
PGPASSWORD=$DB_PASSWORD psql \
    --host="$DB_HOST" \
    --username="$DB_USER" \
    --dbname="postgres" \
    --command="CREATE DATABASE $DB_NAME;"

# Restore from backup
echo "Restoring database..."
PGPASSWORD=$DB_PASSWORD psql \
    --host="$DB_HOST" \
    --username="$DB_USER" \
    --dbname="$DB_NAME" \
    --file="$BACKUP_FILE"

# Cleanup
if [ -f /tmp/restore.sql ]; then
    rm /tmp/restore.sql
fi

echo "=========================================="
echo "Database restore complete!"
echo "=========================================="
