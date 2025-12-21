# ⚡ Quick Start Guide - Fresh Meat Delivery

## 🎯 What You'll Need (Download First)

### 1. Node.js
- **Windows/Mac**: Download from https://nodejs.org/ (v16 or higher)
- **Verify**: Open terminal and type `node --version`

### 2. MongoDB
Choose ONE option:

**Option A: MongoDB Atlas (Recommended - Cloud, Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a cluster (free tier)
4. Get your connection string
5. Skip local MongoDB installation

**Option B: Local MongoDB**
1. Download from https://www.mongodb.com/try/download/community
2. Install and run `mongod`

## 🚀 5-Minute Setup

### Step 1: Open Terminal/Command Prompt

Windows: Press `Win + R`, type `cmd`, press Enter
Mac: Press `Cmd + Space`, type `terminal`, press Enter

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd path/to/fresh-meat-delivery/backend

# Install packages (takes 1-2 minutes)
npm install

# Create configuration file
copy .env.example .env     # Windows
cp .env.example .env       # Mac/Linux

# IMPORTANT: Open .env file and add your MongoDB connection
# For MongoDB Atlas, use your connection string
# For local MongoDB, use: mongodb://localhost:27017/fresh-meat-delivery
```

### Step 3: Start Backend

```bash
# Seed the database with sample data
node seed.js

# Start the server
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

**Keep this terminal open!**

### Step 4: Frontend Setup (New Terminal)

```bash
# Open a NEW terminal window
cd path/to/fresh-meat-delivery/frontend

# Install packages
npm install

# Start the app
npm start
```

Your browser should automatically open http://localhost:3000

## 🎉 You're Done!

### Test the App:

1. **Register a new account** (Customer or Delivery Partner)
2. **Or login with admin**:
   - Email: admin@freshmeat.com
   - Password: admin123

3. **As Customer**:
   - Browse products
   - Add items to cart
   - Place an order

4. **As Delivery Partner**:
   - View available orders
   - Accept orders
   - Update status

## ❗ Common Issues

### "Cannot find module..."
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Port 5000 already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### "MongoDB connection error"
- Check if MongoDB is running: `mongod`
- Verify your connection string in `.env`
- For Atlas: Whitelist your IP address

## 📱 Next Steps

1. Customize products in `backend/seed.js`
2. Add your logo and branding
3. Configure payment gateway
4. Deploy online (see SETUP_GUIDE.md)

## 🆘 Need Help?

- Check browser console (F12) for errors
- Check backend terminal for error messages
- Ensure both frontend and backend are running
- Verify .env file is properly configured

---

**Happy Building! 🥩**
