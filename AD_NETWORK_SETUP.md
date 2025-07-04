# 💰 Ad Network Setup Guide

## ExoClick Zone ID Setup

### Step 1: Register & Add Site
1. **Sign up at [ExoClick.com](https://www.exoclick.com)**
2. **Go to Sites → Add Site**
3. **Enter your domain**: `your-site-name.onrender.com`
4. **Select Category**: Adult Content
5. **Wait for site approval** (usually instant for adult sites)

### Step 2: Create Ad Zones
**Go to "Ad Zones" → "Create New Zone"**

#### Banner Zone (300x250)
- **Zone Type**: Banner
- **Size**: 300x250 (Medium Rectangle)
- **Name**: "Main Banner"
- **Copy the Zone ID** (6-7 digit number)

#### Sidebar Zone (160x600)  
- **Zone Type**: Banner
- **Size**: 160x600 (Wide Skyscraper)
- **Name**: "Sidebar Banner"
- **Copy the Zone ID**

#### Popup Zone
- **Zone Type**: Pop-under
- **Name**: "Main Popup"
- **Copy the Zone ID**

### Step 3: Add to Environment Variables
```bash
EXOCLICK_ZONE_BANNER=1234567    # Your 300x250 banner zone ID
EXOCLICK_ZONE_SIDEBAR=2345678   # Your 160x600 sidebar zone ID  
EXOCLICK_ZONE_POPUP=3456789     # Your popup zone ID
```

## PopAds Site ID Setup

### Step 1: Register & Add Site
1. **Sign up at [PopAds.net](https://www.popads.net)**
2. **Go to Publishers Section**
3. **Click "Add Website"**
4. **Enter your domain**: `your-site-name.onrender.com`
5. **Category**: Adult
6. **Wait for approval** (1-24 hours)

### Step 2: Get Site ID
1. **After approval, go to "My Sites"**
2. **Find your site in the list**
3. **Copy the Site ID** (6-8 digit number)

### Step 3: Add to Environment Variables
```bash
POPADS_SITE_ID=87654321    # Your PopAds site ID
```

## Revenue Expectations

### ExoClick Rates (India Market)
- **Banner CPM**: $2.50-4.00
- **Popup CPM**: $3.00-5.00
- **Click Rate**: 1-3% typical
- **Daily Revenue**: $50-150 (10k-50k views)

### PopAds Rates
- **Popup CPM**: $1.50-3.00
- **Geographic bonus** for tier 1 countries
- **Mobile premium** (+20-30%)

## Testing Your Setup

### Verify Zone IDs Work
1. **Deploy to Render with zone IDs**
2. **Visit your site**
3. **Check browser console** for ad loading
4. **Look for ads appearing** (may take 24-48 hours)

### Test Commands (Local)
```bash
# Check if environment variables are set
echo $EXOCLICK_ZONE_BANNER
echo $POPADS_SITE_ID

# Test ad loading (should show zone IDs, not "Setup Required")
curl http://localhost:5000/api/ads/active
```

## Troubleshooting

### Ads Not Showing
- **Zone IDs incorrect**: Double-check numbers from ad network dashboard
- **Site not approved**: Check approval status in ad network account
- **Ad blockers**: Test in incognito mode or different browser
- **Content policy**: Ensure your content meets ad network guidelines

### Low Revenue
- **Traffic quality**: Focus on organic traffic from search engines
- **Geographic targeting**: Tier 1 countries (US, UK, Canada) pay more
- **Mobile optimization**: Most adult traffic is mobile
- **Ad placement**: Put ads where users naturally look

### Account Issues
- **Minimum payout**: ExoClick $20, PopAds $25
- **Payment methods**: PayPal, Wire Transfer, Crypto
- **Payment schedule**: Net-30 (30 days after month end)

## Revenue Optimization Tips

### Best Performing Ad Sizes
1. **300x250 Banner** - Highest CTR for adult content
2. **728x90 Leaderboard** - Good for header/footer
3. **160x600 Skyscraper** - Effective for sidebar
4. **Pop-under** - Highest CPM but use sparingly

### Traffic Optimization
1. **SEO**: Target long-tail keywords
2. **Social Media**: Twitter, Reddit (follow rules)
3. **Tube Sites**: Post previews with site links
4. **Forums**: Engage in adult communities
5. **Mobile**: Optimize for mobile users (70%+ of traffic)

### Revenue Tracking
- **Check daily** in admin dashboard
- **Monitor click rates** (aim for 1-3%)
- **Test ad positions** for optimal performance
- **A/B test** different ad networks

---

**Quick Start Checklist:**
- [ ] Register at ExoClick.com
- [ ] Register at PopAds.net  
- [ ] Create ad zones and get IDs
- [ ] Add zone IDs to Render environment variables
- [ ] Deploy and test
- [ ] Monitor revenue in admin dashboard