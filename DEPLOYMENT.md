# Deployment Guide 🚀

This guide covers deploying your wedding seating chart app to various platforms.

## Vercel (Recommended) ⚡

Vercel is the easiest and fastest way to deploy your Next.js app.

### Prerequisites
- Your code pushed to GitHub, GitLab, or Bitbucket
- Google Sheets API set up (see `GOOGLE_SHEETS_SETUP.md`)

### Steps

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Your Project**
   - Click "New Project"
   - Select your wedding seating chart repository
   - Click "Import"

3. **Configure Environment Variables**
   - In the deployment settings, add all your environment variables:
   ```
   GOOGLE_PROJECT_ID=your-project-id
   GOOGLE_PRIVATE_KEY_ID=your-private-key-id
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
   GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_SHEET_ID=your-sheet-id
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Go to your project settings in Vercel
   - Add your custom domain (e.g., `seating.yourwedding.com`)
   - Follow Vercel's DNS configuration instructions

### Automatic Updates
- Every time you push to your main branch, Vercel will automatically redeploy
- Perfect for last-minute guest list changes!

## Netlify 🌐

### Steps

1. **Build Your App**
   ```bash
   npm run build
   npm run export  # You'll need to add this script
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `out` folder
   - Or connect your GitHub repository

3. **Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add all your Google Sheets API credentials

## Railway 🚂

Great for more control and database needs.

### Steps

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables**
   ```bash
   railway variables set GOOGLE_PROJECT_ID=your-project-id
   railway variables set GOOGLE_PRIVATE_KEY_ID=your-private-key-id
   # ... add all other variables
   ```

## Creating Your QR Code 📱

Once deployed, you'll want to create a QR code for guests to scan:

### Online QR Code Generators
1. [QR Code Generator](https://www.qr-code-generator.com/)
2. [QRCode Monkey](https://www.qrcode-monkey.com/)
3. [Google Charts QR API](https://developers.google.com/chart/infographics/docs/qr_codes)

### Steps
1. Copy your deployed app's URL
2. Paste it into a QR code generator
3. Customize the design (optional):
   - Add your wedding colors
   - Include a logo or heart icon
   - Add text like "Find Your Table"
4. Download as PNG or SVG
5. Print and display at your venue

### QR Code Placement Ideas 💡
- **Welcome table**: Large sign with QR code
- **Guest tables**: Small cards with QR codes
- **Programs**: Include QR code in wedding programs
- **Entrance**: Large banner or easel sign
- **Place cards**: Individual QR codes (if you want to be extra!)

## Testing Your Deployment ✅

Before the big day, make sure to test:

1. **Different devices**: Test on various phones and tablets
2. **Different names**: Try searching for different guests
3. **Edge cases**: Test names with apostrophes, hyphens, etc.
4. **Network conditions**: Test with slower internet connections

## Monitoring and Analytics 📊

### Vercel Analytics (Recommended)
- Enable Vercel Analytics in your dashboard
- Track how many guests use the app
- Monitor performance and errors

### Google Analytics (Optional)
Add to your `app/layout.tsx`:

```tsx
import Script from 'next/script'

// Add this inside your component
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_TRACKING_ID');
  `}
</Script>
```

## Day-of-Wedding Tips 🎉

1. **Have a backup**: Print a traditional seating chart just in case
2. **Designate helpers**: Have tech-savvy friends help guests who need assistance
3. **Test the QR code**: Make sure it works with the venue's WiFi
4. **Monitor usage**: Keep an eye on any error reports
5. **Quick updates**: You can update your Google Sheet even during the event!

## Troubleshooting 🔧

### Common Deployment Issues

**Build Fails**
- Check that all dependencies are in `package.json`
- Ensure environment variables are set correctly
- Look at build logs for specific error messages

**App Loads but Search Doesn't Work**
- Verify Google Sheets API credentials
- Check that your sheet is shared with the service account
- Ensure Sheet ID is correct

**QR Code Doesn't Work**
- Test the URL manually in a browser
- Make sure the QR code points to the correct domain
- Check that HTTPS is enabled (required for most QR readers)

Need help? Create an issue in the repository! 💝
