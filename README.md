# Adult Content Platform - Deployment Guide

A professional adult content streaming platform with admin dashboard, category management, and integrated ad monetization.

## 🚀 Quick Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**📖 Detailed Guides:**
- **[Complete Render Deployment Guide](RENDER_DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[Ad Network Setup Guide](AD_NETWORK_SETUP.md)** - ExoClick & PopAds integration

## 📋 Required Environment Variables

### Admin Access (Required)
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

**For testing:** Default credentials are `admin` / `admin123` (change these in production!)

### Database (Auto-configured on Render)
```bash
DATABASE_URL=postgresql://...  # Automatically set by Render PostgreSQL
```

### Ad Network Integration (Get from dashboards)

#### ExoClick Zone IDs
Get these from your ExoClick publisher dashboard after site verification:
```bash
VITE_EXOCLICK_HEADER_ZONE=1234567        # Header banner (728x90)
VITE_EXOCLICK_CONTENT_ZONE=1234568       # Content banner (300x250)
VITE_EXOCLICK_SIDEBAR_ZONE=1234569       # Sidebar banner (160x600)
VITE_EXOCLICK_SIDEBAR_ZONE_2=1234570     # Bottom sidebar (300x250)
```

#### PopAds Site ID
Get from your PopAds publisher dashboard:
```bash
VITE_POPADS_SITE_ID=abcdef123456         # Your site ID from PopAds
```

#### Revenue Tracking
```bash
ENABLE_REVENUE_TRACKING=true
EXOCLICK_CPM_RATE=2.50
POPADS_CPM_RATE=1.50
```

## 🔧 Render Deployment Steps

### 1. Create New Web Service
- Go to [Render Dashboard](https://dashboard.render.com/)
- Click "New +" → "Web Service"
- Connect your GitHub repository

### 2. Configure Build Settings
```
Build Command: npm install
Start Command: npm start
```

### 3. Add Environment Variables
In Render dashboard, add all the environment variables listed above:

**Required immediately:**
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

**Add later when you get ad network approval:**
- All `VITE_EXOCLICK_*` variables
- `VITE_POPADS_SITE_ID`

### 4. Add PostgreSQL Database
- In Render dashboard, create new PostgreSQL database
- Copy the `DATABASE_URL` to your environment variables

### 5. Deploy
- Click "Create Web Service"
- Wait for deployment to complete
- Your site will be available at `https://yourapp.onrender.com`

## 📊 Ad Network Setup Process

### Step 1: Deploy Basic Site
1. Deploy with just admin credentials
2. Add some videos via admin dashboard
3. Get real traffic to your site

### Step 2: Apply to Ad Networks

#### ExoClick Setup
1. Sign up: https://www.exoclick.com/signup
2. Add your deployed site URL
3. Complete verification (HTML file already included)
4. Create 4 zones in dashboard:
   - Header Banner (728x90)
   - Content Banner (300x250) 
   - Sidebar Banner (160x600)
   - Sidebar Banner 2 (300x250)
5. Copy zone IDs to environment variables

#### PopAds Setup
1. Sign up: https://www.popads.net/users/create
2. Add your site URL
3. Get site ID from dashboard
4. Add to `VITE_POPADS_SITE_ID`

### Step 3: Update Environment Variables
Add all the zone IDs to your Render environment variables and restart the service.

## 💰 Revenue Expectations

| Traffic Level | ExoClick Revenue | PopAds Revenue | Total Monthly |
|---------------|------------------|----------------|---------------|
| 0-1K daily    | $30-80          | $20-50         | $50-130       |
| 1K-5K daily   | $150-400        | $100-250       | $250-650      |
| 5K+ daily     | $500-1500       | $300-800       | $800-2300     |

## 🔐 Admin Dashboard Access

After deployment, access admin features at:
- **Login**: `https://yoursite.com/admin/login`
- **Dashboard**: `https://yoursite.com/admin`

Default credentials (change these):
- Username: `admin`
- Password: `your_secure_password_here`

## 📹 Video Management

### Adding Videos
1. Login to admin dashboard
2. Click "Add Video"
3. Enter video details:
   - **Title**: Video title
   - **External URL**: Video hosted elsewhere (YouTube, Vimeo, etc.)
   - **Category**: Choose from 12 categories
   - **Creator**: Video creator name
   - **Duration**: Video length in minutes
   - **Featured**: Mark as premium content

### Supported Video Hosts
- YouTube (automatic thumbnail extraction)
- Vimeo (automatic thumbnail extraction)
- Dailymotion (automatic thumbnail extraction)
- Adult video hosts (with fallback thumbnails)
- Any video hosting service (gradient thumbnails)

## 📱 Categories Available

- Premium
- Amateur
- Professional
- Trending
- Hot
- New
- Indian
- Desi
- Viral
- Popular
- HD Quality
- Exclusive

## 🛠 Troubleshooting

### Site Not Loading
- Check build logs in Render dashboard
- Verify all required environment variables are set
- Ensure PostgreSQL database is connected

### Ads Not Showing
- Verify ad network zone IDs are correct
- Check browser console for errors
- Ensure environment variables start with `VITE_` for frontend access

### Admin Access Issues
- Double-check `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Try clearing browser cache
- Check database connection

### Revenue Not Tracking
- Ensure `ENABLE_REVENUE_TRACKING=true`
- Check admin dashboard for analytics
- Verify ad network integration

## 📞 Support

- **Platform Issues**: Check admin dashboard logs
- **ExoClick Support**: support@exoclick.com
- **PopAds Support**: support@popads.net
- **Render Support**: https://render.com/docs

## 🔄 Updates

When you get your ad network zone IDs:
1. Add them to Render environment variables
2. Restart your service
3. Ads will start showing automatically
4. Monitor revenue in admin dashboard

## 📈 Growth Strategy

1. **Content**: Add quality videos regularly
2. **SEO**: Optimize for adult content keywords
3. **Traffic**: Promote via Telegram channel
4. **Monetization**: Add more ad networks as traffic grows
5. **Analytics**: Monitor performance via admin dashboard

---

**Remember**: Keep your admin credentials secure and update them regularly!