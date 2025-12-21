import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, cut, quantity) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.product._id === product._id && item.cut.name === cut.name
    );

    if (existingItemIndex > -1) {
      const newCart = [...cartItems];
      newCart[existingItemIndex].quantity += quantity;
      setCartItems(newCart);
      toast.success('Quantity updated in cart');
    } else {
      const newItem = {
        product,
        cut,
        quantity,
        price: cut.pricePerKg || cut.pricePerPiece
      };
      setCartItems([...cartItems, newItem]);
      toast.success('Item added to cart');
    }
  };

  const updateQuantity = (productId, cutName, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, cutName);
      return;
    }

    const newCart = cartItems.map(item => {
      if (item.product._id === productId && item.cut.name === cutName) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(newCart);
  };

  const removeFromCart = (productId, cutName) => {
    setCartItems(cartItems.filter(
      item => !(item.product._id === productId && item.cut.name === cutName)
    ));
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
