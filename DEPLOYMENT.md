# Vercel Deployment Guide

## Prerequisites

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Ensure all environment variables are ready:
   - MONGODB_URI
   - JWT_SECRET
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - GEMINI_API_KEY
   - VERCEL_TOKEN
   - VERCEL_ORG_ID
   - VERCEL_PROJECT_ID

## Step-by-Step Deployment Process

1. **Login to Vercel CLI**
   ```bash
   vercel login
   ```

2. **Build the Project Locally**
   ```bash
   # Install dependencies
   npm install

   # Build both client and server
   npm run build
   ```

3. **Link Your Project to Vercel**
   ```bash
   vercel link
   ```
   - Select your scope (personal or team)
   - Select "Create new project"
   - Enter project name when prompted
   - Confirm project directory

4. **Configure Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add GOOGLE_CLIENT_ID
   vercel env add GOOGLE_CLIENT_SECRET
   vercel env add GEMINI_API_KEY
   ```

5. **Deploy to Preview**
   ```bash
   vercel
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Deployment Verification

1. **Verify Environment Variables**
   ```bash
   vercel env ls
   ```

2. **Check Deployment Status**
   ```bash
   vercel list
   ```

3. **View Deployment Logs**
   ```bash
   vercel logs [deployment-url]
   ```

## Troubleshooting

If you encounter issues:

1. **Check Build Logs**
   ```bash
   vercel logs [deployment-url]
   ```

2. **Inspect Project Settings**
   ```bash
   vercel project ls
   ```

3. **Remove Failed Deployment**
   ```bash
   vercel remove [project-name]
   ```

## Additional Commands

- **Pull Latest Environment Variables**
  ```bash
  vercel env pull
  ```

- **View Project Information**
  ```bash
  vercel project ls
  ```

- **Switch Project**
  ```bash
  vercel switch
  ```

- **List Deployments**
  ```bash
  vercel ls
  ```

## Important Notes

1. Ensure `vercel.json` is properly configured:
<augment_code_snippet path="vercel.json" mode="EDIT">
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist",
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/src/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}