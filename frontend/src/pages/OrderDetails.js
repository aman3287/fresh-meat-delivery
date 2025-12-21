import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { FiArrowLeft, FiPackage, FiMapPin, FiUser, FiPhone } from 'react-icons/fi';
import LiveTrackingMap from '../components/LiveTrackingMap';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    
    // Auto-refresh every 5 seconds for real-time status updates
    const interval = setInterval(() => {
      fetchOrder(true); // Silent refresh
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const fetchOrder = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await orderAPI.getById(id);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Order not found</h2>
          <Link to="/orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Check if order is trackable
  const isTrackable = ['assigned', 'picking_up', 'picked_up', 'in_transit'].includes(order.status);

  return (
    <div className="container">
      <div className="order-detail-header">
        <Link to="/orders" className="btn-back">
          <FiArrowLeft /> Back to Orders
        </Link>
      </div>

      <div className="order-detail-container">
        {/* Order Info Card */}
        <div className="order-detail-card">
          <div className="order-detail-header-info">
            <div>
              <h1>Order #{order.orderNumber}</h1>
              <p className="order-detail-date">
                {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span className={`status-badge-large status-${order.status}`}>
              {order.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          {/* Live Tracking Map - Show if order is in trackable state */}
          {isTrackable && (
            <div className="order-section map-section">
              <LiveTrackingMap order={order} />
            </div>
          )}

          {/* Show tracking message for other states */}
          {order.status === 'pending' || order.status === 'confirmed' ? (
            <div className="order-section">
              <div className="tracking-pending-message">
                <FiMapPin size={48} />
                <h3>Preparing Your Order</h3>
                <p>Live tracking will be available once a delivery partner is assigned.</p>
              </div>
            </div>
          ) : null}

          {order.status === 'delivered' && (
            <div className="order-section">
              <div className="tracking-completed-message">
                <div className="completion-checkmark">✓</div>
                <h3>Order Delivered Successfully!</h3>
                <p>Delivered on {new Date(order.updatedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="order-section">
            <h3 className="section-title">
              <FiPackage /> Order Items
            </h3>
            <div className="order-items-list">
              {order.items.map((item, i) => (
                <div key={i} className="order-item">
                  <div className="order-item-details">
                    <h4>{item.productName}</h4>
                    <p className="item-cut">{item.cut.name}</p>
                    <p className="item-quantity">
                      {item.quantity} {item.cut.unit} × ₹{item.price}
                    </p>
                  </div>
                  <div className="order-item-total">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="order-section">
            <h3 className="section-title">
              <FiMapPin /> Delivery Address
            </h3>
            <div className="address-info">
              <p>{order.deliveryAddress.street}</p>
              <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
              <p>Pincode: {order.deliveryAddress.pincode}</p>
              {order.deliveryAddress.landmark && (
                <p className="landmark">Landmark: {order.deliveryAddress.landmark}</p>
              )}
            </div>
          </div>

          {/* Delivery Partner Info */}
          {order.deliveryPartner && (
            <div className="order-section">
              <h3 className="section-title">
                <FiUser /> Delivery Partner
              </h3>
              <div className="delivery-partner-info">
                <div className="partner-detail">
                  <span className="partner-label">Name:</span>
                  <span className="partner-value">{order.deliveryPartner.name}</span>
                </div>
                <div className="partner-detail">
                  <FiPhone size={16} />
                  <span className="partner-value">{order.deliveryPartner.phone}</span>
                </div>
                <div className="partner-detail">
                  <span className="partner-label">Vehicle:</span>
                  <span className="partner-value">
                    {order.deliveryPartner.vehicleType} ({order.deliveryPartner.vehicleNumber})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="order-section">
            <h3 className="section-title">Payment Summary</h3>
            <div className="order-summary-detail">
              <div className="summary-row">
                <span>Items Total</span>
                <span>₹{order.pricing.itemsTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{order.pricing.deliveryFee === 0 ? 'FREE' : `₹${order.pricing.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Taxes & Fees</span>
                <span>₹{order.pricing.taxes.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Grand Total</span>
                <span>₹{order.pricing.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time update indicator */}
      <div className="realtime-indicator">
        <span className="pulse-dot"></span>
        <span>Live updates enabled</span>
      </div>
    </div>
  );
};

export default OrderDetails;