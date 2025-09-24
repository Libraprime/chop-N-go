'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/app/context/CartContext';
import QuantitySelector from '@/components/QuantitySelector';
import StarRating from '@/components/StarRating';
import { Meal } from './page';

interface OrderDetailsClientComponentProps {
  meal: Meal;
}

export default function OrderDetailsClientComponent({ meal }: OrderDetailsClientComponentProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddToCart = () => {
    setIsProcessing(true);
    addToCart({ ...meal, quantity });
    toast.success(`${quantity} x ${meal.title} added to cart!`);
    setIsProcessing(false);
  };

  const handlePurchase = () => {
    setIsProcessing(true);
    addToCart({ ...meal, quantity });
    toast.success(`Redirecting to checkout with ${quantity} x ${meal.title}...`);
    setIsProcessing(false);
    router.push('/cart');
  };

  return (
    <div className="flex-1">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">Description</h2>
      <p className="text-gray-700 mb-4">{meal.description}</p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xl font-bold text-[#F36B2F]">₦{meal.price.toFixed(2)}</span>
        <div className="ml-4">
          <StarRating rating={meal.vendors?.rating || 0} groupId={meal.id} />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">How to Order</h3>
        <p>
          You can add this meal to your cart or purchase directly. To place your order, click the &apos;purchase this item&apos; button below. You will be redirected to the checkout page where you can provide your delivery details and payment information.
        </p>

        <div className='my-16 align-middle flex items-center'>
            <p className='mr-5'>Quantity</p>
            <div>
                <QuantitySelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                    disabled={isProcessing}
                />
            </div>
        </div>

        <div className='flex justify-between mt-10'>
            <button
              onClick={handleAddToCart}
              className="btn bg-[#F36B2F] text-white hover:bg-orange-600"
              disabled={isProcessing}
            >
              {isProcessing ? 'Adding...' : 'Add to Cart'}
            </button>

            <button
              onClick={handlePurchase}
              className="btn bg-[#F36B2F] text-white hover:bg-orange-600"
              disabled={isProcessing}
            >
              Purchase this item
            </button>
        </div>
      </div>
    </div>
  );
}
