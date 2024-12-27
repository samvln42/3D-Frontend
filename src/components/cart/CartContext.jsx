import React, { createContext, useContext, useState, useEffect } from 'react';

// CartContext
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const localCart = localStorage.getItem('cart');
    return localCart ? JSON.parse(localCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, color, size, quantity) => {
    const existingProduct = cart.find(
      (item) => item.id === product.id && item.store_name === product.store_name && item.color === color && item.size === size
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.store_name === product.store_name && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity, color, size }]);
    }
  };

  const removeFromCart = (id, store_name, color, size) => {
    setCart(cart.filter((item) => !(item.id === id && item.store_name === store_name && item.color === color && item.size === size)));
  };

  const updateQuantity = (id, store_name, color, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id, store_name, color, size);
    } else {
      setCart(
        cart.map((item) => 
          item.id === id && item.store_name === store_name && item.color === color && item.size === size
            ? { ...item, quantity } 
            : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 0), 0);
  };

  const handlePayment = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    alert(`Payment for ${store_name} completed successfully!\nTotal Price: $${getTotalPriceForStore(store_name).toFixed(2)}`);
    setCart(cart.filter((item) => item.store_name !== store_name));
  };

  const getTotalPriceForStore = (store_name) => {
    const storeItems = cart.filter((item) => item.store_name === store_name);
    return storeItems.reduce((total, item) => total + item.price * (item.quantity || 0), 0);
  };

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
