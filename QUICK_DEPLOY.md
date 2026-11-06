# QUICK DEPLOYMENT SCRIPT

## Step 1: Prepare Your Code for Production

### Update Frontend API URL
Open `FE/src/api.js` and update:

```javascript
// BEFORE (Development)
const API_BASE_URL = 'http://localhost:3000/api';

// AFTER (Production)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com/api';
```

### Create .env.production
In `FE/` directory, create `.env.production`:
```
REACT_APP_API_URL=https://your-deployed-backend.herokuapp.com/api
REACT_APP_ENV=production
```

### Update Backend CORS
Open `BE/server.js` and update CORS:

```javascript
// BEFORE (Development - allows all)
res.header('Access-Control-Allow-Origin', '*');

// AFTER (Production - specific URL)
res.header('Access-Control-Allow-Origin', 'https://your-deployed-frontend.vercel.app');
```

---

## Step 2: Deploy Backend to Heroku

### Prerequisites
- Heroku account (free)
- Heroku CLI installed

### Commands
```bash
# Login to Heroku
heroku login

# Navigate to backend
cd C:\Users\HangNTT2195\Desktop\Projects\BE

# Initialize git if not already done
git init
git add .
git commit -m "Deploy backend to Heroku"

# Create Heroku app
heroku create your-app-name

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Get Your Backend URL
After deployment, your backend will be at:
```
https://your-app-name.herokuapp.com
```

---

## Step 3: Update Frontend with Backend URL

Update `FE/src/api.js` with your Heroku URL:
```javascript
const API_BASE_URL = 'https://your-app-name.herokuapp.com/api';
```

---

## Step 4: Deploy Frontend to Vercel

### Prerequisites
- Vercel account (free)
- Vercel CLI installed

### Commands
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend
cd C:\Users\HangNTT2195\Desktop\Projects\FE

# Deploy
vercel

# Follow the prompts and select your deployment preferences
```

### Add Environment Variables to Vercel
1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: `REACT_APP_API_URL = https://your-app-name.herokuapp.com/api`

---

## Step 5: Verify Deployment

1. Visit your Vercel frontend URL
2. Test CREATE operation - Add a user
3. Test READ operation - See user in table
4. Test UPDATE operation - Edit user
5. Test DELETE operation - Delete user
6. Repeat for Products

---

## Alternative: Deploy Both to Heroku

### For Frontend
```bash
# Create Procfile in FE directory
cd FE
echo "web: npm install -g serve && serve -s build -l $PORT" > Procfile

# Deploy
heroku create your-frontend-app
git push heroku main
```

---

## Troubleshooting Deployment

### Issue: "Build fails"
```bash
# Clean and rebuild
rm -rf node_modules
npm install
npm run build
```

### Issue: "CORS error in browser console"
- Verify backend CORS is updated
- Check frontend API URL is correct
- Ensure both URLs match configured origins

### Issue: "API connection timeout"
- Verify backend is running on Heroku
- Check Heroku app status: `heroku logs --tail`
- Ensure API_BASE_URL is correct

### Issue: "Port already in use"
```bash
# Windows: Find and kill process on port
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force
```

---

## Verify Files Before Deployment

Checklist:
- [ ] `FE/build/` folder exists
- [ ] `FE/src/api.js` has correct API_BASE_URL
- [ ] `BE/server.js` has CORS for production URL
- [ ] `.env.production` file created
- [ ] `.gitignore` excludes node_modules
- [ ] No console errors in development build

---

## Monitor Your Deployed Application

### Heroku Backend
```bash
# View logs
heroku logs --tail

# Check app status
heroku apps

# View app info
heroku apps:info
```

### Vercel Frontend
- Dashboard: https://vercel.com/dashboard
- View deployment logs and analytics
- Set up monitoring alerts

---

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Users table displays existing data
- [ ] Products table is visible
- [ ] Can create new user
- [ ] Can create new product
- [ ] Can edit existing data
- [ ] Can delete entries
- [ ] No CORS errors in console
- [ ] No 404 or connection errors
- [ ] Responsive design works on mobile

---

**🎉 Once all checks pass, your application is live!**

For issues or questions, check:
1. DEPLOYMENT_GUIDE.md
2. Browser console (F12)
3. Heroku logs
4. Vercel deployment logs
