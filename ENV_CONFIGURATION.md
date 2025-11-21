# Environment-Based API Configuration

This project uses environment-specific BASE URLs for API requests.

## 🌐 Configured URLs

### Development
- **URL**: `http://192.168.2.33:8080` (Local network)
- **Environment Variable**: `REACT_APP_API_URL`
- **When Used**: By default when running `npm start`

### Production
- **URL**: `https://threeamshoppeebe.onrender.com/`
- **Environment Variable**: `REACT_APP_API_URL_PROD`
- **When Used**: Automatically when `NODE_ENV=production` or `REACT_APP_ENV=production`

## 🚀 How It Works

The `src/utils/api.js` file automatically detects the environment and uses the appropriate URL:

```javascript
// Development mode
npm start
// Uses: http://192.168.2.33:8080

// Production build
npm run build
// Uses: https://threeamshoppeebe.onrender.com/
```

## 🔍 Debugging

When running in development mode, open the browser console to see which BASE_URL is being used. You'll see a blue banner with:
- BASE_URL: The active API URL
- NODE_ENV: The Node environment
- REACT_APP_ENV: Your custom environment setting

## ⚙️ Configuration Files

- **`.env`** - Main environment file (loaded in all environments)
- **`.env.development`** - Development-specific settings
- **`.env.production`** - Production-specific settings
- **`.env.local`** - Local overrides (gitignored, for personal settings)

## 📝 To Switch Environments Manually

### Force Production URL in Development:
Update `.env`:
```bash
REACT_APP_ENV=production
```

### Force Development URL:
Update `.env`:
```bash
REACT_APP_ENV=development
```

Then restart your development server.

## 🔐 Security Note

Never commit sensitive API keys or tokens to `.env` files. Use `.env.local` for sensitive local development settings (this file is gitignored).
