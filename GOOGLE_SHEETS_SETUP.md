# Google Sheets Setup Guide 📊

This guide will walk you through setting up Google Sheets integration for your wedding seating chart app.

## Step 1: Create Your Guest List Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it something like "Wedding Guest List"
3. Set up your columns exactly like this:

| A (Name) | B (Table) |
|----------|-----------|
| John Smith | 1 |
| Jane Doe | 2 |
| Bob Johnson | 1 |
| Alice Brown | 3 |
| Charlie Wilson | 2 |

### Important Notes:
- **Column A**: Full guest names (first and last name recommended)
- **Column B**: Table numbers (can be numbers or text like "Head Table")
- The first row should contain your data, not headers
- Names are matched case-insensitively, so "john smith" will match "John Smith"

## Step 2: Get Your Sheet ID

1. Look at your Google Sheet URL: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
2. Copy the long string between `/d/` and `/edit` - this is your Sheet ID
3. Save this for your environment variables

## Step 3: Set Up Google Cloud Project

### Create a New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "New Project"
4. Name your project (e.g., "Wedding Seating Chart")
5. Click "Create"

### Enable Google Sheets API
1. In your new project, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 4: Create a Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Enter a name like "wedding-seating-chart"
4. Click "Create and Continue"
5. Skip the role assignment (click "Continue")
6. Click "Done"

### Generate API Key
1. Click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the file - this contains your credentials!

## Step 5: Share Your Sheet

1. Open your Google Sheet
2. Click the "Share" button (top right)
3. Add the service account email (found in your downloaded JSON file as `client_email`)
4. Give it "Viewer" permissions
5. Click "Send"

## Step 6: Set Up Environment Variables

Copy the following values from your downloaded JSON file to your `.env.local`:

```bash
GOOGLE_PROJECT_ID=           # "project_id" from JSON
GOOGLE_PRIVATE_KEY_ID=       # "private_key_id" from JSON  
GOOGLE_PRIVATE_KEY=          # "private_key" from JSON (keep the quotes and newlines)
GOOGLE_CLIENT_EMAIL=         # "client_email" from JSON
GOOGLE_CLIENT_ID=            # "client_id" from JSON
GOOGLE_SHEET_ID=             # Your Sheet ID from Step 2
```

## Testing Your Setup

1. Add a few test guests to your Google Sheet
2. Run your app with `npm run dev`
3. Try searching for one of your test guests
4. If it works, you're all set! 🎉

## Troubleshooting

### "Guest not found" errors
- Check that names in your sheet match exactly what guests will type
- Make sure there are no extra spaces or special characters
- Consider adding common variations (e.g., "Bob Smith" and "Robert Smith")

### "Server configuration error"
- Double-check all environment variables are set correctly
- Make sure your private key includes the full `-----BEGIN PRIVATE KEY-----` header
- Verify your Sheet ID is correct

### "Permission denied" errors
- Ensure you've shared your sheet with the service account email
- Check that the Google Sheets API is enabled in your Google Cloud project

## Pro Tips 💡

1. **Test with real names**: Add yourself and a few family members first to test
2. **Consider nicknames**: Some guests might use "Mike" instead of "Michael"
3. **Keep it simple**: Avoid special characters in names when possible
4. **Backup your data**: Keep a copy of your guest list somewhere safe
5. **Update easily**: You can modify your Google Sheet anytime, even during the event!
