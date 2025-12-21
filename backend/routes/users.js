const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/users/address
// @desc    Add new address
// @access  Private
router.post('/address', protect, async (req, res) => {
  try {
    const { label, street, city, state, pincode, landmark, longitude, latitude, isDefault } = req.body;

    const user = await User.findById(req.user.id);

    // If this is set as default, unset other defaults
    if (isDefault) {
      user.address.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.address.push({
      label,
      street,
      city,
      state,
      pincode,
      landmark,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      isDefault: isDefault || user.address.length === 0
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/users/address
// @desc    Get all addresses
// @access  Private
router.get('/address', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      addresses: user.address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/users/address/:addressId
// @desc    Update address
// @access  Private
router.put('/address/:addressId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.address.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const { label, street, city, state, pincode, landmark, longitude, latitude, isDefault } = req.body;

    if (isDefault) {
      user.address.forEach(addr => {
        addr.isDefault = false;
      });
    }

    address.label = label || address.label;
    address.street = street || address.street;
    address.city = city || address.city;
    address.state = state || address.state;
    address.pincode = pincode || address.pincode;
    address.landmark = landmark || address.landmark;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    if (longitude && latitude) {
      address.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/users/address/:addressId
// @desc    Delete address
// @access  Private
router.delete('/address/:addressId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Use pull to remove the address
    user.address.pull(req.params.addressId);
    
    // If deleted address was default and there are other addresses, make the first one default
    if (user.address.length > 0) {
      const wasDefault = user.address.some(addr => addr.isDefault);
      if (!wasDefault) {
        user.address[0].isDefault = true;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      addresses: user.address
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/users/delivery-profile
// @desc    Update delivery partner profile
// @access  Private (Delivery Partner)
router.put('/delivery-profile', protect, async (req, res) => {
  try {
    if (req.user.role !== 'delivery_partner') {
      return res.status(403).json({
        success: false,
        message: 'Only delivery partners can update delivery profile'
      });
    }

    const { vehicleType, vehicleNumber } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { vehicleType, vehicleNumber },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
