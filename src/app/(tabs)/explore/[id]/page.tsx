import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialNav from '@/components/Navigation';
import { notFound } from 'next/navigation';
import { vendorsSupabaseClient } from '@/utils/supabase/vendorsSupabaseClient';
import Link from 'next/link';
import OrderDetailsClientComponent from './OrderDetailsClientComponent';
import StarRating from '@/components/StarRating';

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

// This is a Server Component, so it can be async and fetch data directly
export default async function OrderPage({ params }: { params: { id: string } }) {
  const mealId = params.id;

  // Fetch the meal data from the 'meals' table and join with the 'vendors' table
  const { data: meal, error } = await vendorsSupabaseClient
    .from('meals')
    .select('*, vendors(*)')
    .eq('id', mealId)
    .single();

  if (error) {
    console.error('Error fetching meal:', error.message);
  }

  // If no meal is found with the given ID, show the Next.js not-found page
  if (!meal) {
    notFound();
  }

  const vendor = meal.vendors;

  const hasValidImageSrc = typeof meal.photo_url === 'string' && (meal.photo_url.startsWith('http://') || meal.photo_url.startsWith('https://'));
  const hasValidLogo = vendor && typeof vendor.logo_url === 'string' && (vendor.logo_url.startsWith('http://') || vendor.logo_url.startsWith('https://'));

  return (
    <main className="p-4">
      <Header />
      <SpecialNav />

      <div className="container mx-auto p-4">
        <div className='flex justify-between items-center mb-6'>
          {hasValidLogo ? (
            <Link href={`/vendors/${vendor.id}`}>
              <Image
                src={vendor.logo_url}
                alt={`${vendor.name} logo`}
                width={100}
                height={100}
                className="rounded-full"
              />
            </Link>
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm text-gray-500">?</span>
            </div>
          )}
          <p className='text-xl font-semibold text-gray-800'>{vendor?.name || 'Unknown Vendor'}</p>
        </div>
        <h1 className="text-4xl font-bold text-center mb-8">{meal.title}</h1>
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
              <div className="w-full h-96 bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          {/* We now use the new, refactored Client Component to handle all interactivity */}
          <OrderDetailsClientComponent meal={meal as Meal} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
