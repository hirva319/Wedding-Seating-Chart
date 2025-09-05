# Wedding Seating Chart 💒

A beautiful, mobile-friendly web application that allows wedding guests to easily find their table assignments by scanning a QR code and entering their name. Perfect for modern weddings!

## Features ✨

- 🔍 **Easy Guest Search**: Guests simply enter their name to find their table
- 📱 **Mobile-First Design**: Optimized for smartphones and tablets
- 🎨 **Beautiful Wedding Theme**: Elegant design with customizable colors
- 📊 **Google Sheets Integration**: Manage your guest list in a familiar spreadsheet
- ⚡ **Fast & Reliable**: Built with Next.js for optimal performance
- 🔒 **Secure**: No guest data stored on the server

## Quick Start 🚀

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/wedding-seating-chart.git
cd wedding-seating-chart

# Install dependencies
npm install
```

### 2. Set up Google Sheets

1. Create a new Google Sheet with the following structure:
   ```
   | Name          | Table |
   |---------------|-------|
   | John Smith    | 1     |
   | Jane Doe      | 2     |
   | Bob Johnson   | 1     |
   ```

2. Make sure Column A contains guest names and Column B contains table numbers
3. Note your Sheet ID from the URL (the long string between `/spreadsheets/d/` and `/edit`)

### 3. Set up Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Download the JSON key file
5. Share your Google Sheet with the service account email (found in the JSON file)

### 4. Configure Environment Variables

1. Copy `env.example` to `.env.local`
2. Fill in the values from your Google Service Account JSON:

```bash
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_SHEET_ID=your-sheet-id
```

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Visit `http://localhost:3000` to see your seating chart app!

## Deployment 🌐

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

This Next.js app can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Creating a QR Code 📱

Once deployed, create a QR code pointing to your app's URL:

1. Use any QR code generator (like qr-code-generator.com)
2. Enter your deployed app's URL
3. Download and print the QR code
4. Place it at your wedding venue entrance or on tables

## Customization 🎨

### Colors & Styling

Edit `tailwind.config.js` to change the wedding theme colors:

```javascript
colors: {
  wedding: {
    primary: '#d4af37',    // Gold
    secondary: '#f7f3e9',  // Cream
    accent: '#8b7355',     // Brown
    text: '#2c2c2c'        // Dark gray
  }
}
```

### Guest Data Structure

The app expects your Google Sheet to have:
- **Column A**: Guest names (case-insensitive matching)
- **Column B**: Table numbers or names

## Troubleshooting 🔧

### Common Issues

1. **"Guest not found"**: Check name spelling in your Google Sheet
2. **"Server configuration error"**: Verify all environment variables are set
3. **"Unable to fetch guest information"**: Check Google Sheets API permissions

### Support

If you need help setting this up for your wedding, feel free to create an issue or reach out!

## License 📄

This project is open source and available under the [MIT License](LICENSE).
