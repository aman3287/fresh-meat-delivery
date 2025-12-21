# 🥩 Fresh Meat Delivery Platform

A complete full-stack raw non-veg delivery platform similar to Zomato, but specialized for fresh meat delivery.

## 🌟 Features

### For Customers
- Browse products by category (Chicken, Mutton, Fish, Eggs, Seafood, Pork)
- Select specific cuts (breast, wings, boneless, curry cut, etc.)
- Add to cart with custom quantities
- Place orders with multiple delivery addresses
- Real-time order tracking
- Rate orders and delivery partners
- Order history

### For Delivery Partners
- View available orders based on location
- Accept orders with one click
- Navigate to pickup location (shop)
- Update order status in real-time
- Track earnings and delivery history
- Toggle availability status

### For Admins
- Manage product catalog
- Add/edit/delete products and cuts
- View all orders
- Monitor delivery partners
- Analytics dashboard

## 🛠️ Tech Stack

**Frontend:**
- React.js 18
- React Router v6
- Context API for state management
- Socket.IO Client for real-time updates
- React Toastify for notifications
- React Icons
- Axios for API calls

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO for real-time features
- JWT for authentication
- Bcrypt for password hashing

## 📦 Installation

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions.

### Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd fresh-meat-delivery
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm start
```

3. **Frontend Setup** (in a new terminal)
```bash
cd frontend
npm install
npm start
```

4. **Seed Database**
```bash
cd backend
node seed.js
```

## 🔑 Default Login Credentials

**Admin:**
- Email: admin@freshmeat.com
- Password: admin123

Create customer and delivery partner accounts through the registration page.

## 📁 Project Structure

```
fresh-meat-delivery/
├── backend/
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Main server
│   └── seed.js          # Database seeder
├── frontend/
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── context/     # React Context
│       ├── utils/       # Utilities & API
│       ├── App.js
│       └── App.css
└── SETUP_GUIDE.md      # Detailed setup guide
```

## 🚀 Deployment

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for deployment instructions to:
- Heroku (Backend)
- Vercel/Netlify (Frontend)
- Custom domain setup

## 🎯 Business Model

1. **Customer** places order → Selects products and cuts
2. **System** assigns order → Finds nearest available delivery partner
3. **Delivery Partner** accepts → Gets shop and customer location
4. **Partner** picks up → Goes to meat shop, buys items
5. **Partner** delivers → Delivers to customer
6. **Payment** collected → Cash on delivery or online

## 💰 Revenue Streams

- Delivery fee per order
- Platform commission per transaction
- Subscription for delivery partners
- Premium listings for meat shops

## 📱 Future Enhancements

- [ ] Google Maps integration for real-time tracking
- [ ] Payment gateway (Razorpay/Stripe)
- [ ] SMS/Email notifications
- [ ] Push notifications
- [ ] Scheduled deliveries
- [ ] Subscription plans
- [ ] Refer and earn
- [ ] Promo codes and discounts
- [ ] Shop partner dashboard
- [ ] Advanced analytics

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for your startup idea!

## 🙏 Acknowledgments

- React community
- Express.js team
- MongoDB Atlas
- All open-source contributors

---

**Happy Coding! 🥩**
