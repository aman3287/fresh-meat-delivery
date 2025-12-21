const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['chicken', 'mutton', 'fish', 'pork', 'eggs', 'seafood']
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Product+Image'
  },
  cuts: [{
    name: {
      type: String,
      required: true
    }, // e.g., "Breast", "Wings", "Thighs", "Whole", "Curry Cut", "Boneless"
    pricePerKg: {
      type: Number,
      required: true
    },
    pricePerPiece: Number, // For eggs and some items
    unit: {
      type: String,
      enum: ['kg', 'piece', 'dozen'],
      default: 'kg'
    },
    description: String,
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  isPopular: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number, // in minutes
    default: 30
  },
  tags: [String], // ['halal', 'fresh', 'farm-raised', 'antibiotic-free']
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
