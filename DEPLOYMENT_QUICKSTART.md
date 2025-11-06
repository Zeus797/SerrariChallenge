# Deployment Quick Start Guide

Complete deployment solution for your SerrariChallenge platform.

---

## Overview

This deployment setup includes:

✅ **AWS Lightsail hosting** - Cheapest option ($3.50-5/month)
✅ **SQLite database** - No extra database costs
✅ **Admin API endpoints** - Easy data access via HTTP
✅ **Hostinger domain integration** - Simple DNS configuration
✅ **Free SSL/HTTPS** - Let's Encrypt certificates

---

## What's Been Implemented

### 1. Server Configuration Changes
- ✅ Server now listens on `0.0.0.0` in production (allows external connections)
- ✅ Environment-based configuration (development vs production)

### 2. Admin API Endpoints

Four new protected endpoints for accessing data:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/admin/email-captures` | Get all email captures with scores |
| `GET /api/admin/test-results` | Get all test results |
| `GET /api/admin/export/email-captures?format=csv` | Export emails as CSV |
| `GET /api/admin/export/test-results?format=csv` | Export results as CSV |

All endpoints require `x-admin-key` header for authentication.

### 3. Environment Variables

New variables in `.env`:
```env
DATABASE_URL=file:./dev.db
ADMIN_API_KEY=your-secure-key-here
NODE_ENV=production
PORT=5000
```

### 4. Documentation

Three comprehensive guides created:

1. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete AWS Lightsail deployment guide
2. **[DOMAIN_SETUP.md](DOMAIN_SETUP.md)** - Hostinger DNS configuration
3. **[API_REFERENCE.md](API_REFERENCE.md)** - Admin API documentation with examples

---

## Deployment Steps (Summary)

### Step 1: AWS Lightsail Setup (15 minutes)
1. Create AWS account
2. Launch Ubuntu instance ($3.50/month)
3. Create static IP
4. Configure firewall (HTTP, HTTPS, SSH)

📖 **See:** [DEPLOYMENT.md - Part 1](DEPLOYMENT.md#part-1-aws-lightsail-setup)

### Step 2: Server Installation (20 minutes)
1. SSH into server
2. Install Node.js and dependencies
3. Upload your code
4. Configure environment variables
5. Build and start with PM2

📖 **See:** [DEPLOYMENT.md - Part 2](DEPLOYMENT.md#part-2-server-setup)

### Step 3: Domain Configuration (5 minutes + wait time)
1. Get your AWS static IP
2. Log in to Hostinger
3. Update DNS A records
4. Wait for propagation (15-30 mins)

📖 **See:** [DOMAIN_SETUP.md](DOMAIN_SETUP.md)

### Step 4: SSL Certificate (5 minutes)
1. Install Certbot
2. Run Let's Encrypt setup
3. Auto-redirect HTTP to HTTPS

📖 **See:** [DEPLOYMENT.md - Part 4](DEPLOYMENT.md#part-4-sslhttps-setup-free-with-lets-encrypt)

---

## Quick Commands Reference

### Test Admin API Locally

```bash
# Start dev server
npm run dev

# In another terminal, test admin endpoint
curl -H "x-admin-key: dev-admin-key-replace-in-production" \
  http://localhost:5000/api/admin/email-captures
```

### Deploy Updates

```bash
# On server
cd /home/ubuntu/serrari-challenge
git pull
npm install
npm run build
pm2 restart serrari-challenge
```

### View Logs

```bash
# On server
pm2 logs serrari-challenge
```

### Backup Database

```bash
# On server
cp production.db backup-$(date +%Y%m%d).db
```

---

## Sharing Data Access

### For Non-Technical Users

Share the admin API key and these URLs:

**View all email captures:**
```
https://YOUR_DOMAIN.com/api/admin/email-captures
```

**Download CSV:**
```
https://YOUR_DOMAIN.com/api/admin/export/email-captures?format=csv
```

They'll need to add the header `x-admin-key: YOUR_API_KEY` using browser extensions like:
- ModHeader (Chrome)
- Requestly (Chrome/Firefox)

Or use tools like:
- Postman
- Insomnia
- curl

### For Web Developers

Share:
1. Base URL: `https://YOUR_DOMAIN.com/api/admin`
2. Admin API Key
3. [API_REFERENCE.md](API_REFERENCE.md) documentation

Example integration:
```javascript
const response = await fetch('https://YOUR_DOMAIN.com/api/admin/email-captures', {
  headers: { 'x-admin-key': 'YOUR_ADMIN_API_KEY' }
});
const { data } = await response.json();
```

---

## Cost Breakdown

| Service | Monthly Cost |
|---------|--------------|
| AWS Lightsail (512MB instance) | $3.50 |
| Domain (already owned) | $0 |
| SSL Certificate (Let's Encrypt) | $0 |
| Database (SQLite) | $0 |
| **Total** | **$3.50/month** |

Can upgrade to $5/month (1GB RAM) if needed for more traffic.

---

## Architecture

```
User's Browser
     ↓
Hostinger DNS (A Record)
     ↓
AWS Lightsail Static IP
     ↓
Nginx (Port 80/443) → SSL
     ↓
Your Node.js App (Port 3000)
     ↓
SQLite Database (production.db)
```

---

## File Changes Summary

### Modified Files
- [server/index.ts](server/index.ts#L65-L67) - Added production host configuration
- [server/routes.ts](server/routes.ts#L21-L147) - Added admin endpoints + auth
- [server/storage.ts](server/storage.ts#L51-L53) - Added test results query
- [.env](.env) - Added admin API key

### New Files
- [.env.example](.env.example) - Environment template
- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
- [DOMAIN_SETUP.md](DOMAIN_SETUP.md) - DNS configuration
- [API_REFERENCE.md](API_REFERENCE.md) - API documentation
- [DEPLOYMENT_QUICKSTART.md](DEPLOYMENT_QUICKSTART.md) - This file

---

## Security Checklist

Before going live:

- [ ] Generate secure `ADMIN_API_KEY` (use `openssl rand -hex 32`)
- [ ] Never commit `.env` to git (already in .gitignore)
- [ ] Enable HTTPS/SSL with Let's Encrypt
- [ ] Set `NODE_ENV=production` in production .env
- [ ] Keep admin API key private
- [ ] Set up regular database backups
- [ ] Monitor PM2 logs regularly

---

## Testing Checklist

Before giving access:

- [ ] App accessible via domain (http://YOUR_DOMAIN.com)
- [ ] HTTPS working (https://YOUR_DOMAIN.com)
- [ ] Admin endpoints return data
- [ ] CSV export downloads correctly
- [ ] JSON export downloads correctly
- [ ] Authentication rejects invalid API keys
- [ ] PM2 keeps app running after server reboot

---

## Next Steps

1. **Deploy to AWS** - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Configure domain** - Follow [DOMAIN_SETUP.md](DOMAIN_SETUP.md)
3. **Test admin API** - Use examples in [API_REFERENCE.md](API_REFERENCE.md)
4. **Share access** - Give admin API key to authorized users
5. **Monitor** - Check logs and set up backups

---

## Support Resources

- **AWS Lightsail Docs**: https://lightsail.aws.amazon.com/ls/docs
- **Let's Encrypt**: https://letsencrypt.org/
- **PM2 Docs**: https://pm2.keymetrics.io/docs/usage/quick-start/
- **Nginx Docs**: https://nginx.org/en/docs/

---

## Troubleshooting

### Can't access via domain?
→ Check [DOMAIN_SETUP.md - Common Issues](DOMAIN_SETUP.md#common-issues--solutions)

### App not running?
```bash
pm2 logs serrari-challenge
pm2 restart serrari-challenge
```

### Admin API returns 401?
- Verify API key matches `.env` file
- Check header name: `x-admin-key` (lowercase)

### Need to update code?
```bash
cd /home/ubuntu/serrari-challenge
git pull
npm run build
pm2 restart serrari-challenge
```

---

## Questions?

All implementation is complete. Follow the guides in order:
1. DEPLOYMENT.md (AWS setup)
2. DOMAIN_SETUP.md (DNS)
3. API_REFERENCE.md (accessing data)

Good luck with your deployment! 🚀
