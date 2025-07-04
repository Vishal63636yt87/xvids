# 🚀 Deploy to Render - Complete Guide

## Step 1: Create Render Account & Connect Repository

1. **Go to [Render.com](https://render.com)** and sign up/login
2. **Click "New +"** → **"Web Service"**
3. **Connect your GitHub repository** (grant Render access to your repo)
4. **Select your repository** from the list

## Step 2: Configure Render Service Settings

### Basic Settings
- **Name**: `your-site-name` (this becomes your URL: `your-site-name.onrender.com`)
- **Environment**: `Node`
- **Region**: Choose closest to your audience (US East for global, Frankfurt for EU)
- **Branch**: `main` (or your default branch)

### Build & Deploy Settings
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` (recommended)

## Step 3: Add Environment Variables

### Required Admin Credentials
```
ADMIN_USERNAME = admin
ADMIN_PASSWORD = your_secure_password_here
```
**⚠️ IMPORTANT**: Change the password from default `admin123`!

### Database Configuration
```
DATABASE_URL = your_postgresql_connection_string
```

### ExoClick Configuration
```
EXOCLICK_ZONE_BANNER = your_exoclick_banner_zone_id
EXOCLICK_ZONE_SIDEBAR = your_exoclick_sidebar_zone_id
EXOCLICK_ZONE_POPUP = your_exoclick_popup_zone_id
```

### PopAds Configuration
```
POPADS_SITE_ID = your_popads_site_id
```

### Session Security (Generate Random String)
```
SESSION_SECRET = your_32_character_random_string_here
```

## Step 4: Get Your Ad Network Zone IDs

### ExoClick Setup
1. **Register at [ExoClick.com](https://www.exoclick.com)**
2. **Go to "Sites" → "Add Site"**
3. **Add your Render URL**: `https://your-site-name.onrender.com`
4. **Create Ad Zones**:
   - Banner (300x250 or 728x90)
   - Sidebar (160x600 or 300x250)
   - Pop-under/Pop-up
5. **Copy the Zone IDs** (numbers like `1234567`)

### PopAds Setup
1. **Register at [PopAds.net](https://www.popads.net)**
2. **Go to Publishers → Add Site**
3. **Add your domain**: `your-site-name.onrender.com`
4. **Copy your Site ID** (usually 6-8 digits)

## Step 5: Database Setup

### Option A: Use Render PostgreSQL (Recommended)
1. **In Render Dashboard** → **"New +"** → **"PostgreSQL"**
2. **Name**: `your-site-db`
3. **Copy the External Database URL**
4. **Add to Environment Variables** as `DATABASE_URL`

### Option B: Use Neon (Free Alternative)
1. **Go to [Neon.tech](https://neon.tech)**
2. **Create account and new project**
3. **Copy connection string**
4. **Add to Environment Variables** as `DATABASE_URL`

## Step 6: Deploy

1. **Click "Create Web Service"**
2. **Wait for build to complete** (usually 3-5 minutes)
3. **Your site will be live** at `https://your-site-name.onrender.com`

## Step 7: Test Your Deployment

### Test Admin Access
1. **Go to your site**
2. **Click "Admin Login"**
3. **Login with your ADMIN_USERNAME/ADMIN_PASSWORD**
4. **Verify you can access admin dashboard**

### Test Ad Integration
1. **Check if ads appear** (may take 24-48 hours for approval)
2. **Click test ads** to verify tracking works
3. **Check revenue dashboard** for click/impression data

## Step 8: Domain Setup (Optional)

### Add Custom Domain
1. **In Render Dashboard** → **Your Service** → **Settings**
2. **Custom Domains** → **Add Custom Domain**
3. **Enter your domain** (e.g., `yoursite.com`)
4. **Update DNS** with provided CNAME record
5. **SSL certificate** will be automatically provisioned

## Troubleshooting

### Common Issues

**Build Fails**
- Check Node.js version is 18+
- Verify `package.json` has correct scripts
- Check build logs for specific errors

**Database Connection Error**
- Verify `DATABASE_URL` is correctly formatted
- Check database is running and accessible
- Run database migration: `npm run db:push`

**Admin Login Not Working**
- Check `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set
- Verify `SESSION_SECRET` is configured
- Clear browser cookies and try again

**Ads Not Showing**
- Verify zone IDs are correct numbers (no extra characters)
- Check ad network approval status (can take 24-48 hours)
- Ensure site content complies with ad network policies

### Environment Variables Example
```bash
# Admin Access
ADMIN_USERNAME=admin
ADMIN_PASSWORD=MySecurePassword123!

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# ExoClick
EXOCLICK_ZONE_BANNER=1234567
EXOCLICK_ZONE_SIDEBAR=2345678
EXOCLICK_ZONE_POPUP=3456789

# PopAds
POPADS_SITE_ID=87654321

# Security
SESSION_SECRET=abc123xyz789def456ghi012jkl345mno678pqr901stu234
```

## Revenue Optimization Tips

1. **Place ads strategically** - Users see them but don't find intrusive
2. **Monitor click rates** - Aim for 1-3% click-through rate
3. **Test different ad sizes** - 300x250 typically performs well
4. **Check analytics daily** - Track revenue trends in admin dashboard
5. **Optimize for mobile** - Most traffic comes from mobile devices

## Next Steps After Deployment

1. **Submit to search engines** (Google Search Console, Bing Webmaster)
2. **Set up analytics** (Google Analytics for traffic tracking)
3. **Add more video content** via admin panel
4. **Monitor ad performance** and optimize placement
5. **Scale traffic** through SEO and social media

---

**Need Help?** 
- Check Render logs in dashboard for error details
- Review ad network approval requirements
- Test locally first before deployment