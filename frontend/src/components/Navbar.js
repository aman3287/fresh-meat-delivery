import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiTruck, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.classList.toggle('light-mode', savedTheme === 'light');
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('light-mode', newTheme === 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isDeliveryPartner = user?.role === 'delivery_partner';

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">🥩</span>
            <span>Fresh Meat</span>
          </Link>

          <ul className="navbar-menu">
            <li>
              <Link to="/products" className="navbar-link">
                Products
              </Link>
            </li>

            {isAuthenticated && (
              <>
                {isDeliveryPartner ? (
                  <li>
                    <Link to="/delivery" className="navbar-link">
                      <FiTruck size={20} /> Delivery
                    </Link>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link to="/orders" className="navbar-link">
                        My Orders
                      </Link>
                    </li>

                    <li>
                      <Link to="/checkout" className="cart-icon navbar-link">
                        <FiShoppingCart size={22} />
                        {getCartCount() > 0 && (
                          <span className="cart-badge">{getCartCount()}</span>
                        )}
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <Link to="/profile" className="navbar-link">
                    <FiUser size={20} />
                  </Link>
                </li>

                <li>
                  <button 
                    onClick={handleLogout}
                    style={{ background: 'transparent', border: '2px solid var(--primary-red)', color: 'var(--primary-red)', padding: '0.5rem 1.5rem', borderRadius: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {!isAuthenticated && (
              <>
                <li>
                  <Link to="/login" className="navbar-link">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="navbar-link">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Theme Toggle Button */}
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <FiSun /> : <FiMoon />}
      </button>
    </>
  );
};

export default Navbar;