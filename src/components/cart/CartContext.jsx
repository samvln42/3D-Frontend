import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// CartContext
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage with error handling
  const [cart, setCart] = useState(() => {
    try {
      const localCart = localStorage.getItem('cart');
      return localCart ? JSON.parse(localCart) : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });

  // Persist cart to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Memoize cart operations to prevent unnecessary re-renders
  const addToCart = useCallback((product, color, size, quantity) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(
        (item) => item.id === product.id && 
                   item.store_name === product.store_name && 
                   item.color === color && 
                   item.size === size
      );

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id && 
          item.store_name === product.store_name && 
          item.color === color && 
          item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity, color, size }];
    });
  }, []);

  const removeFromCart = useCallback((id, store_name, color, size) => {
    setCart(prevCart => 
      prevCart.filter((item) => 
        !(item.id === id && 
          item.store_name === store_name && 
          item.color === color && 
          item.size === size)
      )
    );
  }, []);

  const updateQuantity = useCallback((id, store_name, color, size, quantity) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter((item) => 
          !(item.id === id && 
            item.store_name === store_name && 
            item.color === color && 
            item.size === size)
        );
      }
      return prevCart.map((item) => 
        item.id === id && 
        item.store_name === store_name && 
        item.color === color && 
        item.size === size
          ? { ...item, quantity } 
          : item
      );
    });
  }, []);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cart]);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 0), 0);
  }, [cart]);

  const getTotalPriceForStore = useCallback((store_name) => {
    return cart
      .filter((item) => item.store_name === store_name)
      .reduce((total, item) => total + item.price * (item.quantity || 0), 0);
  }, [cart]);

  const handlePayment = useCallback((store_name) => {
    setCart(prevCart => prevCart.filter((item) => item.store_name !== store_name));
  }, []);

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      // Any cleanup needed when CartProvider unmounts
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
        handlePayment,
        getTotalPriceForStore,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
