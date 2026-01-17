#!/usr/bin/bash

set -e
trap 'check_exit_error $? $LINENO' EXIT

check_exit_error() {
  if [ "$1" != "0" ]; then
    logger -s "ERROR - update_kflip_icecast_cert.sh - Exit code $1 at line $2"
    exit "$1"
  fi
}

# Configuration
CERT_FILE="/var/www/httpd-cert/popcorn/kflipcamp.org_le1.crt"
KEY_FILE="/var/www/httpd-cert/popcorn/kflipcamp.org_le1.key"
PEM_FILE="/usr/share/icecast2/kflipcamp.org_le1.pem"
TEMP_PEM_FILE="${PEM_FILE}.tmp"

# Check if certificate and key files exist
if [ ! -f "$CERT_FILE" ]; then
    logger -s "ERROR - update_kflip_icecast_cert.sh - Certificate file not found: $CERT_FILE"
    exit 1
fi

if [ ! -f "$KEY_FILE" ]; then
    logger -s "ERROR - update_kflip_icecast_cert.sh - Key file not found: $KEY_FILE"
    exit 1
fi

# Check if certificate is newer than PEM file or PEM doesn't exist
if [ ! -f "$PEM_FILE" ] || [ "$CERT_FILE" -nt "$PEM_FILE" ]; then
    logger -s "INFO - update_kflip_icecast_cert.sh - Creating new PEM file for Icecast2 in $PEM_FILE"

    # Create PEM file atomically using temp file
    cat "$CERT_FILE" > "$TEMP_PEM_FILE"
    printf '\n' >> "$TEMP_PEM_FILE"
    cat "$KEY_FILE" >> "$TEMP_PEM_FILE"

    # Set appropriate permissions (readable by icecast2 user)
    chmod 640 "$TEMP_PEM_FILE"
    chown icecast2:icecast "$TEMP_PEM_FILE"

    # Move temp file to final location atomically
    mv "$TEMP_PEM_FILE" "$PEM_FILE"

    # Reload icecast2 to use new certificate
    if systemctl reload icecast2; then
        logger -s "INFO - update_kflip_icecast_cert.sh - Icecast2 service reloaded successfully"
    else
        logger -s "WARN - update_kflip_icecast_cert.sh - Failed to reload icecast2, trying restart"
        systemctl restart icecast2
        logger -s "INFO - update_kflip_icecast_cert.sh - Icecast2 service restarted"
    fi
else
    logger -s "INFO - update_kflip_icecast_cert.sh - Icecast2 PEM file is up to date"
fi
