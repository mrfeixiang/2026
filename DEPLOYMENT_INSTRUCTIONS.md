# 🚀 GitHub Pages Deployment Instructions

## Automatic Setup (Recommended)

The repository now includes a GitHub Actions workflow that will automatically deploy to GitHub Pages. Follow these steps:

### Step 1: Enable GitHub Pages
1. Go to your repository: https://github.com/mrfeixiang/2026
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Click **Save**

### Step 2: Trigger Deployment
The deployment will automatically trigger when you push to the main branch. You can also:
1. Go to the **Actions** tab in your repository
2. Click on the **Deploy to GitHub Pages** workflow
3. Click **Run workflow** to manually trigger deployment

### Step 3: Access Your Live Site
Once deployed, your calendar will be available at:
**https://mrfeixiang.github.io/2026/**

## Manual Setup (Alternative)

If you prefer manual setup:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose **main** branch
4. Select **/ (root)** folder
5. Click **Save**

## Verification

After deployment, you should see:
- ✅ A green checkmark in the Actions tab
- ✅ Your site accessible at the GitHub Pages URL
- ✅ All features working correctly (calendar, flowers, multilingual support)

## Troubleshooting

If deployment fails:
1. Check the **Actions** tab for error messages
2. Ensure all files are committed and pushed
3. Verify the workflow file is in `.github/workflows/deploy.yml`
4. Make sure GitHub Pages is enabled in repository settings

## Features Available on Live Site

Your deployed calendar includes:
- 🗓️ Full 2026 calendar functionality
- 🌸 Portuguese flowers for each month
- 🌍 English and Chinese language learning
- 📱 Responsive design for all devices
- 🧪 Comprehensive test suites
- ♿ Full accessibility support

## Next Steps

1. Share your live calendar URL: https://mrfeixiang.github.io/2026/
2. Test all features on the live site
3. Consider adding a custom domain if desired
4. Monitor the Actions tab for successful deployments

---

**🎉 Congratulations! Your Multilingual Calendar 2026 is now live on GitHub Pages!**