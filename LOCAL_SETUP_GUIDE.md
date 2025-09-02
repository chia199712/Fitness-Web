# Fitness App - Local Setup Guide

This guide will walk you through setting up and running the fitness app on your local computer. Follow these steps carefully, and you'll have the app running in no time!

## Prerequisites Check

Before we start, make sure your computer has the required software installed.

### 1. Check Node.js Installation

Open your **Command Prompt** (Windows) or **Terminal** (Mac/Linux):

**Windows:** Press `Win + R`, type `cmd`, and press Enter
**Mac:** Press `Cmd + Space`, type `terminal`, and press Enter
**Linux:** Press `Ctrl + Alt + T`

Type this command and press Enter:
```bash
node --version
```

**Expected Output:** You should see something like `v18.17.0` or higher (any version 18 or above)

If you see an error like "command not found" or the version is below 18, you need to install Node.js:
- Visit https://nodejs.org
- Download and install the LTS (Long Term Support) version
- Restart your terminal and try the command again

### 2. Check npm Installation

npm comes with Node.js, so verify it's working:
```bash
npm --version
```

**Expected Output:** You should see something like `9.6.7` or similar

## Project Setup

### 3. Navigate to the Project Folder

Use the `cd` command to navigate to your project folder:
```bash
cd E:\test\work\fitness-app
```

**What this does:** Changes your current directory to the fitness app folder

**Expected Output:** Your terminal prompt should now show the fitness-app directory

### 4. Verify Project Structure

Check that you have the correct folders:
```bash
dir
```
(On Windows) or
```bash
ls
```
(On Mac/Linux)

**Expected Output:** You should see folders named `backend` and `frontend`

### 5. Set Up Environment Variables

The app needs configuration files to work properly. Let's create them:

#### Backend Environment Setup
```bash
cd backend
copy .env.example .env
```
(On Windows) or
```bash
cd backend
cp .env.example .env
```
(On Mac/Linux)

**What this does:** Creates a configuration file for the backend server

#### Frontend Environment Setup
```bash
cd ..\frontend
copy .env.example .env
```
(On Windows) or
```bash
cd ../frontend
cp .env.example .env
```
(On Mac/Linux)

**What this does:** Creates a configuration file for the frontend app

### 6. Install Dependencies

Now we need to install all the required packages for both parts of the app.

#### Install Backend Dependencies
```bash
cd ..\backend
npm install
```
(On Windows) or
```bash
cd ../backend
npm install
```
(On Mac/Linux)

**What this does:** Downloads and installs all the packages the backend needs to run

**Expected Output:** You'll see lots of text scrolling by as packages are downloaded. This may take 1-3 minutes. At the end, you should see something like:
```
added 245 packages, and audited 246 packages in 45s
found 0 vulnerabilities
```

#### Install Frontend Dependencies
```bash
cd ..\frontend
npm install
```
(On Windows) or
```bash
cd ../frontend
npm install
```
(On Mac/Linux)

**What this does:** Downloads and installs all the packages the frontend needs to run

**Expected Output:** Similar to the backend installation, you'll see packages being downloaded. This may also take 1-3 minutes.

## Running the Application

You need to run both the backend and frontend servers. The easiest way is to use two separate terminal windows.

### 7. Start the Backend Server

#### Open First Terminal Window
Keep your current terminal open or open a new one and navigate to the backend folder:
```bash
cd E:\test\work\fitness-app\backend
```

#### Start the Backend
```bash
npm run dev
```

**What this does:** Starts the backend server in development mode with hot-reload

**Expected Output:** You should see something like:
```
[nodemon] starting `ts-node src/app.ts`
Server running on port 3001
Database connection established
API server started successfully
```

**Important:** Leave this terminal window open! The backend server needs to keep running.

### 8. Start the Frontend Server

#### Open Second Terminal Window
Open a **new** terminal window (don't close the first one!) and navigate to the frontend folder:
```bash
cd E:\test\work\fitness-app\frontend
```

#### Start the Frontend
```bash
npm run dev
```

**What this does:** Starts the frontend development server with hot-reload

**Expected Output:** You should see something like:
```
VITE v5.4.2  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

## Accessing the Application

### 9. Open Your Web Browser

Open your favorite web browser (Chrome, Firefox, Safari, Edge) and go to:

```
http://localhost:5173
```

**What you should see:**
- The fitness app login/registration page
- Clean, modern interface with the app branding
- Forms for logging in or creating a new account

### 10. Test the Backend API

In a new browser tab, visit:
```
http://localhost:3001/api/health
```

**What you should see:**
- A JSON response like: `{"status":"ok","message":"Server is running"}`
- This confirms the backend is working correctly

## Verification Checklist

Make sure everything is working by checking these points:

- [ ] **Backend Terminal**: Shows "Server running on port 3001" without errors
- [ ] **Frontend Terminal**: Shows "Local: http://localhost:5173/" without errors
- [ ] **Frontend Browser**: Fitness app interface loads at http://localhost:5173
- [ ] **Backend API**: Health check returns success at http://localhost:3001/api/health
- [ ] **No Error Messages**: Both terminal windows show no red error messages

## Using the Application

### Basic Navigation
1. **Registration**: Create a new account if you're a first-time user
2. **Login**: Use your credentials to access the app
3. **Dashboard**: View your fitness overview and statistics
4. **Workout Log**: Record and track your exercises
5. **Exercise Library**: Browse available exercises
6. **Templates**: Create and manage workout templates
7. **Settings**: Customize your app preferences

## Stopping the Application

When you're done using the app:

1. **Stop Frontend**: In the frontend terminal, press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)
2. **Stop Backend**: In the backend terminal, press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)
3. **Close Terminals**: You can now close both terminal windows

## Common Troubleshooting

### Problem: "Port already in use" Error

**Solution:**
1. Check if another application is using the port
2. Kill any existing Node.js processes:
   - Windows: Open Task Manager, find "Node.js" processes, and end them
   - Mac/Linux: Run `killall node` in terminal
3. Try starting the servers again

### Problem: Frontend Shows "Cannot connect to backend"

**Possible Causes & Solutions:**
1. **Backend not running**: Make sure the backend terminal shows "Server running on port 3001"
2. **Wrong port**: Check that backend is running on port 3001 and frontend on port 5173
3. **Firewall blocking**: Temporarily disable firewall and try again

### Problem: "Module not found" Errors

**Solution:**
1. Delete `node_modules` folders in both backend and frontend
2. Run `npm install` again in both directories
3. Make sure you're in the correct directory when running commands

### Problem: npm install fails

**Solution:**
1. Clear npm cache: `npm cache clean --force`
2. Delete `package-lock.json` files
3. Try running `npm install` again
4. Make sure you have stable internet connection

### Problem: Browser shows blank page

**Possible Solutions:**
1. Check browser console for errors (press F12, look at Console tab)
2. Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)
3. Try opening in an incognito/private browser window
4. Clear browser cache and cookies

### Problem: Changes not showing up

**Solution:**
- Both servers support hot-reload, so changes should appear automatically
- If not, try refreshing your browser
- Check that both terminal windows are still running without errors

## Getting Help

If you're still having trouble:

1. **Check Terminal Output**: Look for red error messages in both terminal windows
2. **Browser Console**: Open browser developer tools (F12) and check for errors
3. **Port Conflicts**: Make sure no other applications are using ports 3001 or 5173
4. **Restart Everything**: Stop both servers, close terminals, and start the setup process again

## Summary

Once everything is running correctly, you'll have:

- **Backend API Server**: Running at http://localhost:3001
- **Frontend Web App**: Running at http://localhost:5173
- **Two Terminal Windows**: Both showing successful startup messages
- **Working Application**: Accessible in your web browser

The app will automatically save your data and reload when you make changes to the code. Enjoy using your fitness tracking application!