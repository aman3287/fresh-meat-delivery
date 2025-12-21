import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { FiShoppingBag, FiRefreshCw } from 'react-icons/fi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh every 10 seconds for real-time updates
    const interval = setInterval(() => {
      fetchOrders(true); // Silent refresh
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <button 
          className="btn-refresh" 
          onClick={handleManualRefresh}
          disabled={refreshing}
          title="Refresh orders"
        >
          <FiRefreshCw className={refreshing ? 'spinning' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <FiShoppingBag className="empty-icon" />
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <Link 
              key={order._id} 
              to={`/orders/${order._id}`} 
              className="order-card-link"
            >
              <div className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-meta">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • 
                      <span className="order-total"> ₹{order.pricing.grandTotal.toFixed(2)}</span>
                    </p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge status-${order.status}`}>
                      {order.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {order.deliveryPartner && (
                  <div className="order-delivery-info">
                    <span className="delivery-partner-name">
                      🛵 {order.deliveryPartner.name}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Auto-refresh indicator */}
      <div className="auto-refresh-info">
        <span>🔄 Auto-refreshing every 10 seconds</span>
      </div>
    </div>
  );
};

export default Orders;