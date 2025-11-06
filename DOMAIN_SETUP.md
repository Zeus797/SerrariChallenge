# Hostinger Domain Configuration Guide

This guide explains how to point your Hostinger domain to your AWS Lightsail server.

---

## Prerequisites

- Your AWS Lightsail instance is running
- You have the **Static IP address** from Lightsail (e.g., `18.234.56.78`)
- Access to your Hostinger account

---

## Step-by-Step DNS Configuration

### Step 1: Get Your AWS Static IP

1. Log in to [AWS Lightsail Console](https://lightsail.aws.amazon.com/)
2. Click on your instance
3. Go to **"Networking"** tab
4. Copy your **Static IP address** (if you don't have one, create it first)
   - Example: `18.234.56.78`

### Step 2: Log in to Hostinger

1. Go to [Hostinger](https://www.hostinger.com/)
2. Log in to your account
3. Go to **"Domains"** section
4. Click on the domain you want to configure

### Step 3: Access DNS Settings

1. In your domain page, look for **"DNS / Nameservers"** or **"DNS Zone"**
2. Click **"Manage"** or **"DNS Zone"**

### Step 4: Configure DNS Records

You'll see existing DNS records. You need to add/modify A records.

#### Option A: Root Domain Only (example.com)

**Add or edit the A record for root domain:**

| Type | Name | Content/Points to | TTL |
|------|------|-------------------|-----|
| A    | @    | YOUR_STATIC_IP    | 3600 or Auto |

- **Type**: Select `A` from dropdown
- **Name**: Enter `@` (this represents your root domain)
- **Content/Points to**: Paste your AWS Static IP (e.g., `18.234.56.78`)
- **TTL**: Leave as default (usually 3600) or Auto

#### Option B: WWW Subdomain (www.example.com)

**Add or edit the A record for www:**

| Type | Name | Content/Points to | TTL |
|------|------|-------------------|-----|
| A    | www  | YOUR_STATIC_IP    | 3600 or Auto |

#### Option C: Both Root and WWW (Recommended)

Add **TWO** A records:

| Type | Name | Content/Points to | TTL |
|------|------|-------------------|-----|
| A    | @    | YOUR_STATIC_IP    | 3600 |
| A    | www  | YOUR_STATIC_IP    | 3600 |

This way, both `example.com` and `www.example.com` will work.

### Step 5: Save Changes

1. Click **"Add Record"** or **"Save"**
2. Confirm the changes

---

## DNS Propagation

After saving your DNS changes:

- **Propagation Time**: 5 minutes to 48 hours (usually 15-30 minutes with Hostinger)
- During this time, your domain may be intermittently accessible

### Check DNS Propagation

**Method 1: Online Tool**
1. Go to https://www.whatsmydns.net/
2. Enter your domain name
3. Select "A" record type
4. Check if your AWS IP appears globally

**Method 2: Command Line**

```bash
# macOS/Linux
nslookup YOUR_DOMAIN.com

# Should show your AWS Static IP
```

---

## Example Configuration

### Before (Typical Hostinger Default)

| Type  | Name | Content                  | TTL  |
|-------|------|--------------------------|------|
| A     | @    | 192.168.1.1 (Hostinger)  | 3600 |
| CNAME | www  | @                        | 3600 |

### After (AWS Lightsail)

| Type | Name | Content                    | TTL  |
|------|------|----------------------------|------|
| A    | @    | 18.234.56.78 (Your AWS IP) | 3600 |
| A    | www  | 18.234.56.78 (Your AWS IP) | 3600 |

**Note**: You can delete the old records if they're no longer needed.

---

## Alternative: CNAME Record (Less Recommended)

If you want to use a CNAME instead:

| Type  | Name | Content                              | TTL  |
|-------|------|--------------------------------------|------|
| CNAME | www  | instance-name.region.amazonaws.com   | 3600 |

**Important**:
- CNAME cannot be used for root domain (@)
- A records are preferred for better performance

---

## Verify Setup

Once DNS has propagated, verify your setup:

### 1. Check Domain Resolution

```bash
# Should return your AWS Static IP
nslookup YOUR_DOMAIN.com
```

### 2. Test HTTP Access

Open your browser and visit:
- `http://YOUR_DOMAIN.com`
- `http://www.YOUR_DOMAIN.com`

You should see your application.

### 3. After SSL Setup

Once you've set up SSL (see DEPLOYMENT.md), test:
- `https://YOUR_DOMAIN.com`
- `https://www.YOUR_DOMAIN.com`

---

## Common Issues & Solutions

### Issue 1: "Site Can't Be Reached"

**Possible Causes:**
- DNS hasn't propagated yet → Wait 30-60 minutes
- Wrong IP address → Double-check your AWS Static IP
- Firewall blocking → Verify Lightsail firewall allows HTTP (port 80)

**Solution:**
```bash
# Check if DNS is pointing correctly
nslookup YOUR_DOMAIN.com

# Should show your AWS IP, not Hostinger IP
```

### Issue 2: "Connection Timed Out"

**Possible Causes:**
- Your app isn't running on the server
- Nginx not configured properly
- Firewall blocking connections

**Solution:**
```bash
# SSH into your server
ssh ubuntu@YOUR_STATIC_IP

# Check app status
pm2 status

# Check nginx
sudo systemctl status nginx

# Check firewall (Lightsail)
# Go to Networking tab → ensure HTTP/HTTPS are allowed
```

### Issue 3: Domain Shows Old Content

**Possible Causes:**
- DNS cache on your computer
- Some DNS servers haven't updated yet

**Solution:**
```bash
# macOS/Linux - Flush DNS cache
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Windows - Flush DNS cache
ipconfig /flushdns
```

### Issue 4: www Works but Root Doesn't (or vice versa)

**Cause:** Missing A record

**Solution:** Add both A records:
- One for `@` (root)
- One for `www`

---

## Web Developer Instructions

Share this simplified version with your web developer:

```
Domain: YOUR_DOMAIN.com
AWS IP: YOUR_STATIC_IP

API Endpoints:
- Base URL: https://YOUR_DOMAIN.com/api
- Admin endpoints: https://YOUR_DOMAIN.com/api/admin/*
- Authentication: Add header 'x-admin-key: YOUR_ADMIN_API_KEY'

Get email captures:
GET https://YOUR_DOMAIN.com/api/admin/email-captures

Get test results:
GET https://YOUR_DOMAIN.com/api/admin/test-results

Export as CSV:
GET https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=csv
GET https://YOUR_DOMAIN.com/api/admin/export/test-results?format=csv
```

---

## DNS Records Reference

### A Record
- Points a domain to an IP address
- Use for: Root domain and subdomains
- Example: `example.com → 18.234.56.78`

### CNAME Record
- Points a domain to another domain
- Cannot be used for root domain (@)
- Example: `www.example.com → example.com`

### TTL (Time To Live)
- How long DNS servers cache your record
- 3600 = 1 hour
- Lower TTL = faster updates, more DNS queries
- Higher TTL = slower updates, fewer DNS queries

---

## Hostinger-Specific Tips

1. **hPanel Interface**: Hostinger uses hPanel (not cPanel)
   - DNS settings are under: Domains → Manage → DNS Zone

2. **Auto Configuration**: Some Hostinger plans auto-configure DNS
   - You may need to click "Advanced" to manually edit

3. **Cloudflare Integration**: If you use Hostinger's Cloudflare
   - Disable it temporarily during setup
   - Or configure Cloudflare separately

4. **Email Hosting**: If you have email on Hostinger
   - Keep your MX records unchanged
   - Only modify A records

---

## Support Contacts

- **Hostinger Support**: Live chat available 24/7 in hPanel
- **AWS Lightsail Support**: [AWS Support Center](https://console.aws.amazon.com/support/)

---

## Quick Checklist

Before going live:

- [ ] AWS Lightsail instance is running
- [ ] Application is deployed and accessible via IP
- [ ] Static IP is attached to instance
- [ ] Firewall allows HTTP (80) and HTTPS (443)
- [ ] A records added in Hostinger DNS
- [ ] DNS propagation completed (test with nslookup)
- [ ] Domain accessible in browser
- [ ] SSL certificate installed (for HTTPS)
- [ ] Admin API endpoints working with auth key
- [ ] Backups configured

---

## Next Steps

After domain is working:

1. **Set up SSL** - Follow Part 4 in [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Test admin endpoints** - Verify data access with curl/Postman
3. **Share access** - Give admin API key to authorized users
4. **Monitor** - Check PM2 logs regularly: `pm2 logs`
5. **Backup** - Set up automated database backups
