# Deployment Guide

This guide provides detailed instructions for deploying the Tilli Assessment App to various cloud platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Deployment Options](#deployment-options)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Google Cloud Platform](#google-cloud-platform)
  - [AWS (Amazon Web Services)](#aws-amazon-web-services)
  - [Azure](#azure)
  - [Other Options](#other-options)
- [Post-Deployment Configuration](#post-deployment-configuration)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

1. **Appwrite Backend Setup**

   - Appwrite project created
   - Database created with required collections
   - Project ID and database IDs ready
   - Appwrite endpoint URL (e.g., `https://fra.cloud.appwrite.io/v1`)

2. **Required Appwrite Collections**

   - Teachers collection
   - Reports/Assessments collection
   - Scores aggregation collection

3. **Repository Access**
   - Code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

---

## Environment Variables

Create the following environment variables in your deployment platform:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id-here

# Database IDs
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
NEXT_PUBLIC_TEACHERS_COLLECTION_ID=your-teachers-collection-id
NEXT_PUBLIC_TEACHER_REPORT_COLLECTION_ID=your-reports-collection-id
NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID=your-scores-collection-id
```

**Note:** All variables starting with `NEXT_PUBLIC_` are exposed to the browser.

---

## Deployment Options

### Vercel (Recommended)

Vercel is the recommended platform for Next.js applications, offering zero-configuration deployment.

#### Option 1: Deploy via Vercel Dashboard

1. **Sign up/Login to Vercel**

   - Visit [vercel.com](https://vercel.com)
   - Sign up or login with your GitHub/GitLab/Bitbucket account

2. **Import Project**

   ```
   Dashboard → Add New → Project → Import Git Repository
   ```

3. **Configure Project**

   - Select your repository
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)

4. **Environment Variables**

   - Click "Environment Variables"
   - Add all required variables from the [Environment Variables](#environment-variables) section
   - Add them for all environments (Production, Preview, Development)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for deployment to complete
   - Your app will be live at `https://your-project-name.vercel.app`

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project directory
cd tilli-assessment-1

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [Select your account]
# - Link to existing project? N
# - Project name? [Enter name or press Enter]
# - Directory? ./
# - Override settings? N
```

**Add Environment Variables via CLI:**

```bash
# Add each environment variable
vercel env add NEXT_PUBLIC_APPWRITE_PROJECT_ID
# Enter the value when prompted
# Select environments: Production, Preview, Development

# Repeat for all environment variables
vercel env add NEXT_PUBLIC_APPWRITE_DATABASE_ID
vercel env add NEXT_PUBLIC_TEACHERS_COLLECTION_ID
vercel env add NEXT_PUBLIC_TEACHER_REPORT_COLLECTION_ID
vercel env add NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID
```

#### Custom Domain on Vercel

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update your domain's DNS settings as instructed
5. Wait for DNS propagation (up to 48 hours)

---

### Google Cloud Platform

Deploy to GCP using Cloud Run or App Engine.

#### Option 1: Google Cloud Run (Recommended)

Cloud Run is serverless and automatically scales based on traffic.

**Prerequisites:**

- Google Cloud account
- `gcloud` CLI installed
- Project created in GCP

**1. Install Google Cloud SDK**

```bash
# macOS
brew install --cask google-cloud-sdk

# Windows
# Download from: https://cloud.google.com/sdk/docs/install

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**2. Initialize and Login**

```bash
# Login to Google Cloud
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

**3. Create Dockerfile**

Create a `Dockerfile` in your project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
```

**4. Create .dockerignore**

Create a `.dockerignore` file:

```
node_modules
.next
.git
*.log
.env*.local
coverage
```

**5. Build and Deploy**

```bash
# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# Build container image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/tilli-assessment-app

# Deploy to Cloud Run
gcloud run deploy tilli-assessment-app \
  --image gcr.io/YOUR_PROJECT_ID/tilli-assessment-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1" \
  --set-env-vars "NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id" \
  --set-env-vars "NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id" \
  --set-env-vars "NEXT_PUBLIC_TEACHERS_COLLECTION_ID=your-teachers-collection-id" \
  --set-env-vars "NEXT_PUBLIC_TEACHER_REPORT_COLLECTION_ID=your-reports-collection-id" \
  --set-env-vars "NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID=your-scores-collection-id"
```

**6. Using Environment Variables File**

Create a `.env.yaml` file:

```yaml
NEXT_PUBLIC_APPWRITE_ENDPOINT: "https://fra.cloud.appwrite.io/v1"
NEXT_PUBLIC_APPWRITE_PROJECT_ID: "your-project-id"
NEXT_PUBLIC_APPWRITE_DATABASE_ID: "your-database-id"
NEXT_PUBLIC_TEACHERS_COLLECTION_ID: "your-teachers-collection-id"
NEXT_PUBLIC_TEACHER_REPORT_COLLECTION_ID: "your-reports-collection-id"
NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID: "your-scores-collection-id"
```

Deploy with env file:

```bash
gcloud run deploy tilli-assessment-app \
  --image gcr.io/YOUR_PROJECT_ID/tilli-assessment-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --env-vars-file .env.yaml
```

**7. Custom Domain on Cloud Run**

```bash
# Map custom domain
gcloud run domain-mappings create \
  --service tilli-assessment-app \
  --domain your-domain.com \
  --region us-central1
```

#### Option 2: Google App Engine

**1. Create app.yaml**

```yaml
runtime: nodejs18

env_variables:
  NEXT_PUBLIC_APPWRITE_ENDPOINT: "https://fra.cloud.appwrite.io/v1"
  NEXT_PUBLIC_APPWRITE_PROJECT_ID: "your-project-id"
  NEXT_PUBLIC_APPWRITE_DATABASE_ID: "your-database-id"
  NEXT_PUBLIC_TEACHERS_COLLECTION_ID: "your-teachers-collection-id"
  NEXT_PUBLIC_TEACHER_REPORT_COLLECTION_ID: "your-reports-collection-id"
  NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID: "your-scores-collection-id"

handlers:
  - url: /.*
    script: auto
    secure: always
```

**2. Deploy**

```bash
# Deploy to App Engine
gcloud app deploy

# View your application
gcloud app browse
```

---

### AWS (Amazon Web Services)

Deploy to AWS using Amplify, Elastic Beanstalk, or EC2.

#### Option 1: AWS Amplify (Easiest)

**1. Via AWS Console**

1. Login to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to AWS Amplify
3. Click "New app" → "Host web app"
4. Connect your Git repository
5. Configure build settings (auto-detected for Next.js)
6. Add environment variables
7. Click "Save and Deploy"

**2. Via AWS Amplify CLI**

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify in your project
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

#### Option 2: AWS Elastic Beanstalk

**1. Create package.json build script**

Ensure your `package.json` has:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p $PORT"
  }
}
```

**2. Create .ebextensions config**

Create `.ebextensions/nodecommand.config`:

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
```

**3. Deploy**

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init -p node.js-18 tilli-assessment-app

# Create environment with environment variables
eb create production-env \
  --envvars NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id,NEXT_PUBLIC_APPWRITE_DATABASE_ID=your-database-id

# Deploy
eb deploy
```

---

### Azure

Deploy to Azure using Static Web Apps or App Service.

#### Option 1: Azure Static Web Apps

**1. Via Azure Portal**

1. Login to [Azure Portal](https://portal.azure.com)
2. Create new "Static Web App"
3. Connect to your repository
4. Select "Next.js" preset
5. Configure build settings:
   - App location: `/`
   - Api location: `` (empty)
   - Output location: `.next`
6. Add environment variables in Configuration
7. Deploy

**2. Via Azure CLI**

```bash
# Install Azure CLI
brew install azure-cli  # macOS
# or download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

# Login
az login

# Create resource group
az group create --name tilli-app-rg --location eastus

# Create static web app
az staticwebapp create \
  --name tilli-assessment-app \
  --resource-group tilli-app-rg \
  --source https://github.com/YOUR_USERNAME/YOUR_REPO \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location ".next" \
  --login-with-github
```

#### Option 2: Azure App Service

```bash
# Create App Service plan
az appservice plan create \
  --name tilli-plan \
  --resource-group tilli-app-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group tilli-app-rg \
  --plan tilli-plan \
  --name tilli-assessment-app \
  --runtime "NODE|18-lts"

# Configure environment variables
az webapp config appsettings set \
  --resource-group tilli-app-rg \
  --name tilli-assessment-app \
  --settings \
    NEXT_PUBLIC_APPWRITE_PROJECT_ID="your-project-id" \
    NEXT_PUBLIC_APPWRITE_DATABASE_ID="your-database-id"

# Deploy code
az webapp deployment source config \
  --name tilli-assessment-app \
  --resource-group tilli-app-rg \
  --repo-url https://github.com/YOUR_USERNAME/YOUR_REPO \
  --branch main \
  --manual-integration
```

---

### Other Options

#### Railway

1. Visit [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables
6. Deploy automatically

#### Render

1. Visit [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your repository
4. Configure:
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables
6. Click "Create Web Service"

#### DigitalOcean App Platform

1. Visit [DigitalOcean](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your repository
4. Configure build settings
5. Add environment variables
6. Deploy

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

**Note:** Netlify may require Next.js configuration adjustments for full SSR support. Consider using Vercel for better Next.js compatibility.

---

## Post-Deployment Configuration

### 1. Update Appwrite CORS Settings

Add your deployment domain to Appwrite allowed origins:

1. Login to Appwrite Console
2. Go to Settings → Platforms
3. Add Web Platform
4. Add your domain(s):
   - `https://your-app.vercel.app`
   - `https://your-custom-domain.com`

### 2. Update Image Domains

If you're using external images, update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "fra.cloud.appwrite.io", // Add Appwrite domain if using Appwrite Storage
      "your-cdn-domain.com",
    ],
  },
};

module.exports = nextConfig;
```

### 3. Configure Custom Domain

Most platforms support custom domains:

1. Add domain in platform settings
2. Update DNS records:

   - **Vercel:** Add CNAME record pointing to `cname.vercel-dns.com`
   - **Cloud Run:** Follow GCP instructions
   - **AWS:** Use Route 53 or add CNAME
   - **Azure:** Add CNAME pointing to Azure domain

3. Enable HTTPS (usually automatic)

### 4. Set up Monitoring

Configure monitoring and analytics:

- **Vercel:** Built-in analytics available
- **GCP:** Use Cloud Monitoring and Cloud Logging
- **AWS:** Use CloudWatch
- **Azure:** Use Application Insights

### 5. Enable CI/CD

Most platforms auto-deploy on git push. Configure:

1. **Branch Protection:** Protect main/production branch
2. **Preview Deployments:** Enable for pull requests
3. **Build Notifications:** Set up Slack/email notifications
4. **Rollback Strategy:** Familiarize with rollback procedures

---

## Troubleshooting

### Build Fails

**Issue:** Build fails during deployment

**Solutions:**

```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run lint

# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Environment Variables Not Working

**Issue:** App can't connect to Appwrite

**Solutions:**

- Verify all `NEXT_PUBLIC_*` variables are set
- Check for typos in variable names
- Restart/redeploy after adding variables
- Check browser console for errors
- Verify variables in platform settings

### 404 Errors on Page Refresh

**Issue:** Routes work on initial load but fail on refresh

**Solutions:**

- Ensure platform supports Next.js routing
- Check deployment configuration
- Verify `next.config.js` settings
- For Apache/Nginx, add rewrite rules

### CORS Errors

**Issue:** Appwrite requests blocked by CORS

**Solutions:**

- Add deployment domain to Appwrite platforms
- Include both `http://` and `https://` versions
- Add `www` and non-`www` versions
- Clear browser cache after updating

### Performance Issues

**Solutions:**

- Enable caching headers
- Optimize images using Next.js Image component
- Enable CDN in platform settings
- Monitor bundle size with `npm run build`
- Consider upgrading platform tier

### Server Errors (500)

**Issue:** Application crashes or returns 500 errors

**Solutions:**

- Check deployment logs
- Verify all environment variables are set
- Check Appwrite connection
- Review server-side code for errors
- Enable error reporting/monitoring

---

## Additional Resources

### Documentation Links

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Cloud Run Docs](https://cloud.google.com/run/docs)
- [AWS Amplify Docs](https://docs.amplify.aws/)
- [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Appwrite Documentation](https://appwrite.io/docs)

### Support

For deployment issues:

1. Check platform status pages
2. Review deployment logs
3. Consult platform documentation
4. Contact platform support

---

## Security Best Practices

1. **Environment Variables**

   - Never commit `.env` files to Git
   - Use platform-specific secrets management
   - Rotate sensitive credentials regularly

2. **Appwrite Security**

   - Restrict API keys to specific domains
   - Enable rate limiting
   - Use appropriate collection permissions

3. **HTTPS**

   - Always use HTTPS in production
   - Enable HSTS headers
   - Use secure cookies

4. **Dependencies**
   - Keep dependencies updated
   - Run `npm audit` regularly
   - Use Dependabot or similar tools

---

## Cost Estimates

### Vercel

- **Hobby (Free):** Unlimited deployments, 100GB bandwidth
- **Pro ($20/month):** Increased limits, team features
- **Enterprise:** Custom pricing

### Google Cloud Run

- **Free Tier:** 2 million requests/month
- **Paid:** ~$0.40 per million requests
- **Storage:** Additional costs for container registry

### AWS Amplify

- **Free Tier:** 1000 build minutes, 15GB storage
- **Paid:** $0.01 per build minute, $0.15/GB bandwidth

### Railway

- **Free Trial:** $5 credit
- **Developer ($5/month):** Base tier
- **Pay as you go:** Based on usage

---

## Conclusion

For most use cases, **Vercel** is recommended due to its:

- Zero-configuration Next.js deployment
- Automatic HTTPS and CDN
- Easy environment variable management
- Generous free tier
- Excellent developer experience

For enterprise needs or existing cloud infrastructure, **GCP Cloud Run**, **AWS**, or **Azure** provide more control and integration options.

Choose based on your:

- Budget constraints
- Existing cloud infrastructure
- Performance requirements
- Team expertise
- Scaling needs
