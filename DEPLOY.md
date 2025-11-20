# Kashflow Kathy - Netlify Deployment Guide

## 🚀 Quick Deploy to Netlify

### Prerequisites
- Netlify account (free tier works)
- Supabase project set up
- Git repository (GitHub, GitLab, or Bitbucket)

### Step 1: Connect Repository

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git provider
4. Select the `kashflowkathy.com` repository

### Step 2: Configure Build Settings

Netlify will auto-detect Next.js, but verify these settings:

**Build command:**
```
npm run build
```

**Publish directory:**
```
.next
```

**Node version:**
```
18
```

### Step 3: Environment Variables

Add these environment variables in Netlify Dashboard → Site Settings → Environment Variables:

#### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://jcyehwievnazbclfbyhi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjeWVod2lldm5hemJjbGZieWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTM0MTAsImV4cCI6MjA3OTE4OTQxMH0.SDE6trVflkWH1wTYhV95nb2HtDft2MlBlOmIxr7LVMo
SUPABASE_URL=https://jcyehwievnazbclfbyhi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjeWVod2lldm5hemJjbGZieWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTM0MTAsImV4cCI6MjA3OTE4OTQxMH0.SDE6trVflkWH1wTYhV95nb2HtDft2MlBlOmIxr7LVMo
OPENAI_API_KEY=your_openai_api_key_here
TELNYX_API_KEY=your_telnyx_api_key_here
ZOOM_API_KEY=your_zoom_api_key
ZOOM_API_SECRET=your_zoom_api_secret
```

#### Optional Variables:
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-site.netlify.app
```

### Step 4: Deploy

Click "Deploy site" and Netlify will:
1. Clone your repository
2. Install dependencies with `npm install --legacy-peer-deps`
3. Run `npm run build`
4. Deploy to CDN

### Step 5: Custom Domain (Optional)

1. Go to Site Settings → Domain Management
2. Add custom domain (e.g., `kashflowkathy.com`)
3. Update DNS records as instructed
4. Netlify will auto-provision SSL certificate

---

## 📦 Manual Deploy (Without Git)

If you prefer manual deployment:

### 1. Build Locally
```bash
cd kashflowkathy.com
npm install --legacy-peer-deps
npm run build
```

### 2. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 3. Login to Netlify
```bash
netlify login
```

### 4. Deploy
```bash
netlify deploy --prod
```

---

## 🔧 Build Optimization

The project is configured with:

✅ **Next.js Standalone Output** - Optimized for serverless
✅ **Image Optimization Disabled** - For Netlify compatibility
✅ **SWC Minification** - Faster builds
✅ **Compression Enabled** - Smaller bundle sizes
✅ **Static Asset Caching** - 1 year cache for static files
✅ **Security Headers** - XSS, clickjacking protection

---

## 🗄️ Database Setup

Before deploying, ensure Supabase database is set up:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `jcyehwievnazbclfbyhi`
3. Click "SQL Editor" → "New Query"
4. Copy contents of `database/schema.sql`
5. Paste and click "Run"

---

## 🔍 Troubleshooting

### Build Fails with Module Not Found
- Ensure all dependencies are in `package.json`
- Check that `--legacy-peer-deps` flag is used

### Environment Variables Not Working
- Double-check variable names (case-sensitive)
- Ensure `NEXT_PUBLIC_` prefix for client-side vars
- Redeploy after adding new variables

### Images Not Loading
- Verify Supabase URL is correct
- Check image domains in `next.config.js`

### 404 on Page Refresh
- Verify `_redirects` file exists in `public/`
- Check `netlify.toml` redirect rules

---

## 📊 Performance Checklist

After deployment, verify:

- [ ] All pages load correctly
- [ ] Contact forms submit to Supabase
- [ ] Calculator saves to CRM
- [ ] Images load from Supabase Storage
- [ ] API routes work (check Network tab)
- [ ] Mobile responsiveness
- [ ] SSL certificate active
- [ ] DNS configured correctly

---

## 🚨 Post-Deployment

1. **Test all features:**
   - Homepage → Contact form
   - Calculator → Saves lead
   - CRM login (masteracct/Number79-2025)
   - Mobile app download page

2. **Monitor logs:**
   - Netlify Dashboard → Functions → Logs
   - Check for any runtime errors

3. **Set up alerts:**
   - Netlify → Notifications
   - Enable build failure alerts

---

## 📱 CDN & Performance

Netlify provides:
- **Global CDN** - 190+ edge locations
- **Atomic Deploys** - Zero downtime
- **Instant Rollbacks** - One-click revert
- **Branch Previews** - Test before production
- **Form Handling** - Built-in form processing

---

## 🔐 Security Notes

- Never commit `.env` file
- Rotate API keys regularly
- Use Netlify Environment Variables for secrets
- Enable HTTPS only (auto-configured)
- Set up DDoS protection in Netlify

---

## 📞 Support

For deployment issues:
- Netlify Docs: https://docs.netlify.com/
- Netlify Support: https://www.netlify.com/support/
- Next.js on Netlify: https://docs.netlify.com/frameworks/next-js/

---

**Built by Pitch Market Strategies & Public Relations LLC**  
Deployed with ❤️ on Netlify
