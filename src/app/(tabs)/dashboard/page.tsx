'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialNav from '@/components/Navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client'; 
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
// const StarRating = ({ rating, groupId }: { rating: number; groupId: string }) => {
//   return (
//     <div className="rating rating-xs">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <input
//           key={star}
//           type="radio"
//           name={`rating-${groupId}`}
//           className="mask mask-star-2 bg-orange-400"
//           readOnly
//           checked={star <= rating}
//           aria-label={`${star} star rating`}
//         />
//       ))}
//     </div>
//   );
// };

const supabase = await createClient(); // <-- You need to get the consumer-side client here

const handleFavorite = async (mealId: string) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to favorite a meal.');
      return;
    }

    try {
      const { error } = await supabase
          .from('favorites')
          .insert([
              { user_id: user.id, meal_id: mealId }
          ]);

      if (error) {
          if (error.code === '23505') { // This is the unique constraint error code
            alert('This meal is already in your favorites!');
          } else {
            throw new Error(error.message);
          }
        } else {
          alert('Meal added to favorites!');
        }

  } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error adding to favorites:', err.message);
      } else {
        console.error('Error adding to favorites:', err);
      }
      alert('Failed to add meal to favorites. Please try again.');
  }
};

const Dashboard = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Use useEffect to fetch data from Supabase when the component mounts
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        // Fetch data from the 'meals' table, join with 'vendors', and order by 'total_orders' descending
        const { data, error } = await vendorsSupabaseClient
          .from('meals')
          .select('*, vendors(*)')
          .order('total_orders', { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          setMeals(data as Meal[]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error fetching meals:', err.message);
        } else {
          console.error('Error fetching meals:', err);
        }
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
    <section className="p-4">
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
      
      <ul className="list rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Most ordered food this week</li>
        
        {loading ? (
          <li className="p-4 text-center text-gray-500">Loading popular meals...</li>
        ) : error ? (
          <li className="p-4 text-center text-red-500">{error}</li>
        ) : filteredMeals.length > 0 ? (
          filteredMeals.map(meal => {
            const vendor = meal.vendors;
            const hasValidImageSrc = typeof meal.photo_url === 'string' && (meal.photo_url.startsWith('http://') || meal.photo_url.startsWith('https://'));

            return (
              <li key={meal.id} className="list-row">
                <div>
                  {hasValidImageSrc ? (
                    <Image
                      className="size-10 rounded-box object-cover" 
                      src={meal.photo_url as string} 
                      alt={meal.title || 'Meal image'} 
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="size-10 rounded-box bg-gray-200 flex items-center justify-center text-gray-500">
                      ?
                    </div>
                  )}
                </div>
                <div>
                  <div>{vendor?.name || 'Unknown Vendor'}</div>
                  <div className="text-xs uppercase font-semibold opacity-60">{meal.title}</div>
                </div>
                <p className="list-col-wrap text-xs">{meal.description}</p>
                <Link href={`/dashboard/${meal.id}`} className="btn btn-square btn-ghost" aria-label="View dish details">
                  <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
                </Link>
                <button
                  className="btn btn-square btn-ghost"
                  aria-label="Add to favorites"
                  onClick={() => handleFavorite(meal.id)} // <-- Added this onClick handler
                >
                  <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg>
                </button>
              </li>
            );
          })
        ) : (
          <li className="p-4 text-center text-gray-500">No popular meals found.</li>
        )}
      </ul>
      <Footer />
    </section>
  );
};

export default Dashboard;
