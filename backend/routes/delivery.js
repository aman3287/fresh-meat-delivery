const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/delivery/available-orders
// @desc    Get available orders for delivery partners (within radius)
// @access  Private (Delivery Partner)
router.get('/available-orders', protect, authorize('delivery_partner'), async (req, res) => {
  try {
    const { longitude, latitude, radius = 10 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location coordinates'
      });
    }

    // Find pending orders within radius (in kilometers)
    const orders = await Order.find({
      status: 'pending',
      'deliveryAddress.location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    })
      .populate('customer', 'name phone')
      .populate('items.product')
      .limit(20);

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

// @route   POST /api/delivery/accept-order/:orderId
// @desc    Accept an order
// @access  Private (Delivery Partner)
router.post('/accept-order/:orderId', protect, authorize('delivery_partner'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order is no longer available'
      });
    }

    // Assign delivery partner
    order.deliveryPartner = req.user.id;
    order.status = 'assigned';
    order.statusHistory.push({
      status: 'assigned',
      timestamp: new Date(),
      note: 'Order assigned to delivery partner'
    });

    await order.save();

    // Update delivery partner availability
    await User.findByIdAndUpdate(req.user.id, { isAvailable: false });

    // Emit socket event
    const io = req.app.get('io');
    io.to(`order-${order._id}`).emit('order-accepted', {
      orderId: order._id,
      partnerId: req.user.id,
      partnerName: req.user.name
    });

    res.status(200).json({
      success: true,
      message: 'Order accepted successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/delivery/update-location
// @desc    Update delivery partner's current location
// @access  Private (Delivery Partner)
router.put('/update-location', protect, authorize('delivery_partner'), async (req, res) => {
  try {
    const { longitude, latitude } = req.body;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location coordinates'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        currentLocation: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        }
      },
      { new: true }
    );

    // Emit location update to active orders
    const activeOrders = await Order.find({
      deliveryPartner: req.user.id,
      status: { $in: ['assigned', 'partner_accepted', 'picking_up', 'picked_up', 'in_transit'] }
    });

    const io = req.app.get('io');
    activeOrders.forEach(order => {
      io.to(`order-${order._id}`).emit('partner-location-update', {
        orderId: order._id,
        location: { longitude, latitude }
      });
    });

    res.status(200).json({
      success: true,
      message: 'Location updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/delivery/toggle-availability
// @desc    Toggle delivery partner availability
// @access  Private (Delivery Partner)
router.put('/toggle-availability', protect, authorize('delivery_partner'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.isAvailable = !user.isAvailable;
    await user.save();

    res.status(200).json({
      success: true,
      isAvailable: user.isAvailable,
      message: `You are now ${user.isAvailable ? 'available' : 'unavailable'} for deliveries`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/delivery/earnings
// @desc    Get delivery partner earnings
// @access  Private (Delivery Partner)
router.get('/earnings', protect, authorize('delivery_partner'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = {
      deliveryPartner: req.user.id,
      status: 'delivered'
    };

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(query);

    const totalEarnings = orders.reduce((sum, order) => {
      return sum + order.pricing.deliveryFee;
    }, 0);

    const stats = {
      totalDeliveries: orders.length,
      totalEarnings,
      averageEarningsPerOrder: orders.length > 0 ? totalEarnings / orders.length : 0
    };

    res.status(200).json({
      success: true,
      stats,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
