# 🚀 Render Deployment Checklist

## Step 1: Deploy Basic Site (Required Now)

### Environment Variables to Set in Render:
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
DATABASE_URL=[auto-configured by Render PostgreSQL]
```

### Build Settings:
```
Build Command: npm install
Start Command: npm start
```

## Step 2: Get Ad Network Zone IDs (After Site Goes Live)

### ExoClick Setup Process:
1. Sign up at https://www.exoclick.com/signup
2. Add your Render URL (https://yourapp.onrender.com)
3. Complete HTML verification (file already included)
4. Create 4 ad zones and get these IDs:

```
VITE_EXOCLICK_HEADER_ZONE=your_zone_id_here
VITE_EXOCLICK_CONTENT_ZONE=your_zone_id_here
VITE_EXOCLICK_SIDEBAR_ZONE=your_zone_id_here
VITE_EXOCLICK_SIDEBAR_ZONE_2=your_zone_id_here
```

### PopAds Setup Process:
1. Sign up at https://www.popads.net/users/create
2. Add your site URL
3. Get site ID and add:

```
VITE_POPADS_SITE_ID=your_site_id_here
```

### Revenue Tracking:
```
ENABLE_REVENUE_TRACKING=true
EXOCLICK_CPM_RATE=2.50
POPADS_CPM_RATE=1.50
```

## Step 3: Update Render Environment

Once you get the ad network IDs:
1. Go to Render dashboard
2. Add all the `VITE_EXOCLICK_*` and `VITE_POPADS_*` variables
3. Restart your service
4. Ads will start showing automatically

## 💰 Expected Revenue Timeline

**Week 1-2**: Get site approved by ad networks
**Week 3-4**: Start earning $10-30/month with basic traffic
**Month 2-3**: Scale to $50-150/month with content growth
**Month 4+**: Potential $200-500+/month with good traffic

## 🔑 Admin Access After Deployment

- URL: `https://yourapp.onrender.com/admin/login`
- Username: Whatever you set in `ADMIN_USERNAME`
- Password: Whatever you set in `ADMIN_PASSWORD`

## ✅ Quick Test Checklist

After deployment:
- [ ] Site loads at your Render URL
- [ ] Admin login works
- [ ] Can add videos via admin dashboard
- [ ] Videos display on homepage
- [ ] Ad placeholder areas show "Setup Required" messages
- [ ] Revenue dashboard accessible

After ad network setup:
- [ ] ExoClick ads load in header/sidebar/content areas
- [ ] PopAds triggers on clicks (max 1 per 24 hours)
- [ ] Revenue tracking shows in admin dashboard

## 🆘 If Something Goes Wrong

1. **Site won't load**: Check Render build logs
2. **Admin won't login**: Verify environment variables
3. **Database errors**: Ensure PostgreSQL is connected
4. **Ads not showing**: Check zone IDs are correct and restart service

Remember: You can deploy now and add ad network IDs later!