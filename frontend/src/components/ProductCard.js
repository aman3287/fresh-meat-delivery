import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCut, setSelectedCut] = useState(product.cuts[0]);
  const [quantity, setQuantity] = useState(0.5);
  const { addToCart } = useCart();
  const { isAuthenticated, isDeliveryPartner } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product, selectedCut, quantity);
    setShowModal(false);
  };

  return (
    <>
      <div className="product-card" onClick={() => setShowModal(true)}>
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <span className="product-category">{product.category}</span>
          <p className="product-description">{product.description}</p>
          <div className="product-price">
            Starting from ₹{product.cuts[0]?.pricePerKg || product.cuts[0]?.pricePerPiece}/{product.cuts[0]?.unit}
          </div>
          <div className="product-tags">
            {product.tags?.map((tag, i) => (
              <span key={i} className="tag">{tag}</span>
            ))}
          </div>
          {!isDeliveryPartner && (
            <button className="btn btn-primary btn-block" onClick={(e) => { e.stopPropagation(); setShowModal(true); }}>
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{product.name}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem' }} />
            
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>{product.description}</p>

            <div className="form-group">
              <label className="form-label">Select Cut</label>
              <select 
                className="form-select" 
                value={selectedCut.name}
                onChange={(e) => setSelectedCut(product.cuts.find(c => c.name === e.target.value))}
              >
                {product.cuts.map((cut) => (
                  <option key={cut.name} value={cut.name}>
                    {cut.name} - ₹{cut.pricePerKg || cut.pricePerPiece}/{cut.unit}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity ({selectedCut.unit})</label>
              <input
                type="number"
                className="form-control"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                min="0.25"
                step={selectedCut.unit === 'kg' ? '0.25' : '1'}
              />
            </div>

            <div style={{ 
              background: 'var(--light)', 
              padding: '1rem', 
              borderRadius: '5px', 
              marginBottom: '1rem' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <span>Total:</span>
                <span>₹{((selectedCut.pricePerKg || selectedCut.pricePerPiece) * quantity).toFixed(2)}</span>
              </div>
            </div>

            {!isDeliveryPartner && (
              <button className="btn btn-primary btn-block" onClick={handleAddToCart}>
                Add to Cart
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
