// src/app/error/ErrorMessage.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorMessage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An unexpected error occurred.';

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-amber-50 p-6 text-center'>
      <div className='w-full max-w-sm py-16 px-5 bg-white text-black rounded shadow-md'>
        <h2 className='text-3xl font-bold mb-4 text-red-600'>Oops!</h2>
        <p className='text-lg mb-6 text-gray-700'>{errorMessage}</p>
        <Link href="/">
          <button className='bg-[#F36B2F] text-white px-6 py-2 rounded-lg hover:opacity-85 transition-opacity'>
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}