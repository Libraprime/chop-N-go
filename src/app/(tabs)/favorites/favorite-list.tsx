'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Meal, Vendor } from '@/types'; 
import StarRating from '@/components/StarRating'; // <-- Import the StarRating component

export default function FavoriteList(props: { meals: Meal[] }) {
  const { meals } = props;
  if (!meals || meals.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p>You haven't favorited any meals yet.</p>
        <Link href="/dashboard" className="text-[#F36B2F] mt-2 block">
          Browse meals to find your favorites!
        </Link>
      </div>
    );
  }

  return (
    <div className='flex flex-wrap justify-around gap-y-10 m-5'>
      {meals.map(meal => {
        const hasValidImageSrc = typeof meal.photo_url === 'string' && (meal.photo_url.startsWith('http://') || meal.photo_url.startsWith('https://'));
        
        // Safely access the first vendor in the array
        const firstVendor = meal.vendors && meal.vendors.length > 0 ? meal.vendors[0] : null;

        // Safely check for a valid logo URL
        const hasValidLogo = firstVendor && typeof firstVendor.logo_url === 'string' && (firstVendor.logo_url.startsWith('http://') || firstVendor.logo_url.startsWith('https://'));

        return (
          <div key={meal.id} className="card w-96 shadow-sm">
            <figure>
              {hasValidImageSrc ? (
                <Image className='h-96 object-cover' src={meal.photo_url || ''} alt={meal.title} width={384} height={384} />
              ) : (
                <div className="h-96 w-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </figure>
            <div className="card-body">
              <div className="flex items-center justify-between text-end mb-2">
                {hasValidLogo && firstVendor ? (
                  <Image src={firstVendor.logo_url} alt={`${firstVendor.name} logo`} width={40} height={40} className="rounded-full" />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm text-gray-500">?</span>
                  </div>
                )}
                <p className="font-bold text-lg text-gray-700">{firstVendor ? firstVendor.name : 'Unknown Vendor'}</p>
              </div>
              
              {/* Use your StarRating component here */}
              <StarRating rating={firstVendor?.rating || 0} groupId={meal.id} />

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
      })}
    </div>
  );
}