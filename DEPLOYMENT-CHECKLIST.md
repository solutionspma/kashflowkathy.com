# Kashflow Kathy - Production Build Checklist

## ✅ Pre-Deployment Checklist

### Environment Setup
- [ ] Supabase project created and configured
- [ ] Database schema deployed via SQL Editor
- [ ] All environment variables set in Netlify
- [ ] API keys secured (OpenAI, Telnyx, Zoom)
- [ ] Git repository connected to Netlify

### Build Configuration
- [ ] `netlify.toml` configured
- [ ] `next.config.js` optimized for production
- [ ] `.nvmrc` specifies Node 18
- [ ] `_redirects` file in public folder
- [ ] Build script (`netlify-build.sh`) executable

### Code Quality
- [ ] All imports resolved
- [ ] No console errors in development
- [ ] TypeScript types checked (if applicable)
- [ ] ESLint passes
- [ ] No hardcoded secrets

### Testing
- [ ] Homepage loads correctly
- [ ] All 10 website pages accessible
- [ ] Contact form submits to Supabase
- [ ] Calculator saves leads to CRM
- [ ] R&D estimator works
- [ ] CRM login functional
- [ ] Mobile app download page loads

---

## 🚀 Deployment Steps

### Option 1: Git-based Deploy (Recommended)

1. **Initialize Git (if not already)**
   ```bash
   cd kashflowkathy.com
   git init
   git add .
   git commit -m "Initial commit - Ready for Netlify"
   ```

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/kashflowkathy.git
   git branch -M main
   git push -u origin main
   ```

3. **Connect to Netlify**
   - Go to https://app.netlify.com/
   - Click "Add new site" → "Import an existing project"
   - Select GitHub and authorize
   - Choose `kashflowkathy` repository
   - Netlify auto-detects Next.js settings
   - Click "Deploy site"

4. **Add Environment Variables**
   - Site Settings → Environment Variables
   - Add all variables from `.env`
   - Use `NEXT_PUBLIC_` prefix for client-side vars

5. **Trigger Deploy**
   - Deploys automatically on git push
   - Or click "Trigger deploy" in Netlify dashboard

### Option 2: Netlify CLI Deploy

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```

4. **Build Locally**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## 🗄️ Database Setup

**IMPORTANT: Do this BEFORE deploying**

1. Go to https://supabase.com/dashboard
2. Select project: `jcyehwievnazbclfbyhi`
3. SQL Editor → New Query
4. Copy entire contents of `/database/schema.sql`
5. Paste and click "Run"
6. Verify tables created in Table Editor

---

## 🔐 Environment Variables for Netlify

Copy these to Netlify Dashboard → Site Settings → Environment Variables:

```bash
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://jcyehwievnazbclfbyhi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjeWVod2lldm5hemJjbGZieWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTM0MTAsImV4cCI6MjA3OTE4OTQxMH0.SDE6trVflkWH1wTYhV95nb2HtDft2MlBlOmIxr7LVMo
SUPABASE_URL=https://jcyehwievnazbclfbyhi.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjeWVod2lldm5hemJjbGZieWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MTM0MTAsImV4cCI6MjA3OTE4OTQxMH0.SDE6trVflkWH1wTYhV95nb2HtDft2MlBlOmIxr7LVMo

# OpenAI (REQUIRED for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Telnyx (for SMS/Calling)
TELNYX_API_KEY=your_telnyx_api_key_here

# Zoom (for video calls)
ZOOM_API_KEY=your_zoom_api_key_here
ZOOM_API_SECRET=your_zoom_api_secret_here

# App Settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://kashflowkathy.netlify.app
```

---

## 🎯 Post-Deployment Testing

### 1. Verify Homepage
- [ ] Visit deployed URL
- [ ] Particle animation works
- [ ] CTAs clickable
- [ ] Images load

### 2. Test Contact Form
- [ ] Fill out form
- [ ] Submit
- [ ] Check Supabase → contacts table
- [ ] Verify lead appears

### 3. Test Calculator
- [ ] Enter property details
- [ ] Calculate savings
- [ ] Verify lead saved in CRM

### 4. Test CRM Access
- [ ] Navigate to /crm
- [ ] Login with: masteracct / Number79-2025
- [ ] Verify dashboard loads
- [ ] Check contacts appear

### 5. Mobile Responsiveness
- [ ] Test on mobile device
- [ ] Check all pages
- [ ] Verify forms work

---

## 📊 Monitoring

### Netlify Analytics
- Enable in Site Settings → Analytics
- Track visitors, page views, bandwidth

### Error Monitoring
- Check Functions → Logs for errors
- Set up email alerts for build failures

### Performance
- Run Lighthouse audit
- Check Core Web Vitals
- Optimize images if needed

---

## 🔄 Continuous Deployment

Once connected to Git:

1. Make code changes locally
2. Commit: `git commit -am "Update feature"`
3. Push: `git push origin main`
4. Netlify auto-deploys
5. Preview at deploy URL
6. Promote to production

---

## 🌐 Custom Domain Setup

1. **Add Domain in Netlify**
   - Site Settings → Domain Management
   - Add custom domain: `kashflowkathy.com`

2. **Update DNS Records**
   ```
   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify load balancer)
   
   Type: CNAME
   Name: www
   Value: kashflowkathy.netlify.app
   ```

3. **Enable HTTPS**
   - Auto-provisioned by Netlify
   - Uses Let's Encrypt
   - Renews automatically

4. **Update Environment**
   ```
   NEXT_PUBLIC_APP_URL=https://kashflowkathy.com
   ```

---

## 🚨 Troubleshooting

### Build Fails
**Error:** `Module not found`
- Check `package.json` dependencies
- Ensure `--legacy-peer-deps` flag used
- Clear cache: Deploy Settings → Clear cache and deploy

**Error:** `Out of memory`
- Increase Node memory: Add `NODE_OPTIONS=--max_old_space_size=4096`

### Runtime Errors
**Error:** `NEXT_PUBLIC_SUPABASE_URL is undefined`
- Verify env vars in Netlify dashboard
- Check `NEXT_PUBLIC_` prefix
- Redeploy after adding

**Error:** `Failed to fetch`
- Check CORS settings in Supabase
- Verify API URLs are correct
- Check network tab for blocked requests

### Performance Issues
- Enable Netlify CDN caching
- Optimize images (use WebP)
- Minify CSS/JS
- Enable Brotli compression

---

## 📈 Optimization Tips

1. **Enable Netlify Edge**
   - Faster global delivery
   - Reduced latency

2. **Use Netlify Forms**
   - Built-in spam protection
   - Form submissions without backend

3. **Add Netlify Functions**
   - Serverless API endpoints
   - No server management

4. **Enable Asset Optimization**
   - Auto-minify JS/CSS
   - Image optimization
   - Bundle splitting

---

## ✅ Final Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database schema deployed
- [ ] All features tested
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics enabled
- [ ] Error monitoring set up
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team members notified

---

**Deployment Status:** 🟢 Ready for Production

**Built by:** Pitch Market Strategies & Public Relations LLC  
**Platform:** Netlify  
**Framework:** Next.js 14  
**Database:** Supabase  
**CDN:** Netlify Edge
