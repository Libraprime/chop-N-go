'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialNav from '@/components/Navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client'; 
import { vendorsSupabaseClient } from '@/utils/supabase/vendorsSupabaseClient';

interface Vendor {
  id: string;
  name: string;
  logo_url: string;
  rating: number;
}

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
  vendors: Vendor | null;
}

const supabase = createClient();

const Dashboard = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set()); // store favorited meal IDs

  // Fetch meals
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const { data, error } = await vendorsSupabaseClient
          .from('meals')
          .select('*, vendors(*)')
          .order('total_orders', { ascending: false });

        if (error) throw new Error(error.message);
        if (data) setMeals(data as Meal[]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch meals.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  // Fetch user favorites once
  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('favorites')
        .select('meal_id')
        .eq('user_id', user.id);

      if (!error && data) {
        setFavorites(new Set(data.map(fav => fav.meal_id)));
      }
    };

    fetchFavorites();
  }, []);

  // Toggle favorite
  const handleFavorite = async (mealId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to favorite a meal.');
      return;
    }

    try {
      if (favorites.has(mealId)) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('meal_id', mealId);

        if (error) throw new Error(error.message);

        setFavorites(prev => {
          const updated = new Set(prev);
          updated.delete(mealId);
          return updated;
        });

        alert('Meal removed from favorites.');
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .upsert(
            { user_id: user.id, meal_id: mealId },
            { onConflict: 'user_id,meal_id' }
          );

        if (error) throw new Error(error.message);

        setFavorites(prev => new Set(prev).add(mealId));
        alert('Meal added to favorites!');
      }
    } catch (err: unknown) {
      console.error('Favorite toggle error:', err);
      alert('Failed to update favorites. Please try again.');
    }
  };

  // Filter meals
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
        id="search"
        className="m-5 mx-10 p-2 border border-gray-300 rounded"
        placeholder="Search meals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="list rounded-box shadow-md">
        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
          Most ordered food this week
        </li>

        {loading ? (
          <li className="p-4 text-center text-gray-500">Loading popular meals...</li>
        ) : error ? (
          <li className="p-4 text-center text-red-500">{error}</li>
        ) : filteredMeals.length > 0 ? (
          filteredMeals.map(meal => {
            const vendor = meal.vendors;
            const hasValidImageSrc = meal.photo_url?.startsWith('http');

            const isFavorited = favorites.has(meal.id);

            return (
              <li key={meal.id} className="list-row">
                <div>
                  {hasValidImageSrc ? (
                    <Image
                      className="size-10 rounded-box object-cover" 
                      src={meal.photo_url!} 
                      alt={`${meal.title} from ${vendor?.name ?? 'Unknown Vendor'}`} 
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
                  aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                  onClick={() => handleFavorite(meal.id)}
                >
                  {isFavorited ? (
                    // Filled heart
                    <svg className="size-[1.2em] text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5A5.5 5.5 0 0 1 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3A5.5 5.5 0 0 1 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  ) : (
                    // Outline heart
                    <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                  )}
                </button>
              </li>
            );
          })
        ) : (
          <li className="p-4 text-center text-gray-500">
            {searchTerm ? 'No meals match your search.' : 'No popular meals available.'}
          </li>
        )}
      </ul>
      <Footer />
    </section>
  );
};

export default Dashboard;
