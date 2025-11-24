# Render Static Site Redirect Configuration

## 🎯 Problem: 404 Error on Routes like `/user`, `/admin`

When you access `https://pravarahealthcare-7my6.onrender.com/user` directly, you get 404 because the server doesn't know about React Router routes.

## ✅ Solution: Configure Redirects in Render Dashboard

### Step-by-Step Instructions:

### Step 1: Go to Render Dashboard
1. Open [dashboard.render.com](https://dashboard.render.com)
2. Login to your account
3. Find your **frontend static site** service
4. Click on it

### Step 2: Configure Redirects
1. Click on **"Settings"** tab (left sidebar)
2. Scroll down to find **"Redirects and Rewrites"** section
3. Click **"Add Redirect"** or **"Configure"**

### Step 3: Add Redirect Rule
Add this redirect:
- **Source Path:** `/*` (all routes)
- **Destination:** `/index.html`
- **Status Code:** `200` (Important: NOT 301 or 302)

**Why 200?**
- 200 = Serve the file (SPA routing)
- 301/302 = Redirect (will cause issues)

### Step 4: Save and Redeploy
1. Click **"Save Changes"**
2. Render will automatically redeploy
3. Wait 2-3 minutes for deployment

### Step 5: Test
After deployment, test:
- `https://pravarahealthcare-7my6.onrender.com/user` ✅
- `https://pravarahealthcare-7my6.onrender.com/admin` ✅
- `https://pravarahealthcare-7my6.onrender.com/login` ✅

## 📸 Visual Guide (What to Look For):

In Render Dashboard → Your Static Site → Settings:

```
Redirects and Rewrites
┌─────────────────────────────────────────┐
│ Source: /*                               │
│ Destination: /index.html                 │
│ Status: 200                               │
│ [Save]                                    │
└─────────────────────────────────────────┘
```

## 🔄 Alternative: If Redirects Section Not Available

Some Render plans might not have the redirects UI. In that case:

### Option 1: Use _redirects File (Already Created)
The file `frontend/public/_redirects` is already created. After you:
1. Commit and push to Git
2. Render will rebuild
3. The file should be in `dist/_redirects`

### Option 2: Contact Render Support
Ask them to configure:
```
/* → /index.html (200 status)
```

## ✅ Verification Checklist

After configuring redirects:

- [ ] Redirect rule added in Render dashboard
- [ ] Status code is 200 (not 301/302)
- [ ] Frontend service redeployed
- [ ] Test `/user` - works ✅
- [ ] Test `/admin` - works ✅
- [ ] Test `/login` - works ✅
- [ ] Direct URL access works (refresh page)
- [ ] No 404 errors in browser console

## 🚨 Common Mistakes to Avoid

1. ❌ **Using 301/302 status** → Will cause redirect loops
2. ❌ **Wrong source path** → Should be `/*` not `/`
3. ❌ **Not redeploying** → Changes need deployment
4. ❌ **Testing too soon** → Wait for deployment to complete

## 📋 Quick Reference

**Redirect Configuration:**
```
Source: /*
Destination: /index.html
Status: 200
```

**Why This Works:**
- `/*` matches all routes
- `/index.html` serves the React app
- `200` status serves the file (not redirect)
- React Router handles client-side routing

---

## 🆘 Still Getting 404?

1. **Check Render Dashboard:**
   - Settings → Redirects section
   - Verify rule is saved

2. **Check Deployment:**
   - Events tab → Latest deployment successful?
   - Logs tab → Any errors?

3. **Clear Browser Cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Test in Incognito:**
   - Open incognito/private window
   - Test the URL again

5. **Check Build Output:**
   - Verify `_redirects` file is in `dist` folder
   - Check Render build logs


