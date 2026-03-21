#!/bin/bash
set -e

# ResidentCement Database Backup Script
# Usage: ./backup-database.sh [full|incremental]

BACKUP_TYPE=${1:-full}
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}
S3_BUCKET=${BACKUP_S3_BUCKET:-residentcement-backups}
S3_REGION=${BACKUP_S3_REGION:-us-east-1}

# Database credentials (from environment or .env)
DB_USER=${DB_USER:-residentcement}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME:-residentcement}
DB_HOST=${DB_HOST:-localhost}

if [ -z "$DB_PASSWORD" ]; then
    echo "Error: DB_PASSWORD not set"
    exit 1
fi

echo "=========================================="
echo "ResidentCement Database Backup"
echo "Type: $BACKUP_TYPE"
echo "Timestamp: $TIMESTAMP"
echo "=========================================="

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Perform backup
if [ "$BACKUP_TYPE" == "full" ]; then
    echo "Creating full backup..."
    pg_dump \
        --host="$DB_HOST" \
        --username="$DB_USER" \
        --dbname="$DB_NAME" \
        --verbose \
        --file="$BACKUP_DIR/full_${TIMESTAMP}.sql"

    # Compress the backup
    gzip "$BACKUP_DIR/full_${TIMESTAMP}.sql"
    BACKUP_FILE="$BACKUP_DIR/full_${TIMESTAMP}.sql.gz"
else
    echo "Creating incremental backup (WAL archive)..."
    # WAL archiving is handled by PostgreSQL configuration
    echo "WAL archive backup complete"
fi

# Verify backup
if [ -f "$BACKUP_FILE" ]; then
    echo "Backup created successfully: $BACKUP_FILE"
    echo "Size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "Error: Backup file not created"
    exit 1
fi

# Upload to S3 if configured
if command -v aws &> /dev/null && [ -n "$AWS_ACCESS_KEY_ID" ]; then
    echo "Uploading to S3..."
    aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/postgres/" --region "$S3_REGION"
    echo "S3 upload complete"
fi

# Clean up old backups
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo "Cleaned up backups older than $RETENTION_DAYS days"

echo "=========================================="
echo "Backup complete!"
echo "=========================================="
