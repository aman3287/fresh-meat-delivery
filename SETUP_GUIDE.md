# Fresh Meat Delivery Platform - Complete Setup Guide

## 🎯 Project Overview
A complete raw non-veg delivery platform similar to Zomato, built with:
- **Frontend**: React.js with modern UI/UX
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Real-time**: Socket.IO for live order tracking

## 📋 Prerequisites
Before starting, install these on your system:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **MongoDB** 
   - Option A: Install locally - https://www.mongodb.com/try/download/community
   - Option B: Use MongoDB Atlas (Cloud) - https://www.mongodb.com/cloud/atlas
   - Verify: `mongod --version`

3. **Git** (optional, for version control)
   - Download: https://git-scm.com/

## 🚀 Step-by-Step Setup

### Step 1: Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd fresh-meat-delivery/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   - Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Configure .env file**
   Open `.env` and update:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fresh-meat-delivery
   JWT_SECRET=your_super_secret_key_change_this
   JWT_EXPIRE=7d
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

   **For MongoDB Atlas (Cloud):**
   Replace `MONGODB_URI` with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fresh-meat-delivery
   ```

5. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```
   (Keep this terminal open)

6. **Seed the database** (in a new terminal)
   ```bash
   cd fresh-meat-delivery/backend
   node seed.js
   ```
   This creates sample products and an admin user.

7. **Start the backend server**
   ```bash
   npm start
   ```
   
   Server should start at: http://localhost:5000
   
   You should see:
   ```
   ✅ MongoDB Connected Successfully
   🚀 Server running on port 5000
   ```

### Step 2: Frontend Setup

1. **Open a new terminal** and navigate to frontend:
   ```bash
   cd fresh-meat-delivery/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file** (optional)
   Create `.env` in frontend folder:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the React app**
   ```bash
   npm start
   ```
   
   App should open automatically at: http://localhost:3000

### Step 3: Test the Application

1. **Access the app**: http://localhost:3000

2. **Default Admin Account**:
   - Email: admin@freshmeat.com
   - Password: admin123

3. **Create accounts**:
   - Customer account (for ordering)
   - Delivery Partner account (for deliveries)

## 👥 User Roles

### 1. Customer
- Browse products by category
- Add items to cart with specific cuts
- Place orders
- Track order status in real-time
- Rate completed orders

### 2. Delivery Partner
- View available orders nearby
- Accept and manage deliveries
- Update order status
- Track earnings

### 3. Admin
- Manage products
- View all orders
- Monitor system

## 🏗️ Project Structure

```
fresh-meat-delivery/
├── backend/
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/           # API endpoints
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── users.js
│   │   └── delivery.js
│   ├── middleware/       # Auth & validation
│   ├── server.js         # Main server file
│   ├── seed.js          # Database seeder
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── context/      # State management
    │   ├── utils/        # API calls
    │   ├── App.js
    │   └── App.css
    ├── public/
    └── package.json
```

## 🌐 Deployment Guide

### Deploy Backend (Heroku)

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create app**:
   ```bash
   cd backend
   heroku create your-app-name-backend
   ```

4. **Set environment variables**:
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
   heroku config:set JWT_SECRET="your_secret_key"
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

6. **Seed database**:
   ```bash
   heroku run node seed.js
   ```

### Deploy Frontend (Vercel/Netlify)

#### Option A: Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Add environment variable**:
   - In Vercel dashboard, add `REACT_APP_API_URL` with your backend URL

#### Option B: Netlify

1. **Build the app**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy on Netlify**:
   - Go to https://netlify.com
   - Drag and drop the `build` folder
   - Add environment variable: `REACT_APP_API_URL`

### Custom Domain Setup

1. **Buy a domain** from:
   - GoDaddy, Namecheap, Google Domains, etc.

2. **Configure DNS**:
   - Point domain to Vercel/Netlify (frontend)
   - Create subdomain (api.yourdomain.com) for backend

3. **SSL Certificate**: Automatically provided by Vercel/Netlify

## 📱 Features

### Customer Features
- ✅ Browse products by category (Chicken, Mutton, Fish, Eggs, Seafood, Pork)
- ✅ Select specific cuts (breast, thighs, boneless, etc.)
- ✅ Choose quantity in kg/pieces
- ✅ Add multiple items to cart
- ✅ Save multiple delivery addresses
- ✅ Place orders with COD/Online payment
- ✅ Real-time order tracking
- ✅ Order history
- ✅ Rate orders

### Delivery Partner Features
- ✅ View available orders based on location
- ✅ Accept orders
- ✅ Get shop location and customer address
- ✅ Update order status (picking up → picked up → in transit → delivered)
- ✅ Track earnings
- ✅ Toggle availability

### Admin Features
- ✅ Add/Edit/Delete products
- ✅ Manage product cuts and pricing
- ✅ View all orders
- ✅ Monitor delivery partners

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: Whitelist your IP address

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

### CORS Error
- Verify `FRONTEND_URL` in backend `.env`
- Check frontend is running on correct port

### Module Not Found
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For issues:
1. Check error messages in browser console (F12)
2. Check backend terminal for errors
3. Verify all environment variables are set
4. Ensure MongoDB is running

## 🎉 Success!

If everything is set up correctly:
- Backend runs on http://localhost:5000
- Frontend runs on http://localhost:3000
- You can register users, browse products, place orders!

## 🚀 Next Steps

1. Customize products in `backend/seed.js`
2. Add payment gateway (Razorpay/Stripe)
3. Add SMS notifications (Twilio)
4. Implement Google Maps for live tracking
5. Add image upload for products

---

**Happy Coding! 🥩**
