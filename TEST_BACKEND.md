# How to Check if Backend URL is Working

## 🎯 Quick Test Methods

### Method 1: Health Check Endpoint (Easiest) ✅

**Open in Browser:**
```
https://your-backend-url.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

**If you see this** → Backend is working! ✅

**If you get:**
- ❌ Connection refused → Backend is down
- ❌ 404 Not Found → Wrong URL
- ❌ Timeout → Backend might be sleeping (wait 30-60 seconds)

---

### Method 2: Test from Browser Console

1. Open your **frontend** in browser
2. Press **F12** (Developer Tools)
3. Go to **Console** tab
4. Type this and press Enter:

```javascript
fetch('https://your-backend-url.onrender.com/api/health')
  .then(res => res.json())
  .then(data => console.log('Backend Status:', data))
  .catch(err => console.error('Backend Error:', err));
```

**Expected Output:**
```
Backend Status: {status: "OK", message: "Server is running"}
```

---

### Method 3: Test API Endpoint

**Test Employees Endpoint:**
```
https://your-backend-url.onrender.com/api/employees
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "employees": [...]
  }
}
```

---

### Method 4: Check Render Dashboard

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click on your **backend service**
3. Check **Status:**
   - ✅ **Live** = Working
   - ⚠️ **Sleeping** = Free tier (normal, just visit URL to wake up)
   - ❌ **Failed** = Error (check logs)

4. Click **"Logs"** tab to see:
   - `✅ MongoDB Connected Successfully`
   - `🚀 Server running on port 10000`
   - Any error messages

---

### Method 5: Test from Frontend

1. Open your frontend: `https://pravarahealthcare-7my6.onrender.com`
2. Try to **login** or access any page
3. Open **Browser Console** (F12)
4. Go to **Network** tab
5. Look for API requests:
   - ✅ **200 OK** = Backend working
   - ❌ **Failed** = Backend not responding
   - ❌ **CORS Error** = Backend CORS misconfigured

---

## 🔍 Step-by-Step: Find Your Backend URL

### If you don't know your backend URL:

1. **Render Dashboard:**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Find your **backend service** (not frontend)
   - The URL is shown at the top, like:
     ```
     https://pravara-backend-xxxx.onrender.com
     ```

2. **Check Environment Variables:**
   - Frontend service → Environment tab
   - Look for `VITE_API_BASE_URL`
   - It should be: `https://your-backend-url.onrender.com/api`

---

## ✅ Quick Test Checklist

Test these endpoints:

1. **Health Check:**
   ```
   https://your-backend.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running"}`

2. **Employees:**
   ```
   https://your-backend.onrender.com/api/employees
   ```
   Should return employee data or empty array

3. **Dashboard KPIs:**
   ```
   https://your-backend.onrender.com/api/dashboard/kpis
   ```
   Should return dashboard data

---

## 🐛 Common Issues

### Issue 1: Backend is "Sleeping" (Free Tier)
**Problem:** First request takes 30-60 seconds

**Solution:**
- Just wait, it will wake up
- Or visit health endpoint to wake it up

### Issue 2: CORS Error
**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Fix:**
- Check `CORS_ORIGIN` in backend environment variables
- Should match frontend URL exactly: `https://pravarahealthcare-7my6.onrender.com`

### Issue 3: 404 Not Found
**Problem:** Wrong URL or route doesn't exist

**Fix:**
- Verify backend URL is correct
- Check route exists in `backend/server.js`

### Issue 4: MongoDB Connection Error
**Problem:** Backend starts but can't connect to database

**Check:**
- Render Logs → Look for MongoDB errors
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas → Cluster is running

---

## 📋 Quick Test Script

Copy this into browser console (F12):

```javascript
// Test Backend Health
async function testBackend() {
  const backendUrl = 'https://your-backend-url.onrender.com';
  
  try {
    console.log('Testing backend...');
    const response = await fetch(`${backendUrl}/api/health`);
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log('✅ Backend is working!', data);
      return true;
    } else {
      console.log('⚠️ Backend responded but status is not OK', data);
      return false;
    }
  } catch (error) {
    console.error('❌ Backend is not working:', error);
    return false;
  }
}

// Run test
testBackend();
```

**Replace `your-backend-url` with your actual backend URL**

---

## 🎯 Summary

**Easiest Way to Test:**
1. Open browser
2. Visit: `https://your-backend-url.onrender.com/api/health`
3. Should see: `{"status":"OK","message":"Server is running"}`

**If it works** → Backend is running! ✅

**If it doesn't work** → Check Render Dashboard → Logs for errors

