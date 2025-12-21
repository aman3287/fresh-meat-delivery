const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const products = [
  {
    name: 'Chicken',
    category: 'chicken',
    description: 'Fresh farm chicken, antibiotic-free, cleaned and cut as per your choice',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300',
    isPopular: true,
    cuts: [
      { name: 'Whole Chicken', pricePerKg: 220, unit: 'kg', description: 'Full chicken', isAvailable: true },
      { name: 'Curry Cut', pricePerKg: 240, unit: 'kg', description: 'Medium pieces with bones', isAvailable: true },
      { name: 'Boneless', pricePerKg: 320, unit: 'kg', description: 'Boneless chicken pieces', isAvailable: true },
      { name: 'Breast', pricePerKg: 350, unit: 'kg', description: 'Chicken breast boneless', isAvailable: true },
      { name: 'Wings', pricePerKg: 200, unit: 'kg', description: 'Chicken wings', isAvailable: true },
      { name: 'Thighs', pricePerKg: 280, unit: 'kg', description: 'Chicken thighs', isAvailable: true },
      { name: 'Drumsticks', pricePerKg: 260, unit: 'kg', description: 'Chicken drumsticks', isAvailable: true }
    ],
    tags: ['fresh', 'farm-raised', 'antibiotic-free'],
    rating: 4.5,
    reviewCount: 234
  },
  {
    name: 'Mutton',
    category: 'mutton',
    description: 'Premium quality goat meat, fresh and tender',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=300',
    isPopular: true,
    cuts: [
      { name: 'Curry Cut (With Bone)', pricePerKg: 650, unit: 'kg', description: 'Medium pieces with bone', isAvailable: true },
      { name: 'Boneless', pricePerKg: 850, unit: 'kg', description: 'Boneless mutton pieces', isAvailable: true },
      { name: 'Keema (Minced)', pricePerKg: 700, unit: 'kg', description: 'Minced mutton', isAvailable: true },
      { name: 'Chops', pricePerKg: 750, unit: 'kg', description: 'Mutton chops', isAvailable: true },
      { name: 'Leg Piece', pricePerKg: 680, unit: 'kg', description: 'Leg pieces with bone', isAvailable: true },
      { name: 'Ribs', pricePerKg: 720, unit: 'kg', description: 'Mutton ribs', isAvailable: true }
    ],
    tags: ['halal', 'fresh', 'premium'],
    rating: 4.7,
    reviewCount: 156
  },
  {
    name: 'Fish - Rohu',
    category: 'fish',
    description: 'Fresh water fish, cleaned and cut',
    image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=300',
    isPopular: true,
    cuts: [
      { name: 'Whole Fish', pricePerKg: 280, unit: 'kg', description: 'Whole fish cleaned', isAvailable: true },
      { name: 'Curry Cut', pricePerKg: 300, unit: 'kg', description: 'Medium pieces', isAvailable: true },
      { name: 'Boneless', pricePerKg: 420, unit: 'kg', description: 'Boneless fish pieces', isAvailable: true },
      { name: 'Steaks', pricePerKg: 350, unit: 'kg', description: 'Fish steaks', isAvailable: true }
    ],
    tags: ['fresh', 'omega-3'],
    rating: 4.3,
    reviewCount: 89
  },
  {
    name: 'Fish - Pomfret',
    category: 'fish',
    description: 'Premium sea fish, fresh catch',
    image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=300',
    cuts: [
      { name: 'Whole Fish', pricePerKg: 550, unit: 'kg', description: 'Whole pomfret cleaned', isAvailable: true },
      { name: 'Fillet', pricePerKg: 650, unit: 'kg', description: 'Boneless fillet', isAvailable: true }
    ],
    tags: ['fresh', 'sea-fish', 'premium'],
    rating: 4.6,
    reviewCount: 67
  },
  {
    name: 'Eggs',
    category: 'eggs',
    description: 'Farm fresh eggs, brown or white',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300',
    isPopular: true,
    cuts: [
      { name: 'White Eggs', pricePerKg: 6, pricePerPiece: 6, unit: 'piece', description: 'Farm fresh white eggs', isAvailable: true },
{ name: 'Brown Eggs', pricePerKg: 7, pricePerPiece: 7, unit: 'piece', description: 'Farm fresh brown eggs', isAvailable: true },
{ name: 'White Eggs (Dozen)', pricePerKg: 72, pricePerPiece: 72, unit: 'dozen', description: '12 white eggs', isAvailable: true },
{ name: 'Brown Eggs (Dozen)', pricePerKg: 84, pricePerPiece: 84, unit: 'dozen', description: '12 brown eggs', isAvailable: true }
    ],
    tags: ['fresh', 'farm', 'protein-rich'],
    rating: 4.8,
    reviewCount: 445
  },
  {
    name: 'Prawns',
    category: 'seafood',
    description: 'Fresh prawns, cleaned and deveined',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=300',
    isPopular: true,
    cuts: [
      { name: 'Small (With Shell)', pricePerKg: 480, unit: 'kg', description: 'Small prawns with shell', isAvailable: true },
      { name: 'Medium (With Shell)', pricePerKg: 650, unit: 'kg', description: 'Medium prawns with shell', isAvailable: true },
      { name: 'Large (With Shell)', pricePerKg: 850, unit: 'kg', description: 'Large prawns with shell', isAvailable: true },
      { name: 'Peeled & Deveined', pricePerKg: 950, unit: 'kg', description: 'Cleaned and ready to cook', isAvailable: true }
    ],
    tags: ['fresh', 'seafood', 'omega-3'],
    rating: 4.4,
    reviewCount: 123
  },
  {
    name: 'Pork',
    category: 'pork',
    description: 'Fresh pork, cleaned and cut',
    image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=300',
    cuts: [
      { name: 'Curry Cut', pricePerKg: 380, unit: 'kg', description: 'Medium pieces with bone', isAvailable: true },
      { name: 'Boneless', pricePerKg: 450, unit: 'kg', description: 'Boneless pork pieces', isAvailable: true },
      { name: 'Minced', pricePerKg: 420, unit: 'kg', description: 'Minced pork', isAvailable: true },
      { name: 'Ribs', pricePerKg: 400, unit: 'kg', description: 'Pork ribs', isAvailable: true },
      { name: 'Chops', pricePerKg: 480, unit: 'kg', description: 'Pork chops', isAvailable: true }
    ],
    tags: ['fresh', 'premium'],
    rating: 4.2,
    reviewCount: 78
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB Connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('✅ Sample products added successfully');

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'admin@freshmeat.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@freshmeat.com',
        phone: '9999999999',
        password: 'admin123',
        role: 'admin',
        isVerified: true
      });
      console.log('✅ Admin user created (Email: admin@freshmeat.com, Password: admin123)');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
