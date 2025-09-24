'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure of a cart item
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  photo_url: string | null;
}

// Define the shape of the context state and functions
interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (mealId: string) => void;
  updateQuantity: (mealId: string, quantity: number) => void;
  clearCart: () => void;
}

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined);

// Define the props for the provider component
interface CartProviderProps {
  children: ReactNode;
}

// The provider component that will hold the state and functions
export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Function to add a meal to the cart with a specific quantity
  const addToCart = (itemToAdd: { id: string; title: string; price: number; quantity: number; photo_url: string | null }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemToAdd.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === itemToAdd.id ? { ...item, quantity: item.quantity + itemToAdd.quantity } : item
        );
      } else {
        return [...prevCart, itemToAdd];
      }
    });
  };

  // Function to remove an item from the cart
  const removeFromCart = (mealId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== mealId));
  };

  // Function to update the quantity of an item
  const updateQuantity = (mealId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === mealId ? { ...item, quantity: quantity } : item
      )
    );
  };
  
  // Function to clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total items and subtotal
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // The value provided to the context
  const value = {
    cart,
    totalItems,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
