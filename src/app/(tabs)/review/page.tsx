'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialNav from '@/components/Navigation';

export default function CombinedOrderAndReviewPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate an API call to submit the review with a delay
    setTimeout(() => {
      console.log('Feedback submitted:', { rating, feedback });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000); // 2-second delay to simulate network latency
  };

  return (
    <section className="p-4 bg-gray-100 min-h-screen flex flex-col">
      <Header />
      <SpecialNav />

      <div className="container mx-auto p-4 max-w-xl text-center flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full">
          {!isSubmitted ? (
            // Order Confirmation and Review Form View
            <div>
              <h1 className="text-3xl font-bold text-gray-800 my-4">Thank You for Your Order!</h1>
              <p className="text-gray-600 mb-6">
                Your order has been successfully placed. Please take a moment to leave us a review.
              </p>
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Leave Us a Review</h2>
                
                {/* Star Rating Component */}
                <div className="flex justify-center space-x-2 mb-6">
                  {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                      <svg
                        key={index}
                        onClick={() => setRating(starValue)}
                        className={`w-10 h-10 cursor-pointer transition-colors ${
                          starValue <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.161c.969 0 1.371 1.24.588 1.81l-3.374 2.454a1 1 00-.364 1.118l1.287 3.96a1 1 01-.763 1.09l-3.374-2.454a1 1 00-1.175 0l-3.374 2.454a1 1 01-.763-1.09l1.287-3.96a1 1 00-.364-1.118L2.973 9.387c-.783-.57-.381-1.81.588-1.81h4.161a1 1 00.95-.69l1.286-3.96z" />
                      </svg>
                    );
                  })}
                </div>

                {/* Feedback Text Area */}
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F36B2F] focus:border-[#F36B2F]"
                  placeholder="Tell us what you think..."
                  disabled={isSubmitting}
                ></textarea>

                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0}
                  className="w-full mt-6 bg-[#F36B2F] text-white py-3 px-6 rounded-md font-semibold transition-colors hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          ) : (
            // Feedback Submitted View
            <div>
              <h1 className="text-4xl font-bold text-green-600 mb-4">Feedback Submitted!</h1>
              <p className="text-gray-700 text-lg mb-6">
                Thank you for taking the time to share your feedback.
              </p>
              <button
                onClick={() => router.push('/explore')}
                className="bg-[#F36B2F] text-white py-3 px-6 rounded-md font-semibold transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-[#F36B2F] focus:ring-opacity-50"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </section>
  );
}
