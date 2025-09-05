# Quick Setup Guide 🚀

## Prerequisites

Make sure you have Node.js installed:
- Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- This will also install npm

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Google Sheets** (see `GOOGLE_SHEETS_SETUP.md` for detailed instructions)
   - Create a Google Sheet with guest names and table numbers
   - Set up Google Sheets API
   - Get your credentials

3. **Configure Environment Variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your Google Sheets credentials
   ```

4. **Run the App**
   ```bash
   npm run dev
   ```

5. **Visit** `http://localhost:3000` to test!

## Next Steps

- Follow `DEPLOYMENT.md` to deploy your app
- Create a QR code pointing to your deployed URL
- Test with real guest names before your wedding

## Need Help?

Check out these detailed guides:
- `GOOGLE_SHEETS_SETUP.md` - Complete Google Sheets setup
- `DEPLOYMENT.md` - Deploy to Vercel, Netlify, or other platforms
- `README.md` - Full documentation and features
