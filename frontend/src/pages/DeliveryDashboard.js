import React, { useState, useEffect } from 'react';
import { deliveryAPI, orderAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiRefreshCw } from 'react-icons/fi';

const DeliveryDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh every 5 seconds for real-time order updates
    const interval = setInterval(() => {
      fetchOrders(true); // Silent refresh
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const [available, mine] = await Promise.all([
        deliveryAPI.getAvailableOrders({ longitude: 77.1025, latitude: 28.7041, radius: 10 }),
        orderAPI.getAll()
      ]);
      setAvailableOrders(available.data.orders || []);
      setMyOrders(mine.data.orders || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      if (!silent) setRefreshing(false);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      await deliveryAPI.acceptOrder(orderId);
      toast.success('Order accepted!');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to accept order');
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      toast.success('Status updated!');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusButton = (order) => {
    const statusFlow = {
      'assigned': { next: 'picking_up', label: 'Start Pickup', icon: <FiTruck /> },
      'picking_up': { next: 'picked_up', label: 'Mark Picked Up', icon: <FiCheckCircle /> },
      'picked_up': { next: 'in_transit', label: 'Start Delivery', icon: <FiTruck /> },
      'in_transit': { next: 'delivered', label: 'Mark Delivered', icon: <FiCheckCircle /> }
    };

    const action = statusFlow[order.status];
    if (!action) return null;

    return (
      <button 
        className="btn btn-primary btn-status-update"
        onClick={() => handleStatusUpdate(order._id, action.next)}
      >
        {action.icon}
        {action.label}
      </button>
    );
  };

  return (
    <div className="container">
      <div className="delivery-dashboard-header">
        <h1>Delivery Dashboard</h1>
        <button 
          className="btn-refresh" 
          onClick={() => fetchOrders(false)}
          disabled={refreshing}
        >
          <FiRefreshCw className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Available Orders Section */}
      <div className="dashboard-section">
        <div className="section-header-delivery">
          <h2>
            <FiClock /> Available Orders 
            <span className="count-badge">{availableOrders.length}</span>
          </h2>
        </div>
        
        {availableOrders.length === 0 ? (
          <div className="empty-section">
            <FiPackage className="empty-icon-small" />
            <p>No available orders at the moment</p>
          </div>
        ) : (
          <div className="delivery-orders-grid">
            {availableOrders.map((order) => (
              <div key={order._id} className="delivery-order-card">
                <div className="delivery-order-header">
                  <h3>Order #{order.orderNumber}</h3>
                  <span className="order-amount">₹{order.pricing.grandTotal.toFixed(2)}</span>
                </div>
                
                <div className="delivery-order-details">
                  <p className="order-items">
                    <FiPackage size={16} />
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                  <p className="order-location">
                    📍 {order.deliveryAddress.city}, {order.deliveryAddress.state}
                  </p>
                  <p className="order-time">
                    <FiClock size={16} />
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>

                <button 
                  className="btn btn-primary btn-accept"
                  onClick={() => handleAccept(order._id)}
                >
                  Accept Order
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Active Orders Section */}
      <div className="dashboard-section">
        <div className="section-header-delivery">
          <h2>
            <FiTruck /> My Active Orders
            <span className="count-badge">{myOrders.length}</span>
          </h2>
        </div>
        
        {myOrders.length === 0 ? (
          <div className="empty-section">
            <FiTruck className="empty-icon-small" />
            <p>No active deliveries</p>
          </div>
        ) : (
          <div className="delivery-orders-grid">
            {myOrders.map((order) => (
              <div key={order._id} className="delivery-order-card active">
                <div className="delivery-order-header">
                  <h3>Order #{order.orderNumber}</h3>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="delivery-order-details">
                  <p className="order-items">
                    <FiPackage size={16} />
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                  <p className="order-amount-large">
                    ₹{order.pricing.grandTotal.toFixed(2)}
                  </p>
                  <p className="order-location">
                    📍 {order.deliveryAddress.street}
                  </p>
                  <p className="order-location">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                  </p>
                </div>

                {getStatusButton(order)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real-time update indicator */}
      <div className="realtime-indicator">
        <span className="pulse-dot"></span>
        <span>Auto-refreshing every 5 seconds</span>
      </div>
    </div>
  );
};

export default DeliveryDashboard;