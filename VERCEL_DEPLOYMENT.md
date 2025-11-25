# Deploying NearBuY to Vercel

## ✅ Your Code is Ready on GitHub
Repository: `https://github.com/johnbosco6/nearbuy`

## 🚀 Method 1: Vercel Dashboard (Easiest - Recommended)

### Steps:
1. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign in
2. **New Project**: Click "Add New..." → "Project"
3. **Import Repository**:
   - Click "Import Git Repository"
   - Authorize Vercel to access your GitHub account (if first time)
   - Find and select `johnbosco6/nearbuy`
   - Click "Import"
4. **Configure** (Vercel auto-detects Vite):
   - Framework Preset: **Vite** ✅
   - Build Command: `npm run build` ✅
   - Output Directory: `dist` ✅
   - Install Command: `npm install` ✅
5. **Deploy**: Click "Deploy" button

### Result:
- ✅ Your app will be live at: `https://nearbuy.vercel.app` (or similar)
- ✅ Auto-deploys on every git push to main
- ✅ Free SSL certificate
- ✅ Global CDN

---

## 🖥️ Method 2: Vercel CLI

### Install Vercel CLI:
```bash
npm install -g vercel
```

### Deploy:
```bash
cd "c:/Users/wikto/OneDrive/Pulpit/Nearby App"
vercel
```

### Follow the prompts:
1. "Set up and deploy?" → **Y**
2. "Which scope?" → Select your account
3. "Link to existing project?" → **N**
4. "What's your project's name?" → **nearbuy**
5. "In which directory is your code located?" → **./
**
6. Vercel will auto-detect Vite settings
7. Confirm and deploy!

### Production Deployment:
```bash
vercel --prod
```

---

## 🎯 What You Get with Vercel

✅ **Automatic Deployments**: Every git push deploys automatically
✅ **Preview Deployments**: Every PR gets its own preview URL
✅ **Custom Domain**: Can add your own domain later
✅ **Analytics**: Built-in performance analytics
✅ **Edge Network**: Fast global CDN
✅ **HTTPS**: Free SSL certificate

---

## 📱 After Deployment

### Test Your Live App:
1. Visit your Vercel URL
2. Test all features:
   - Barcode scanning
   - Product search
   - Deals/Coupons
   - Maps
   - Profile
   - PWA installation

### Share Your App:
- Share the Vercel URL with users
- Install as PWA on mobile devices
- Add custom domain (optional)

---

## 🔄 Future Updates

To update your deployed app:
```bash
git add .
git commit -m "Update message"
git push
```

Vercel will automatically rebuild and redeploy!

---

## 🆘 Troubleshooting

**Build fails?**
- Check the build logs in Vercel dashboard
- Ensure `npm run build` works locally first

**App not working?**
- Check browser console for errors
- Verify all API calls work with HTTPS

**Need help?**
- Vercel docs: https://vercel.com/docs
- Check deployment logs in dashboard

---

Enjoy your deployed NearBuY app! 🎉
