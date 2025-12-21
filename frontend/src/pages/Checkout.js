import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiAlertCircle } from 'react-icons/fi';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ 
    street: '', 
    city: '', 
    state: '', 
    pincode: '', 
    landmark: '' 
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [removingItem, setRemovingItem] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const itemsTotal = getCartTotal();
  const deliveryFee = itemsTotal > 500 ? 0 : 30;
  const platformFee = 5;
  const taxes = Math.round(itemsTotal * 0.05);
  const grandTotal = itemsTotal + deliveryFee + platformFee + taxes;

  // Handle item removal with animation
  const handleRemoveItem = (productId, cutName, index) => {
    setRemovingItem(index);
    setTimeout(() => {
      removeFromCart(productId, cutName);
      setRemovingItem(null);
    }, 300);
  };

  // Handle quantity increase
  const handleIncreaseQuantity = (item) => {
    const newQuantity = item.quantity + (item.cut.unit === 'kg' ? 0.5 : 1);
    updateQuantity(item.product._id, item.cut.name, newQuantity);
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (item) => {
    const decrementAmount = item.cut.unit === 'kg' ? 0.5 : 1;
    const newQuantity = item.quantity - decrementAmount;
    
    if (newQuantity <= 0) {
      const itemIndex = cartItems.findIndex(
        cartItem => cartItem.product._id === item.product._id && cartItem.cut.name === item.cut.name
      );
      handleRemoveItem(item.product._id, item.cut.name, itemIndex);
    } else {
      updateQuantity(item.product._id, item.cut.name, newQuantity);
    }
  };

  // Handle clear entire cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      clearCart();
      toast.info('Cart cleared');
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.pincode) {
      toast.error('Please fill in all address fields');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          productName: item.product.name,
          category: item.product.category,
          cut: item.cut,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: {
          ...address,
          location: { type: 'Point', coordinates: [77.1025, 28.7041] }
        },
        specialInstructions,
        paymentMethod
      };

      const response = await orderAPI.create(orderData);
      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/orders/${response.data.order._id}`);
      }
    } catch (error) {
      console.error('Order error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <div className="empty-cart-content">
          <FiShoppingBag className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Add some delicious items to get started!</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <button className="btn-clear-cart" onClick={handleClearCart}>
          <FiTrash2 /> Clear Cart
        </button>
      </div>

      <div className="checkout-grid">
        {/* Left Side - Cart Items and Address */}
        <div className="checkout-left">
          {/* Cart Items Section */}
          <div className="checkout-section">
            <div className="section-header">
              <h3>Cart Items ({cartItems.length})</h3>
            </div>
            
            <div className="cart-items-list">
              {cartItems.map((item, index) => (
                <div 
                  key={`${item.product._id}-${item.cut.name}`}
                  className={`cart-item-enhanced ${removingItem === index ? 'removing' : ''}`}
                >
                  {/* Product Image */}
                  <div className="cart-item-image">
                    <img 
                      src={item.product.image || 'https://via.placeholder.com/100'} 
                      alt={item.product.name}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="cart-item-details">
                    <h4>{item.product.name}</h4>
                    <p className="cart-item-cut">{item.cut.name}</p>
                    <p className="cart-item-price">₹{item.price} per {item.cut.unit}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleDecreaseQuantity(item)}
                    >
                      <FiMinus />
                    </button>
                    <span className="quantity-display">
                      {item.quantity} {item.cut.unit}
                    </span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleIncreaseQuantity(item)}
                    >
                      <FiPlus />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="cart-item-total">
                    <span className="item-total-price">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button 
                    className="cart-item-remove"
                    onClick={() => handleRemoveItem(item.product._id, item.cut.name, index)}
                    title="Remove item"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className="checkout-section">
            <div className="section-header">
              <h3>Delivery Address</h3>
            </div>
            
            <div className="address-form">
              <div className="form-group">
                <label>Street Address *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="House no., Building name, Street" 
                  value={address.street} 
                  onChange={(e) => setAddress({...address, street: e.target.value})} 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="City" 
                    value={address.city} 
                    onChange={(e) => setAddress({...address, city: e.target.value})} 
                  />
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="State" 
                    value={address.state} 
                    onChange={(e) => setAddress({...address, state: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pincode *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Pincode" 
                    value={address.pincode} 
                    onChange={(e) => setAddress({...address, pincode: e.target.value})} 
                    maxLength="6"
                  />
                </div>

                <div className="form-group">
                  <label>Landmark (Optional)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nearby landmark" 
                    value={address.landmark} 
                    onChange={(e) => setAddress({...address, landmark: e.target.value})} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Special Instructions (Optional)</label>
                <textarea 
                  className="form-control" 
                  placeholder="Any special delivery instructions..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="checkout-right">
          <div className="cart-summary-enhanced">
            <h3>Order Summary</h3>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Items Total ({cartItems.length} items)</span>
                <span>₹{itemsTotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'free-delivery' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              
              {deliveryFee === 0 && (
                <div className="delivery-info">
                  <FiAlertCircle />
                  <span>Free delivery on orders above ₹500</span>
                </div>
              )}
              
              {deliveryFee > 0 && (
                <div className="delivery-info warning">
                  <FiAlertCircle />
                  <span>Add ₹{(500 - itemsTotal).toFixed(2)} more for free delivery</span>
                </div>
              )}
              
              <div className="summary-row">
                <span>Platform Fee</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Taxes (5%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Grand Total</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="payment-method-section">
              <label>Payment Method</label>
              <select 
                className="form-control" 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash">Cash on Delivery</option>
                <option value="online">Online Payment</option>
              </select>
            </div>

            {/* Place Order Button */}
            <button 
              className="btn btn-primary btn-block"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                <>Place Order</>
              )}
            </button>

            {/* Security Info */}
            <div className="security-info">
              <p>🔒 Your payment information is secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;