# Admin Access Guide - For Data Recipients

Simple guide for accessing your platform's collected data.

---

## What You Get Access To

Your platform collects two types of data:

1. **Email Captures** - User emails with their test scores
2. **Test Results** - Detailed test completion data

---

## Authentication

You need an **Admin API Key** to access the data.

**Your Admin API Key:** `[TO BE PROVIDED]`

**Important:** Keep this key private. Anyone with this key can access all collected data.

---

## Access Methods

### Option 1: Download Files (Easiest)

#### Download Email Captures as CSV

**Windows (PowerShell):**
```powershell
$headers = @{"x-admin-key"="YOUR_ADMIN_API_KEY"}
Invoke-WebRequest -Uri "https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=csv" -Headers $headers -OutFile "email-captures.csv"
```

**Mac/Linux:**
```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  "https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=csv" \
  -o email-captures.csv
```

After running this command, you'll have a CSV file you can open in Excel or Google Sheets.

#### Download Test Results as CSV

**Windows (PowerShell):**
```powershell
$headers = @{"x-admin-key"="YOUR_ADMIN_API_KEY"}
Invoke-WebRequest -Uri "https://YOUR_DOMAIN.com/api/admin/export/test-results?format=csv" -Headers $headers -OutFile "test-results.csv"
```

**Mac/Linux:**
```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  "https://YOUR_DOMAIN.com/api/admin/export/test-results?format=csv" \
  -o test-results.csv
```

---

### Option 2: Use Postman (Visual Tool)

Postman is a free tool for working with APIs.

#### Setup:

1. Download Postman: https://www.postman.com/downloads/
2. Install and open Postman
3. Click **"New"** → **"HTTP Request"**

#### Get Email Captures:

1. Set method to **GET**
2. Enter URL: `https://YOUR_DOMAIN.com/api/admin/email-captures`
3. Go to **Headers** tab
4. Add header:
   - Key: `x-admin-key`
   - Value: `YOUR_ADMIN_API_KEY`
5. Click **Send**

You'll see the data in JSON format below.

#### Export as CSV:

Same steps but use URL:
```
https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=csv
```

Click **Save Response** → **Save to file**

---

### Option 3: Browser Extension

Use a browser extension to add headers, then visit URLs directly.

#### Chrome Extension: ModHeader

1. Install **ModHeader** extension
2. Click the extension icon
3. Add header:
   - Name: `x-admin-key`
   - Value: `YOUR_ADMIN_API_KEY`
4. Visit these URLs in your browser:
   - View data: `https://YOUR_DOMAIN.com/api/admin/email-captures`
   - Download CSV: `https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=csv`

---

## Available Endpoints

### Email Captures

**View in browser/Postman:**
```
https://YOUR_DOMAIN.com/api/admin/email-captures
```

**Download CSV:**
```
https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=csv
```

**Download JSON:**
```
https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=json
```

### Test Results

**View in browser/Postman:**
```
https://YOUR_DOMAIN.com/api/admin/test-results
```

**Download CSV:**
```
https://YOUR_DOMAIN.com/api/admin/export/test-results?format=csv
```

**Download JSON:**
```
https://YOUR_DOMAIN.com/api/admin/export/test-results?format=json
```

---

## Understanding the Data

### Email Captures CSV Columns

| Column | Description | Example |
|--------|-------------|---------|
| ID | Unique identifier | `550e8400-e29b...` |
| Email | User's email address | `user@example.com` |
| Course ID | Internal course identifier | `javascript-basics` |
| Course Name | Human-readable course name | `JavaScript Basics` |
| Score | Number of correct answers | `8` |
| Total Questions | Total questions in test | `10` |
| Percentage | Score percentage | `80` |
| Captured At | When submitted | `2025-11-04T12:34:56Z` |

### Test Results CSV Columns

| Column | Description | Example |
|--------|-------------|---------|
| ID | Unique identifier | `660e8400-e29b...` |
| Course ID | Internal course identifier | `react-fundamentals` |
| Score | Number of correct answers | `7` |
| Total Questions | Total questions in test | `10` |
| Completed At | When test was completed | `2025-11-04T13:45:00Z` |
| Share ID | Shareable link ID | `abc123xyz` |

---

## Scheduling Automatic Downloads

### Windows Task Scheduler

Create a script `download-data.ps1`:

```powershell
$apiKey = "YOUR_ADMIN_API_KEY"
$domain = "YOUR_DOMAIN.com"
$date = Get-Date -Format "yyyy-MM-dd"
$headers = @{"x-admin-key"=$apiKey}

# Download email captures
Invoke-WebRequest -Uri "https://$domain/api/admin/export/email-captures?format=csv" `
  -Headers $headers -OutFile "C:\Downloads\email-captures-$date.csv"

# Download test results
Invoke-WebRequest -Uri "https://$domain/api/admin/export/test-results?format=csv" `
  -Headers $headers -OutFile "C:\Downloads\test-results-$date.csv"

Write-Host "Data downloaded successfully to C:\Downloads\"
```

Schedule it to run daily using Task Scheduler.

### Mac/Linux Cron Job

Create script `download-data.sh`:

```bash
#!/bin/bash
API_KEY="YOUR_ADMIN_API_KEY"
DOMAIN="YOUR_DOMAIN.com"
DATE=$(date +%Y-%m-%d)
OUTPUT_DIR="$HOME/Downloads"

curl -H "x-admin-key: $API_KEY" \
  "https://$DOMAIN/api/admin/export/email-captures?format=csv" \
  -o "$OUTPUT_DIR/email-captures-$DATE.csv"

curl -H "x-admin-key: $API_KEY" \
  "https://$DOMAIN/api/admin/export/test-results?format=csv" \
  -o "$OUTPUT_DIR/test-results-$DATE.csv"

echo "Data downloaded to $OUTPUT_DIR"
```

Make executable:
```bash
chmod +x download-data.sh
```

Add to crontab (daily at 9 AM):
```bash
crontab -e
# Add this line:
0 9 * * * /path/to/download-data.sh
```

---

## Troubleshooting

### "Unauthorized" Error

**Problem:** Invalid or missing API key

**Solution:**
- Double-check your API key (no extra spaces)
- Ensure header name is exactly `x-admin-key` (lowercase)
- Verify you're using the latest API key

### "Not Found" Error

**Problem:** Wrong URL

**Solution:**
- Verify domain is correct
- Check URL path is exactly `/api/admin/email-captures`
- Ensure HTTPS is being used

### Connection Timeout

**Problem:** Server is down or unreachable

**Solution:**
- Wait a few minutes and try again
- Contact server administrator
- Check if domain is accessible in browser

### Empty Results

**Problem:** No data collected yet

**Solution:**
- This is normal if no users have completed tests
- Check back after users start using the platform

---

## For Web Developers

If you want to build a custom dashboard, see [API_REFERENCE.md](API_REFERENCE.md) for:
- JavaScript/TypeScript examples
- Python examples
- React integration examples
- Complete API documentation

---

## Security Reminders

- ✅ **Keep your API key secret** - Don't share it publicly
- ✅ **Use HTTPS** - Never use HTTP (without S) for API calls
- ✅ **Don't commit to Git** - If you save the key in a file, don't commit it
- ✅ **Rotate periodically** - Change your API key every few months

---

## Getting New API Key

If you need to change your API key:

1. Contact the server administrator
2. They will generate a new key using: `openssl rand -hex 32`
3. They'll update the server's `.env` file
4. They'll restart the app: `pm2 restart serrari-challenge`
5. Update your saved scripts with the new key

---

## Quick Reference Card

```
Admin API Key: [YOUR_KEY_HERE]
Domain: YOUR_DOMAIN.com

View Data:
https://YOUR_DOMAIN.com/api/admin/email-captures
https://YOUR_DOMAIN.com/api/admin/test-results

Download CSV:
https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=csv
https://YOUR_DOMAIN.com/api/admin/export/test-results?format=csv

Header Required:
x-admin-key: YOUR_ADMIN_API_KEY
```

Print this and keep it handy!

---

## Support

For technical issues with the API:
- Check [API_REFERENCE.md](API_REFERENCE.md) for detailed documentation
- Contact your web developer or server administrator
- Verify server is running and domain is accessible
