const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Generate unique order number
const generateOrderNumber = () => {
  return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
};

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Customer)
router.post('/', protect, async (req, res) => {
console.log('===== ORDER REQUEST RECEIVED =====');
  console.log('User ID:', req.user.id);
  console.log('User Role:', req.user.role);
  console.log('Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { items, deliveryAddress, specialInstructions, paymentMethod } = req.body;

    // Calculate pricing
    let itemsTotal = 0;
    items.forEach(item => {
      itemsTotal += item.price * item.quantity;
    });

    const deliveryFee = itemsTotal > 500 ? 0 : 30;
    const platformFee = 5;
    const taxes = Math.round(itemsTotal * 0.05); // 5% tax
    const grandTotal = itemsTotal + deliveryFee + platformFee + taxes;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: req.user.id,
      items,
      deliveryAddress,
      specialInstructions,
      paymentMethod,
  shopDetails: {
    name: 'Local Meat Shop',
    address: 'Main Market',
    location: {
      type: 'Point',
      coordinates: [77.1025, 28.7041]  // Add coordinates!
    }
  },
      pricing: {
        itemsTotal,
        deliveryFee,
        platformFee,
        taxes,
        discount: 0,
        grandTotal
      },
      statusHistory: [{
        status: 'pending',
        timestamp: new Date(),
        note: 'Order placed successfully'
      }]
    });

    // Populate order details
    await order.populate('customer', 'name phone email');
    await order.populate('items.product');

    // Emit socket event for new order (notify available delivery partners)
    const io = req.app.get('io');
    io.emit('new-order', {
      orderId: order._id,
      orderNumber: order.orderNumber,
      location: deliveryAddress.location,
      itemsTotal: order.pricing.itemsTotal
    });

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('===== ORDER ERROR =====');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (filtered by user role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user.id;
    } else if (req.user.role === 'delivery_partner') {
      query.deliveryPartner = req.user.id;
    }
    // Admin can see all orders

    const orders = await Order.find(query)
      .populate('customer', 'name phone email')
      .populate('deliveryPartner', 'name phone vehicleType vehicleNumber')
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone email')
      .populate('deliveryPartner', 'name phone vehicleType vehicleNumber rating')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (req.user.role === 'delivery_partner' && 
        order.deliveryPartner && 
        order.deliveryPartner._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Delivery Partner/Admin)
router.put('/:id/status', protect, authorize('delivery_partner', 'admin'), async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    order.status = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Order status updated to ${status}`
    });

    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
      order.paymentStatus = order.paymentMethod === 'cash' ? 'paid' : order.paymentStatus;
    }

    await order.save();

    // Emit socket event for status update
    const io = req.app.get('io');
    io.to(`order-${order._id}`).emit('order-status-updated', {
      orderId: order._id,
      status: order.status,
      timestamp: new Date()
    });

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order
// @access  Private (Customer/Admin)
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if customer is cancelling their own order
    if (req.user.role === 'customer' && order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Can only cancel if not yet picked up
    if (['picked_up', 'in_transit', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order at this stage'
      });
    }

    order.status = 'cancelled';
    order.cancellationReason = reason;
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: reason
    });

    await order.save();

    // Emit socket event
    const io = req.app.get('io');
    io.to(`order-${order._id}`).emit('order-cancelled', {
      orderId: order._id
    });

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/orders/:id/rate
// @desc    Rate order
// @access  Private (Customer)
router.put('/:id/rate', protect, authorize('customer'), async (req, res) => {
  try {
    const { food, delivery, comment } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate delivered orders'
      });
    }

    order.rating = { food, delivery, comment };
    await order.save();

    // Update delivery partner rating
    if (order.deliveryPartner && delivery) {
      const partner = await User.findById(order.deliveryPartner);
      const totalRating = (partner.rating * partner.totalDeliveries + delivery) / (partner.totalDeliveries + 1);
      partner.rating = totalRating;
      await partner.save();
    }

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
