'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialNav from '@/components/Navigation';
import { useCart } from '@/src/app/context/CartContext'; // Correctly import the useCart hook from the context folder

export default function CartPage() {
  const router = useRouter();
  // Use the useCart hook to get the cart data and functions
  const { cart, removeFromCart, subtotal, addToCart } = useCart();
  const deliveryFee = 500; // Mock delivery fee
  const total = subtotal + deliveryFee;

  
  return (
    <section className="p-4">
      <Header />
      <SpecialNav />
      
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Your Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 text-xl">Your cart is empty.</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.photo_url || 'https://placehold.co/96x96/E5E7EB/4B5563?text=No+Image'}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <p className="text-gray-600">Price: ₦{item.price}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-sm btn-square btn-error text-white"
                    aria-label={`Remove ${item.title}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₦{deliveryFee}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>₦{total}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')} // Add this line
                className="btn w-full bg-[#F36B2F] text-white mt-6 hover:bg-orange-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <button className='btn bg-[#F36B2F] text-white hover:bg-orange-600 justify-center flex m-5' onClick={router.back}>Go back</button>

      <Footer />
    </section>
  );
}
