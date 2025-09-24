'use client';

import React, { useState } from 'react';
// Import the toast library
import toast from 'react-hot-toast'; 
import { useCart } from '../../../context/CartContext';
import { Meal } from './page';

interface AddToCartSectionProps {
  meal: Meal;
}

export default function AddToCartSection({ meal }: AddToCartSectionProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Reusable StarRating component with a unique group identifier
  const StarRating = ({ rating, groupId }: { rating: number; groupId: string }) => {
    const roundedRating = Math.round(rating);
    return (
      <div className="rating rating-xs">
        {[1, 2, 3, 4, 5].map((star) => (
          <input
            key={star}
            type="radio"
            name={`rating-${groupId}`}
            className="mask mask-star-2 bg-orange-400"
            readOnly
            checked={star <= roundedRating}
            aria-label={`${star} star rating`}
          />
        ))}
      </div>
    );
  };

  const handleAddToCart = () => {
    // Add the meal to the cart with the selected quantity
    addToCart({
      id: meal.id,
      title: meal.title,
      price: meal.price,
      quantity: quantity,
      photo_url: meal.photo_url,
    });
    // Add a toast notification for visual feedback
    toast.success(`${quantity} x ${meal.title} added to cart!`);
  };

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-semibold mb-2">Description</h2>
      <p className="text-gray-700 mb-4">{meal.description}</p>
      <div className="flex justify-between my-10">
        <div className="">
          <p className="text-amber-700">Price</p>
          <span className="text-xl font-bold text-[#F36B2F]">₦{meal.price}</span>
        </div>
        
        <div className="ml-4">
          <p className="text-amber-700">Rating</p>
          <StarRating rating={meal.vendors?.rating || 0} groupId={meal.id} />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">How to Order</h3>
        <p>
          You can add this meal to your cart or purchase directly. To place your order, click the 'purchase this item' button below. You will be redirected to the checkout page where you can provide your delivery details and payment information.
        </p>
        <div className='flex justify-between mt-10'>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="btn btn-sm btn-square"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              className="w-16 text-center border rounded-md p-1"
              min="1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="btn btn-sm btn-square"
            >
              +
            </button>
          </div>
          <button onClick={handleAddToCart} className="btn bg-[#F36B2F] text-white">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
