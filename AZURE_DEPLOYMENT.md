# Azure DevOps Deployment Guide

This guide outlines the changes made to enable deployment to Azure App Service and the steps needed to complete the deployment.

## Changes Implemented

### 1. Pipeline Configuration ([azure-pipelines-1.yml](azure-pipelines-1.yml))
- Fixed duplicate display name for backend module installation
- Added production-only dependency installation for backend
- Optimized artifact copying to exclude unnecessary files (test files, CSV data, development dependencies)
- Added steps to copy web.config and deployment files

### 2. Azure App Service Configuration ([web.config](web.config))
- Created web.config file for IIS/iisnode integration
- Configured URL rewriting to route requests to Node.js backend
- Set up static file serving for React frontend
- Enabled production environment variables
- Added security settings to protect sensitive folders

### 3. Backend Server Updates ([backend/server.js](backend/server.js))
- **Dynamic Port**: Changed from hardcoded `PORT = 5000` to `PORT = process.env.PORT || 5000`
- **Production CORS**: Added environment-aware CORS configuration
- **Static File Serving**: Backend now serves React frontend in production
- **Environment Logging**: Added environment detection for debugging

### 4. Frontend Configuration
- Created centralized API configuration ([frontend/src/config/api.js](frontend/src/config/api.js))
- Updated API utility ([frontend/src/utils/api.js](frontend/src/utils/api.js)) to export API_BASE_URL
- Enhanced Vite config ([frontend/vite.config.js](frontend/vite.config.js)) with production optimizations

### 5. Environment Variables ([backend/.env.example](backend/.env.example))
- Created template showing all required environment variables
- Documents required secrets for Azure App Service configuration

### 6. Deployment Scripts
- Created [.deployment](.deployment) file to specify deployment command
- Created [deploy.sh](deploy.sh) for build-time dependency installation
- Created [startup.sh](startup.sh) for application startup

---

## Azure App Service Configuration Steps

### Step 1: Create Azure App Service
1. Go to Azure Portal
2. Create a new App Service with Node.js runtime (22.x or 20.x)
3. Choose Linux as the OS

### Step 2: Configure Environment Variables
In Azure App Service > Configuration > Application settings, add:

| Name | Value | Notes |
|------|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | Auto-set by Azure | Don't manually set |
| `MONGO_URI` | Your MongoDB Atlas connection string | **Required** |
| `JWT_SECRET` | Strong random secret | **Required** |
| `NUTRITION_API_HOST` | `nutrition-calculator.p.rapidapi.com` | From RapidAPI |
| `NUTRITION_API_KEY` | Your RapidAPI key | **Required** |
| `GOOGLE_BASE_URI` | Your Google Document AI URI | For receipt upload |
| `DOCUMENT_PROJECT_ID` | Your Google Cloud project ID | For receipt upload |
| `DOCUMENT_PROJECT_LOCATION` | `us` or your region | For receipt upload |
| `DOCUMENT_PROCESSOR_ID` | Your processor ID | For receipt upload |
| `ALLOWED_ORIGINS` | Your Azure app URL | Example: `https://yourapp.azurewebsites.net` |

### Step 3: Configure Startup Command
In Azure App Service > Configuration > General settings:
- **Startup Command**: `bash startup.sh`

### Step 4: Connect Azure DevOps Pipeline
1. In Azure DevOps, go to Pipelines > Releases
2. Create a new release pipeline
3. Add an artifact source (your build pipeline)
4. Add Azure App Service Deploy task
5. Configure:
   - **Azure subscription**: Your subscription
   - **App Service name**: Your app service name
   - **Package or folder**: `$(System.DefaultWorkingDirectory)/**/*.zip`

### Step 5: Enable Continuous Deployment
1. In the release pipeline, enable the continuous deployment trigger
2. Set trigger on the build artifact

---

## Important Notes

### MongoDB Connection
- Ensure your MongoDB Atlas cluster allows connections from Azure IP addresses
- Add `0.0.0.0/0` to IP whitelist or add specific Azure datacenter IPs

### File Storage
The application uses local file storage for:
- **Image uploads** (`backend/imageUploads/`)

⚠️ **Warning**: Local file storage on Azure App Service is ephemeral and will be lost on restart. Consider migrating to:
- Azure Blob Storage for permanent file storage
- Or use persistent storage mount

### Frontend API URLs
The frontend currently has hardcoded `http://localhost:5000` URLs throughout the components. You need to update these to use the centralized API configuration:

**In each component file, replace:**
```javascript
// OLD:
fetch("http://localhost:5000/...")

// NEW:
import { API_BASE_URL } from '../utils/api.js';
fetch(`${API_BASE_URL}/...`)
```

**Files that need updating (65+ occurrences):**
- UpdateItem.jsx
- RegisterModal.jsx
- GroceryList.jsx
- AddRecipe.jsx
- ViewRecipe.jsx
- LoginModal.jsx
- EditRecipe.jsx
- Dashboard.jsx
- NutritionGraph.jsx
- FridgeManagement.jsx
- AutoIngredientPopUp.jsx
- ManualIngredientPopUp.jsx
- WasteBudget.jsx
- AddIngredientPopUp.jsx
- Nutritions.jsx
- ViewGroceryItems.jsx
- Settings.jsx
- Recipes.jsx
- Recommendation.jsx
- AddItem.jsx
- FridgeList.jsx
- RecipeCard.jsx

### Package.json Issue
⚠️ **Critical**: Your `.gitignore` currently blocks `package.json` and `package-lock.json` files (lines 12-15). This will prevent Azure from installing dependencies. You mentioned to skip this for now, but this **must be fixed** before deployment will work.

---

## Testing Deployment

### Local Production Test
Before deploying to Azure, test the production build locally:

```bash
# Build frontend
cd frontend
npm run build

# Set environment to production and start backend
cd ../backend
export NODE_ENV=production
node server.js
```

Navigate to `http://localhost:5000` - you should see the React app served by the backend.

### After Azure Deployment
1. Check Application Logs in Azure Portal
2. Verify environment variables are set correctly
3. Test the application endpoints
4. Check MongoDB connection is successful

---

## Troubleshooting

### Issue: Application won't start
- Check Application Logs in Azure Portal
- Verify `startup.sh` has execute permissions
- Check NODE_ENV is set to "production"

### Issue: MongoDB connection failed
- Verify MONGO_URI is correct in App Settings
- Check MongoDB Atlas IP whitelist includes Azure IPs
- Verify MongoDB user has correct permissions

### Issue: 404 on frontend routes
- Verify web.config is in the root of the deployment
- Check that frontend/dist folder exists in deployment
- Verify URL rewrite rules are active

### Issue: API calls failing
- Check CORS configuration allows your Azure domain
- Verify ALLOWED_ORIGINS includes your Azure URL
- Check browser console for CORS errors

### Issue: Environment variables not working
- Verify all variables are set in App Settings
- Restart the App Service after changing settings
- Check capitalization matches exactly

---

## Next Steps

1. ⚠️ **Fix .gitignore** to allow package.json files (currently blocked)
2. Update all frontend components to use `API_BASE_URL` instead of hardcoded URLs
3. Configure Azure App Service as described above
4. Set up all environment variables in Azure
5. Configure Azure DevOps release pipeline
6. Consider migrating to Azure Blob Storage for file uploads
7. Test deployment end-to-end

---

## Security Reminders

- ✅ Never commit `.env` file with real credentials
- ✅ Use strong, random values for `JWT_SECRET`
- ✅ Restrict CORS to only your domains in production
- ✅ Keep MongoDB Atlas IP whitelist as restrictive as possible
- ✅ Regularly rotate API keys and secrets
- ✅ Use Azure Key Vault for sensitive configuration (advanced)

---

For questions or issues, refer to:
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure DevOps Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/)
