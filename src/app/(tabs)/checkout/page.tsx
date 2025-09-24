'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialNav from '@/components/Navigation';
import { useCart } from '@/src/app/context/CartContext'; // Import the useCart hook

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart(); // Get cart data and clearCart function
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash-on-delivery');
  const [isOrdering, setIsOrdering] = useState(false); // State for loading indicator

  // Mock delivery fee
  const deliveryFee = 500;
  const total = subtotal + deliveryFee;

  // Navigate back to the cart page if the cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isOrdering) {
      router.push('/cart');
    }
  }, [cart, isOrdering, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);

    // Simulate an API call with a delay
    setTimeout(() => {
      // In a real application, you would send this to the backend.
      console.log('Order submitted with:', { deliveryAddress, paymentMethod, total });
      
      // Clear the cart after a successful checkout
      clearCart();

      // Navigate to the order successful page
      router.push('/review');
    }, 2000); // 2-second delay to simulate processing
  };

  return (
    <section className="p-4 bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <SpecialNav />

      <div className="container mx-auto p-4 flex-grow max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Delivery & Payment</h2>
            <form onSubmit={handleSubmit}>
              {/* Delivery Information */}
              <div className="mb-6">
                <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                  Delivery Location
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F36B2F] focus:border-[#F36B2F]"
                  placeholder="Enter your full delivery address"
                  required
                />
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-4">
                <label
                  htmlFor="cash-on-delivery"
                  className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-colors border-2 ${paymentMethod === 'cash-on-delivery' ? 'border-[#F36B2F] bg-orange-50' : 'border-gray-200 bg-white'}`}
                >
                  <input
                    type="radio"
                    id="cash-on-delivery"
                    name="paymentMethod"
                    value="cash-on-delivery"
                    checked={paymentMethod === 'cash-on-delivery'}
                    onChange={() => setPaymentMethod('cash-on-delivery')}
                    className="form-radio h-5 w-5 text-[#F36B2F] focus:ring-[#F36B2F]"
                  />
                  <span className="text-lg text-gray-700 font-medium">Cash on Delivery</span>
                </label>
                <label
                  htmlFor="bank-transfer"
                  className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-colors border-2 ${paymentMethod === 'bank-transfer' ? 'border-[#F36B2F] bg-orange-50' : 'border-gray-200 bg-white'}`}
                >
                  <input
                    type="radio"
                    id="bank-transfer"
                    name="paymentMethod"
                    value="bank-transfer"
                    checked={paymentMethod === 'bank-transfer'}
                    onChange={() => setPaymentMethod('bank-transfer')}
                    className="form-radio h-5 w-5 text-[#F36B2F] focus:ring-[#F36B2F]"
                  />
                  <span className="text-lg text-gray-700 font-medium">Bank Transfer</span>
                </label>
                <label
                  htmlFor="card"
                  className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-colors border-2 ${paymentMethod === 'card' ? 'border-[#F36B2F] bg-orange-50' : 'border-gray-200 bg-white'}`}
                >
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="form-radio h-5 w-5 text-[#F36B2F] focus:ring-[#F36B2F]"
                  />
                  <span className="text-lg text-gray-700 font-medium">Card Payment</span>
                </label>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isOrdering}
                  className="bg-gray-300 text-gray-800 py-3 px-6 rounded-md font-semibold transition-colors hover:bg-gray-400 disabled:opacity-50"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  disabled={isOrdering}
                  className="bg-[#F36B2F] text-white py-3 px-6 rounded-md font-semibold transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-[#F36B2F] focus:ring-opacity-50 disabled:opacity-50"
                >
                  {isOrdering ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-lg shadow-md h-fit">
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
          </div>
        </div>
      </div>
      
      <Footer />
    </section>
  );
}

