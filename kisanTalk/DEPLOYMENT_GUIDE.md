# 🚀 KisanTalk Deployment Guide

This guide will help you deploy your KisanTalk application to get a live, public URL.

## 📋 Deployment Architecture

- **Frontend (React)**: Deploy to Vercel or GitHub Pages
- **Backend (Node.js/Express)**: Deploy to Render (Free tier)

---

## 🎯 Quick Deployment (Recommended)

### Step 1: Deploy Backend to Render

1. **Go to Render**: https://render.com
2. **Sign up/Login** with your GitHub account
3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Devadharshini3612/kissan-talk`
   - Configure:
     - **Name**: `kisantalk-backend`
     - **Root Directory**: `kisanTalk/backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Instance Type**: `Free`

4. **Add Environment Variables** (in Render dashboard):
   ```
   PORT=5000
   NODE_ENV=production
   ```

5. **Deploy!** - Render will give you a URL like:
   ```
   https://kisantalk-backend.onrender.com
   ```

6. **Copy this URL** - you'll need it for the frontend!

---

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Import Project**:
   - Click "Add New" → "Project"
   - Import `Devadharshini3612/kissan-talk`
   - Configure:
     - **Framework Preset**: `Create React App`
     - **Root Directory**: `kisanTalk/frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

4. **Add Environment Variable**:
   - Go to Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL = https://kisantalk-backend.onrender.com
     ```
     (Use the URL from Step 1)

5. **Deploy!** - Vercel will give you a URL like:
   ```
   https://kissan-talk.vercel.app
   ```

---

### Step 3: Update Backend CORS

After deploying frontend, update your backend CORS settings:

1. Go to Render dashboard → Your backend service
2. Add environment variable:
   ```
   FRONTEND_URL=https://kissan-talk.vercel.app
   ```

3. Update `backend/server.js` CORS configuration (if needed):
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || 'http://localhost:3000'
   }));
   ```

4. Redeploy backend

---

## 🌐 Alternative: GitHub Pages (Frontend Only)

If you want to use GitHub Pages for the frontend:

### 1. Update Frontend Package.json

Add to `kisanTalk/frontend/package.json`:
```json
{
  "homepage": "https://devadharshini3612.github.io/kissan-talk",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

### 2. Install gh-pages

```bash
cd kisanTalk/frontend
npm install --save-dev gh-pages
```

### 3. Deploy

```bash
npm run deploy
```

Your site will be live at:
```
https://devadharshini3612.github.io/kissan-talk
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Backend API is accessible (visit backend URL)
- [ ] Frontend loads without errors
- [ ] Voice recording works
- [ ] Form submission works
- [ ] Admin dashboard loads
- [ ] API calls connect to backend successfully

---

## 🔧 Troubleshooting

### Issue: CORS Errors
**Solution**: Ensure backend CORS is configured with your frontend URL

### Issue: API Not Connecting
**Solution**: Check `REACT_APP_API_URL` environment variable in Vercel

### Issue: 404 on Refresh (GitHub Pages)
**Solution**: Add a `404.html` that redirects to `index.html`

### Issue: Backend Sleeping (Render Free Tier)
**Solution**: First request may take 30-60 seconds as Render wakes up the service

---

## 📊 Expected URLs

After deployment:

| Service | URL | Example |
|---------|-----|---------|
| Frontend | Vercel | https://kissan-talk.vercel.app |
| Backend | Render | https://kisantalk-backend.onrender.com |
| GitHub Pages | Alternative | https://devadharshini3612.github.io/kissan-talk |

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Public URL to share
- ✅ Live demo for presentations
- ✅ Portfolio-ready project
- ✅ Accessible from anywhere

---

## 📝 Notes

- **Render Free Tier**: Backend may sleep after 15 min of inactivity
- **Vercel Free Tier**: Unlimited bandwidth for personal projects
- **GitHub Pages**: Static hosting, perfect for frontend

---

## 🆘 Need Help?

If you encounter issues:
1. Check deployment logs in Render/Vercel dashboard
2. Verify environment variables are set correctly
3. Test API endpoints directly in browser
4. Check browser console for errors

---

**Ready to deploy? Follow the steps above and your app will be live! 🚀**
