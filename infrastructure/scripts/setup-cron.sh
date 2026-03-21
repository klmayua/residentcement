#!/bin/bash
# Setup automated backup cron jobs

echo "Setting up automated backup cron jobs..."

# Full backup daily at 2 AM
(crontab -l 2>/dev/null || true; echo "0 2 * * * /opt/residentcement/infrastructure/scripts/backup-database.sh full >> /var/log/residentcement/backup.log 2>&1") | crontab -

# Incremental backup every 6 hours
(crontab -l 2>/dev/null || true; echo "0 */6 * * * /opt/residentcement/infrastructure/scripts/backup-database.sh incremental >> /var/log/residentcement/backup-incremental.log 2>&1") | crontab -

echo "Cron jobs installed:"
crontab -l | grep residentcement || echo "No residentcement jobs found"
