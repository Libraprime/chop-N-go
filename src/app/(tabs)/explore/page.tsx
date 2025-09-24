'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialNav from '@/components/Navigation';
import Link from 'next/link';
// Corrected the import path to the client-side Supabase client
import { vendorsSupabaseClient } from '@/utils/supabase/vendorsSupabaseClient';

// Define the structure of the vendor data from the 'vendors' table
interface Vendor {
  id: string;
  name: string;
  logo_url: string;
  rating: number;
}

// Define the structure of the meal data fetched from Supabase, including the nested vendor data
interface Meal {
  id: string;
  vendor_id: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  is_available: boolean;
  tags: string[] | null;
  price: number;
  category: string | null;
  total_orders: number;
  vendors: Vendor | null; // This will hold the joined vendor data
}

// Reusable StarRating component with a unique group identifier
const StarRating = ({ rating, groupId }: { rating: number; groupId: string }) => {
  return (
    <div className="rating rating-xs">
      {[1, 2, 3, 4, 5].map((star) => (
        <input
          key={star}
          type="radio"
          // The name attribute is now unique for each group of stars
          name={`rating-${groupId}`}
          className="mask mask-star-2 bg-orange-400"
          readOnly
          checked={star <= rating}
          aria-label={`${star} star rating`}
        />
      ))}
    </div>
  );
};

export default function Explore() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Use useEffect to fetch data from Supabase when the component mounts
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        // Fetch data from the 'meals' table and join with the 'vendors' table
        const { data, error } = await vendorsSupabaseClient
          .from('meals')
          .select('*, vendors(*)')
          .order('title', { ascending: true }); // Order meals alphabetically by title

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          setMeals(data as Meal[]);
        }
      } catch (err: any) {
        console.error('Error fetching meals:', err.message);
        setError('Failed to fetch meals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  // Filter the meals based on the search term
  const filteredMeals = meals.filter(meal =>
    meal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <main className="p-4">
      <Header />

      <SpecialNav />

      <label htmlFor="search" className="sr-only">Search meals</label>
      <input
        type="search"
        name="search"
        id="search"
        className="m-5 mx-10 p-2 border border-gray-300 rounded"
        placeholder="Search meals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className='flex flex-wrap justify-around gap-y-10 m-5'>
        {loading ? (
          <p className="text-gray-500 text-lg mt-10">Loading meals...</p>
        ) : error ? (
          <p className="text-red-500 text-lg mt-10">{error}</p>
        ) : filteredMeals.length > 0 ? (
          filteredMeals.map(meal => {
            // Check if the vendor data exists before rendering
            const vendor = meal.vendors;

            // Check for valid absolute URLs
            const hasValidImageSrc = typeof meal.photo_url === 'string' && (meal.photo_url.startsWith('http://') || meal.photo_url.startsWith('https://'));
            const hasValidLogo = vendor && typeof vendor.logo_url === 'string' && (vendor.logo_url.startsWith('http://') || vendor.logo_url.startsWith('https://'));

            return (
              <div key={meal.id} className="card w-96 shadow-sm">
                <figure>
                  {/* Updated conditional rendering to prevent invalid URL error */}
                  {hasValidImageSrc ? (
                    <Image
                      className='h-96 object-cover'
                      src={meal.photo_url as string}
                      alt={meal.title || 'Meal image'}
                      width={384}
                      height={384}
                    />
                  ) : (
                    <div className="h-96 w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </figure>
                <div className="card-body">
                  <div className="flex items-center justify-between text-end mb-2">
                    {hasValidLogo ? (
                      <Image
                        src={vendor.logo_url}
                        alt={`${vendor.name} logo`}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm text-gray-500">?</span>
                      </div>
                    )}
                    <p className="font-bold text-lg text-gray-700">{vendor?.name || 'Unknown Vendor'}</p>
                  </div>
                  <h2 className="card-title">{meal.title}</h2>
                  <StarRating rating={vendor?.rating || 0} groupId={meal.id} />
                  <p>{meal.description}</p>
                  <div className="card-actions justify-between items-center">
                    <p className='font-bold text-lg p-2 text-[#F36B2F]'>₦{meal.price}</p>
                    <Link href={`/explore/${meal.id}`} className="btn bg-[#F36B2F] text-white">
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 text-lg mt-10">No meals found matching your search.</p>
        )}
      </div>
      <Footer />
    </main>
  );
}
