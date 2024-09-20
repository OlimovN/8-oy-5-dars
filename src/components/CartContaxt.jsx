import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { cartItems: [], numItemsInCart: 0, cartTotal: 0 };
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.cartItems.find(item => item.productID === product.productID);
      let updatedCartItems;
      if (existingProduct) {
        updatedCartItems = prevCart.cartItems.map(item =>
          item.productID === product.productID ? { ...item, amount: item.amount + product.amount } : item
        );
      } else {
        updatedCartItems = [...prevCart.cartItems, { ...product, cartID: `${product.productID}#${product.productColor}` }];
      }
      const cartTotal = updatedCartItems.reduce((total, item) => total + item.price * item.amount, 0);
      return { cartItems: updatedCartItems, numItemsInCart: updatedCartItems.length, cartTotal };
    });
  };

  const removeFromCart = (cartID) => {
    setCart((prevCart) => {
      const updatedCartItems = prevCart.cartItems.filter(item => item.cartID !== cartID);
      const cartTotal = updatedCartItems.reduce((total, item) => total + item.price * item.amount, 0);
      return { cartItems: updatedCartItems, numItemsInCart: updatedCartItems.length, cartTotal };
    });
  };

  const updateItemAmount = (cartID, amount) => {
    setCart((prevCart) => {
      const updatedCartItems = prevCart.cartItems.map(item =>
        item.cartID === cartID ? { ...item, amount } : item
      );
      const cartTotal = updatedCartItems.reduce((total, item) => total + item.price * item.amount, 0);
      return { cartItems: updatedCartItems, numItemsInCart: updatedCartItems.length, cartTotal };
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateItemAmount }}>
      {children}
    </CartContext.Provider>
  );
};