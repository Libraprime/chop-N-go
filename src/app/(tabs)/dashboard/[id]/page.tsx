// This is a Server Component, so no 'use client'
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialNav from '@/components/Navigation';
import { notFound } from 'next/navigation';
// Importing the server-side Supabase client
import { vendorsSupabaseClient } from '@/utils/supabase/vendorsSupabaseClient';
// Import the Client Component to handle interactivity
import AddToCartSection from './AddToCart';

// Define the structure of the vendor data from the 'vendors' table
export interface Vendor {
  id: string;
  name: string;
  logo_url: string;
  rating: number;
}

// Define the structure of the meal data fetched from Supabase, including the nested vendor data
export interface Meal {
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

export default async function DishDetailsPage({ params }: { params: { id: string } }) {
  // Fetch data for a single meal from Supabase using the ID from the URL
  const { data: meal, error } = await vendorsSupabaseClient
    .from('meals')
    .select('*, vendors(*)')
    .eq('id', params.id)
    .single();

  // If there's an error or no data, show the not found page
  if (error || !meal) {
    console.error('Error fetching meal:', error?.message);
    notFound();
  }

  const vendor = meal.vendors;

  // Validate image URLs to prevent errors
  const hasValidImageSrc = typeof meal.photo_url === 'string' && (meal.photo_url.startsWith('http://') || meal.photo_url.startsWith('https://'));
  const hasValidLogo = vendor && typeof vendor.logo_url === 'string' && (vendor.logo_url.startsWith('http://') || vendor.logo_url.startsWith('https://'));

  return (
    <section className="p-4">
      <Header />
      <SpecialNav />
      
      <div className="container mx-auto p-4">
        <div className='flex justify-between'>
          {hasValidLogo ? (
            <Image src={vendor.logo_url} alt={vendor.name || 'Vendor logo'} width={50} height={50} className="rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">?</div>
          )}
          <p className='text-xl'>{vendor?.name || 'Unknown Vendor'}</p>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">{meal.title}</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {hasValidImageSrc ? (
              <Image
                className="w-full h-auto object-cover rounded-lg shadow-md"
                src={meal.photo_url as string}
                alt={meal.title || 'Meal image'}
                width={800}
                height={600}
                priority
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg shadow-md">No Image</div>
            )}
          </div>
          {/* We now use the Client Component to render the interactive section */}
          <AddToCartSection meal={meal as Meal} />
        </div>
      </div>

      <Footer />
    </section>
  );
}
