'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useCart } from '@/src/app/context/CartContext';

// Define the shape of the data needed for the cart
interface CartItem {
  id: string;
  title: string;
  price: number;
  photo_url: string | null;
}

// Define the props for the button component
interface AddToCartButtonProps {
  item: CartItem;
  quantity: number;
}

export default function AddToCartButton({ item, quantity }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    // Add the meal to the cart with the selected quantity
    addToCart({ ...item, quantity });
    // Show a toast notification for visual feedback
    toast.success(`${quantity} x ${item.title} added to cart!`);
    setIsAdding(false);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="btn bg-[#F36B2F] text-white hover:bg-orange-600"
      disabled={isAdding}
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
