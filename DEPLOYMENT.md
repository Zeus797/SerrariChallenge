# AWS Lightsail Deployment Guide

This guide will walk you through deploying your application to AWS Lightsail - the cheapest and simplest AWS hosting option.

## Cost Estimate
- **AWS Lightsail**: $3.50-5/month for the smallest instance
- **Domain**: Already owned (Hostinger)
- **Total**: ~$3.50-5/month

---

## Part 1: AWS Lightsail Setup

### Step 1: Create AWS Account & Lightsail Instance

1. Go to [AWS Lightsail Console](https://lightsail.aws.amazon.com/)
2. Click **"Create instance"**
3. Choose your instance location (pick closest to your users)
4. Select platform: **Linux/Unix**
5. Select blueprint: **OS Only** → **Ubuntu 22.04 LTS**
6. Choose instance plan: **$3.50/month** (512 MB RAM, 1 vCPU) 
   - This is sufficient for small traffic
   - Can upgrade later if needed
7. Name your instance (e.g., `serrari-challenge`)
8. Click **"Create instance"**

### Step 2: Configure Networking

1. In your Lightsail instance page, go to **"Networking"** tab
2. Under **"IPv4 Firewall"**, add these rules:
   - **HTTP** (Port 80) - Already added by default
   - **HTTPS** (Port 443) - Click "Add rule" → HTTPS
   - **SSH** (Port 22) - Already added by default
3. Note down your **Static IP address** (you'll need this for DNS) -  52.31.31.249
4. If you don't see a static IP:
   - Go to **"Networking"** tab
   - Click **"Create static IP"**
   - Attach it to your instance

---

## Part 2: Server Setup

### Step 3: Connect to Your Server

1. In Lightsail console, click **"Connect using SSH"** (browser-based terminal)
   - Or use your own SSH client: `ssh ubuntu@YOUR_STATIC_IP` (you'll need to download the SSH key)

### Step 4: Install Node.js and Dependencies

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x

# Install PM2 (process manager to keep your app running)
sudo npm install -g pm2

# Install nginx (web server)
sudo apt install -y nginx
```

### Step 5: Upload Your Application

**Option A: Using Git (Recommended)**

```bash
# Install git if not already installed
sudo apt install -y git

# Clone your repository
cd /home/ubuntu
git clone YOUR_REPOSITORY_URL serrari-challenge
cd serrari-challenge

# Install dependencies
npm install

# Build the application
npm run build
```

**Option B: Manual Upload**

1. On your local machine, create a zip of your project:
   ```bash
   # Exclude node_modules
   zip -r serrari-challenge.zip . -x "node_modules/*" -x ".git/*"
   ```

2. Upload using the Lightsail console or SCP:
   ```bash
   scp -i YOUR_SSH_KEY.pem serrari-challenge.zip ubuntu@YOUR_STATIC_IP:/home/ubuntu/
   ```

3. On the server, unzip and install:
   ```bash
   cd /home/ubuntu
   unzip serrari-challenge.zip -d serrari-challenge
   cd serrari-challenge
   npm install
   npm run build
   ```

### Step 6: Configure Environment Variables

```bash
# Create production .env file
nano .env
```

Add the following (press Ctrl+X, then Y, then Enter to save):

```env
DATABASE_URL=file:./production.db
NODE_ENV=production
PORT=3000

# Generate a secure admin key
# Run: openssl rand -hex 32
ADMIN_API_KEY=REPLACE_WITH_SECURE_RANDOM_KEY
```

To generate a secure admin key:
```bash
openssl rand -hex 32
```

Copy the output and paste it as your `ADMIN_API_KEY` value.

### Step 7: Initialize Database

```bash
# Push database schema
npm run db:push

# Your production database (production.db) is now created
```

### Step 8: Start Application with PM2

```bash
# Start the app
pm2 start npm --name "serrari-challenge" -- start

# Make PM2 restart on server reboot
pm2 startup
pm2 save

# Check if it's running
pm2 status
pm2 logs serrari-challenge
```

### Step 9: Configure Nginx as Reverse Proxy

```bash
# Create nginx configuration
sudo nano /etc/nginx/sites-available/serrari-challenge
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Replace `YOUR_DOMAIN.com` with your actual domain.

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/serrari-challenge /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

---

## Part 3: Domain Configuration (Hostinger)

See [DOMAIN_SETUP.md](DOMAIN_SETUP.md) for detailed DNS configuration.

**Quick steps:**

1. Log in to Hostinger
2. Go to your domain's DNS settings
3. Add/Edit **A Record**:
   - Type: `A`
   - Name: `@` (for root domain) or `www` (for subdomain)
   - Points to: `YOUR_LIGHTSAIL_STATIC_IP`
   - TTL: `3600` or Auto
4. Wait 5-30 minutes for DNS propagation

---

## Part 4: SSL/HTTPS Setup (Free with Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d YOUR_DOMAIN.com -d www.YOUR_DOMAIN.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)

# Test automatic renewal
sudo certbot renew --dry-run
```

Your site is now live with HTTPS!

---

## Part 5: Accessing Your Data

### Admin API Endpoints

Your application now has protected admin endpoints to access collected data.

**Base URL**: `https://YOUR_DOMAIN.com/api/admin`

**Authentication**: All admin endpoints require the `x-admin-key` header.

#### 1. Get All Email Captures

```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  https://YOUR_DOMAIN.com/api/admin/email-captures
```

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "courseId": "course-id",
      "courseName": "Course Name",
      "score": 8,
      "totalQuestions": 10,
      "percentage": 80,
      "capturedAt": "2025-11-04T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

#### 2. Get All Test Results

```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  https://YOUR_DOMAIN.com/api/admin/test-results
```

#### 3. Export Email Captures as CSV

```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  "https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=csv" \
  -o email-captures.csv
```

#### 4. Export Email Captures as JSON

```bash
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  "https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=json" \
  -o email-captures.json
```

#### 5. Export Test Results

```bash
# CSV format
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  "https://YOUR_DOMAIN.com/api/admin/export/test-results?format=csv" \
  -o test-results.csv

# JSON format
curl -H "x-admin-key: YOUR_ADMIN_API_KEY" \
  "https://YOUR_DOMAIN.com/api/admin/export/test-results?format=json" \
  -o test-results.json
```

### For Web Developers

Share these details with your web developer:

```javascript
// Example: Fetch email captures
const response = await fetch('https://YOUR_DOMAIN.com/api/admin/email-captures', {
  headers: {
    'x-admin-key': 'YOUR_ADMIN_API_KEY'
  }
});

const data = await response.json();
console.log(data.data); // Array of email captures
console.log(data.count); // Total count
```

---

## Useful PM2 Commands

```bash
# View logs
pm2 logs serrari-challenge

# Restart app
pm2 restart serrari-challenge

# Stop app
pm2 stop serrari-challenge

# View app status
pm2 status

# Monitor in real-time
pm2 monit
```

---

## Updating Your Application

```bash
# Pull latest changes (if using git)
cd /home/ubuntu/serrari-challenge
git pull

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart the app
pm2 restart serrari-challenge

# Check logs to ensure it started successfully
pm2 logs serrari-challenge --lines 50
```

---

## Backup Your Database

```bash
# Create backup
cp /home/ubuntu/serrari-challenge/production.db \
   /home/ubuntu/serrari-challenge/backup-$(date +%Y%m%d).db

# Download backup to your local machine
scp ubuntu@YOUR_STATIC_IP:/home/ubuntu/serrari-challenge/production.db ./local-backup.db
```

**Set up automatic daily backups:**

```bash
# Create backup script
nano /home/ubuntu/backup.sh
```

Add:
```bash
#!/bin/bash
cd /home/ubuntu/serrari-challenge
cp production.db "backup-$(date +%Y%m%d-%H%M%S).db"
# Keep only last 7 days of backups
find . -name "backup-*.db" -mtime +7 -delete
```

```bash
# Make executable
chmod +x /home/ubuntu/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add this line:
0 2 * * * /home/ubuntu/backup.sh
```

---

## Troubleshooting

### App not accessible
```bash
# Check if app is running
pm2 status

# Check app logs
pm2 logs serrari-challenge

# Check nginx
sudo systemctl status nginx
sudo nginx -t
```

### Database issues
```bash
# Check database file exists
ls -la /home/ubuntu/serrari-challenge/*.db

# Re-run migrations
cd /home/ubuntu/serrari-challenge
npm run db:push
```

### DNS not working
- Wait 30-60 minutes for DNS propagation
- Check DNS: `nslookup YOUR_DOMAIN.com`
- Verify A record points to correct IP

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs serrari-challenge`
2. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment variables: `cat /home/ubuntu/serrari-challenge/.env`
