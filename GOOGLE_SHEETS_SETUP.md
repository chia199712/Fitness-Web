# Google Sheets Database Setup Guide

This fitness app uses Google Sheets as its database backend. This guide will walk you through setting up the Google Sheets integration.

## Prerequisites

1. Google Cloud Console account
2. Google Sheets access
3. Node.js installed

## Step 1: Create Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API for your project:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `fitness-app-service`
   - Description: `Service account for fitness app Google Sheets access`
4. Skip the optional steps and click "Done"

## Step 3: Generate Service Account Key

1. Click on the created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format and click "Create"
5. Save the downloaded JSON file securely

## Step 4: Create Google Sheets Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Fitness App Database" or similar
4. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - Spreadsheet ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 5: Share Spreadsheet with Service Account

1. In your Google Sheets document, click "Share"
2. Add the service account email (found in the JSON file as `client_email`)
3. Give it "Editor" permissions
4. Click "Send" (uncheck "Notify people" since it's a service account)

## Step 6: Set Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_CLIENT_EMAIL=your_service_account_email_here
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important Notes:**
- Replace `your_spreadsheet_id_here` with the actual spreadsheet ID
- Replace `your_service_account_email_here` with the `client_email` from your JSON file
- Replace `YOUR_PRIVATE_KEY_HERE` with the `private_key` from your JSON file (keep the quotes and newlines)
- Generate a secure random string for `JWT_SECRET`

## Step 7: Initialize Database Structure

Run the initialization script to create the required worksheets and system data:

```bash
cd backend
npm install
node scripts/initializeGoogleSheets.js
```

This script will create the following worksheets with proper headers:

### Database Schema

#### 1. Users
- user_id, email, name, password_hash, created_at, updated_at

#### 2. Exercises  
- exercise_id, name, category, muscle_groups, equipment, instructions, video_url, image_url, is_system, user_id, created_at

#### 3. Workouts
- workout_id, user_id, name, date, duration, total_volume, notes, template_id, created_at, updated_at

#### 4. WorkoutExercises
- workout_exercise_id, workout_id, exercise_id, order, created_at

#### 5. Sets
- set_id, workout_exercise_id, set_number, weight, reps, duration, distance, rest_time, completed, notes, created_at

#### 6. Templates
- template_id, user_id, name, description, category, is_public, created_at, updated_at

#### 7. TemplateExercises
- template_exercise_id, template_id, exercise_id, order, target_sets, target_reps, target_weight, created_at

#### 8. UserSettings
- user_id, theme, language, units, default_rest_time, notifications_*, privacy_*, updated_at

## Step 8: Verify Setup

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Check that the server starts without errors
3. Verify that your Google Sheets has been populated with the worksheet tabs
4. The "Exercises" sheet should contain 15 pre-loaded system exercises

## Step 9: Start the Application

1. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Troubleshooting

### Common Issues

**Error: "GOOGLE_SPREADSHEET_ID environment variable is not set"**
- Ensure your `.env` file is in the `backend` directory
- Verify the spreadsheet ID is correctly copied

**Error: "Google service account credentials are not set"**
- Check that `GOOGLE_CLIENT_EMAIL` and `GOOGLE_PRIVATE_KEY` are set in `.env`
- Ensure the private key includes the BEGIN/END lines and proper newlines

**Error: "The caller does not have permission"**
- Make sure you shared the spreadsheet with the service account email
- Verify the service account has "Editor" permissions

**Error: "Unable to parse key"**
- Check that the private key is properly formatted with quotes and `\n` for newlines
- The key should start with `"-----BEGIN PRIVATE KEY-----\n`

### API Rate Limits

Google Sheets has API quotas:
- 100 requests per 100 seconds per user
- 1000 requests per 100 seconds

For high-traffic applications, consider implementing:
- Request batching
- Caching mechanisms
- Request queuing

## Security Considerations

1. **Never commit the `.env` file** - Add it to `.gitignore`
2. **Keep service account credentials secure**
3. **Use environment variables in production**
4. **Regularly rotate service account keys**
5. **Monitor API usage in Google Cloud Console**

## Backup Strategy

1. **Regular exports**: Export your Google Sheets data regularly
2. **Version control**: Use Google Sheets version history
3. **Multiple environments**: Use separate spreadsheets for development/production

## Production Deployment

For production deployment:

1. Use environment variables instead of `.env` files
2. Consider using Google Cloud Secret Manager for credentials
3. Implement proper error handling and retry logic
4. Set up monitoring and alerting for API usage
5. Consider migrating to a traditional database for better performance

## Support

If you encounter issues:
1. Check the Google Cloud Console for API errors
2. Verify permissions in Google Sheets
3. Review the server logs for detailed error messages
4. Ensure all environment variables are correctly set