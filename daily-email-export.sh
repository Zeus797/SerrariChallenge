#!/bin/bash
# Daily Email Export Script for Serrari Challenge

API_KEY="51b50124f698dfad90de7b60ba3fbba2f398079fe9e2f7ad993b9f818c427508"
API_URL="http://localhost:3000/api/admin/export/email-captures?format=csv"
TEMP_FILE="/tmp/serrari_emails_$(date +%Y%m%d).csv"
DATE=$(date +"%B %d, %Y")

curl -H "X-Admin-Key: $API_KEY" "$API_URL" -o "$TEMP_FILE"

if [ -f "$TEMP_FILE" ]; then
    COUNT=$(($(wc -l < "$TEMP_FILE") - 1))

    EMAIL_BODY="Hi Team,

Here is the daily Serrari Challenge email captures report for $DATE.

Total emails captured: $COUNT

The CSV file is attached.

Best regards,
Serrari Challenge Automated System"

    echo "$EMAIL_BODY" | mail -s "Serrari Daily Email Report - $DATE" -a "$TEMP_FILE" nicole.matimu@serrarigroup.com,elsienjenga42@gmail.com,davekabera@gmail.com

    rm "$TEMP_FILE"
    echo "$(date): Email report sent successfully" >> ~/email-export.log
else
    echo "$(date): Failed to download CSV" >> ~/email-export.log
fi
