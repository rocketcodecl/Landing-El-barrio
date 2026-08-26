#!/bin/bash
set -euo pipefail

BACKUP_DIR="/root/backups/elbarrio-landing"
DATA_DIR="/var/www/vhosts/elbarrio.lat/private/landing-data"
mkdir -p "$BACKUP_DIR"

STAMP="$(date +%Y%m%d_%H%M%S)"
tar -czf "$BACKUP_DIR/data_$STAMP.tar.gz" -C "$DATA_DIR" .

find "$BACKUP_DIR" -type f -name 'data_*.tar.gz' -mtime +30 -delete
