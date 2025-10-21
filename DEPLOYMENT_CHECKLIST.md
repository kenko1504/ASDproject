# Azure DevOps Deployment Checklist

## ✅ COMPLETED - Code Changes

All code changes have been successfully implemented and tested locally:

### Backend Configuration
- [x] **Dynamic Port** - server.js uses `process.env.PORT || 5000`
- [x] **CORS Configuration** - Environment-aware CORS with `ALLOWED_ORIGINS`
- [x] **Static File Serving** - Serves React frontend in production
- [x] **Environment Detection** - Logs environment on startup

### Frontend Configuration
- [x] **API Configuration** - Created centralized `API_BASE_URL` config
- [x] **All Components Updated** - 22 components now use `API_BASE_URL`
- [x] **Production Build** - Optimized Vite configuration
- [x] **Build Successful** - Frontend builds without errors

### Deployment Files
- [x] **web.config** - IIS/iisnode configuration for Azure
- [x] **deploy.sh** - Build-time deployment script
- [x] **startup.sh** - Application startup script
- [x] **.deployment** - Deployment configuration
- [x] **.env.example** - Environment variable template

### Pipeline Configuration
- [x] **azure-pipelines-1.yml** - Optimized for production deployment
- [x] **Production Dependencies** - Only production packages in artifacts
- [x] **Artifact Optimization** - Excludes test files and large CSVs

---

## ⚠️ TODO - Azure Configuration

These steps must be completed in Azure Portal and Azure DevOps:

### 1. Create Azure Resources

#### Azure App Service
- [ ] Create App Service in Azure Portal
  - Runtime: Node.js 20.x or 22.x
  - Operating System: Linux
  - Region: Choose closest to your users
  - Pricing Tier: B1 or higher recommended

#### MongoDB Atlas (if not done)
- [ ] Configure IP whitelist to allow Azure connections
  - Option 1: Add `0.0.0.0/0` (allows all - less secure)
  - Option 2: Add specific Azure datacenter IPs
- [ ] Verify MongoDB user has correct permissions

### 2. Configure Azure App Service

#### Environment Variables
Go to: Azure Portal > Your App Service > Configuration > Application settings

Add these variables:

| Variable | Value | Status |
|----------|-------|--------|
| `NODE_ENV` | `production` | ⚠️ Required |
| `MONGO_URI` | `mongodb+srv://...` | ⚠️ Required |
| `JWT_SECRET` | Strong random string | ⚠️ Required |
| `NUTRITION_API_HOST` | `nutrition-calculator.p.rapidapi.com` | Optional* |
| `NUTRITION_API_KEY` | Your RapidAPI key | Optional* |
| `GOOGLE_BASE_URI` | Your Document AI URI | Optional** |
| `DOCUMENT_PROJECT_ID` | Your Google Cloud project | Optional** |
| `DOCUMENT_PROJECT_LOCATION` | `us` | Optional** |
| `DOCUMENT_PROCESSOR_ID` | Your processor ID | Optional** |
| `ALLOWED_ORIGINS` | `https://yourapp.azurewebsites.net` | ⚠️ Required |

*Required for nutrition features
**Required for receipt upload feature

#### Startup Command
Go to: Azure Portal > Your App Service > Configuration > General Settings
- [ ] Set **Startup Command**: `bash startup.sh`
- [ ] Save changes

### 3. Set Up Azure DevOps Pipeline

#### Create Release Pipeline
- [ ] Go to Azure DevOps > Pipelines > Releases
- [ ] Click "New pipeline"
- [ ] Select "Azure App Service deployment" template
- [ ] Configure artifact source:
  - Source: Build pipeline (azure-pipelines-1.yml)
  - Default version: Latest
- [ ] Configure deployment task:
  - Azure subscription: Your subscription
  - App Service name: Your app service name
  - Package: `$(System.DefaultWorkingDirectory)/_your-build/drop/release`

#### Enable Continuous Deployment
- [ ] In release pipeline, click "Continuous deployment trigger"
- [ ] Enable trigger
- [ ] Save pipeline

### 4. Deploy and Test

#### Initial Deployment
- [ ] Commit all changes to `main` branch
- [ ] Push to Azure DevOps repository
- [ ] Build pipeline should trigger automatically
- [ ] Release pipeline should deploy to Azure App Service

#### Verify Deployment
- [ ] Check build pipeline completed successfully
- [ ] Check release pipeline deployed successfully
- [ ] Visit your Azure App Service URL
- [ ] Test login functionality
- [ ] Test creating/viewing items
- [ ] Check browser console for errors

#### Monitor Logs
- [ ] Azure Portal > App Service > Log stream
- [ ] Check for startup errors
- [ ] Verify MongoDB connection successful
- [ ] Check for any runtime errors

---

## 🔧 OPTIONAL - Improvements

These are recommended but not required for initial deployment:

### File Storage Migration
- [ ] Set up Azure Blob Storage for image uploads
- [ ] Update backend to use Blob Storage instead of local files
- [ ] Benefits: Images persist across restarts

### Security Enhancements
- [ ] Use Azure Key Vault for secrets
- [ ] Enable HTTPS only
- [ ] Configure custom domain (if needed)
- [ ] Set up Application Insights for monitoring

### Performance Optimizations
- [ ] Enable Azure CDN for static assets
- [ ] Configure caching headers
- [ ] Set up autoscaling rules

---

## 📝 Quick Reference

### Your App URLs (after deployment)
- **App Service URL**: `https://your-app-name.azurewebsites.net`
- **Azure Portal**: https://portal.azure.com
- **Azure DevOps**: https://dev.azure.com/your-organization

### Common Commands
```bash
# Test production build locally
cd frontend && npm run build
cd ../backend && NODE_ENV=production node server.js

# Check logs in Azure
az webapp log tail --name your-app-name --resource-group your-rg

# Restart Azure App Service
az webapp restart --name your-app-name --resource-group your-rg
```

### Environment Variable Generator
```bash
# Generate strong JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## ✅ Summary

**Code Status**: ✅ Ready for deployment
**Local Testing**: ✅ Working
**Azure Configuration**: ⚠️ Pending (manual steps required)

**Next Step**: Create Azure App Service and configure environment variables

**Estimated Time**: 30-45 minutes for initial setup

---

**Last Updated**: 2025-10-21
**Status**: Ready for Azure configuration
