import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      const response = await productAPI.getAll({ isPopular: true });
      setPopularProducts(response.data.products.slice(0, 4));
    } catch (error) {
      console.error('Error fetching popular products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Chicken', icon: '🐔', path: '/products?category=chicken', desc: 'Fresh & Farm-raised' },
    { name: 'Mutton', icon: '🐑', path: '/products?category=mutton', desc: 'Premium Cuts' },
    { name: 'Fish', icon: '🐟', path: '/products?category=fish', desc: 'Ocean Fresh' },
    { name: 'Eggs', icon: '🥚', path: '/products?category=eggs', desc: 'Farm Fresh' },
    { name: 'Seafood', icon: '🦐', path: '/products?category=seafood', desc: 'Premium Quality' },
    { name: 'Pork', icon: '🐖', path: '/products?category=pork', desc: 'Finest Selection' }
  ];

  return (
    <>
      {/* Hero Section with Animated Title and Walking Chicken */}
      <section className="hero">
        {/* Decorative Floating Icons */}
        <div className="hero-decorations">
          <div className="floating-icon">🥩</div>
          <div className="floating-icon">🍗</div>
          <div className="floating-icon">🦐</div>
          <div className="floating-icon">🍖</div>
        </div>

        <div className="hero-content">
          <h1>
            <span className="gradient-text">Fresh Meat</span>
            <br />
            <span className="gradient-text">Delivered to Your Doorstep</span>
            {/* Walking Chicken */}
            <span className="walking-chicken">🐓</span>
          </h1>
          <p>Premium quality chicken, mutton, fish, and more. Order now and get it delivered fresh!</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary">
              🛒 Order Now
            </Link>
            <Link to="/products" className="btn btn-secondary">
              🍖 Browse Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2 className="section-title">Browse by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="category-card"
              style={{ textDecoration: 'none' }}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Products */}
      <section className="products-section">
        <h2 className="section-title">Popular Products</h2>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <div className="products-grid">
            {popularProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/products" className="btn btn-primary">
            View All Products →
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
