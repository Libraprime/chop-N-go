'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import logo from '@/public/logo.png';
import { useCart } from '@/src/app/context/CartContext'; // Import the useCart hook

interface HeaderProps {
  // It's a good practice to define props for data that
  // might be passed from a parent component.
  // We'll keep the logic here for now, but this is a good
  // next step for a larger application.
}

export default function Header({}: HeaderProps) {
  const supabase = createClient();
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Now we also get the 'cart' array itself to display the items
  const { cart, totalItems, subtotal } = useCart();

  // Log the cart state to the console for debugging
  console.log('Cart state in Header:', { cart, totalItems, subtotal });

  useEffect(() => {
    async function fetchUserProfile() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("User not found or error:", authError);
        setError("Unable to find user profile.");
        setLoading(false);
        return;
      }

      const { data: consumer, error: consumerError } = await supabase
        .from('consumers')
        .select('username, avatar_url')
        .eq('id', user.id)
        .single();

      if (consumerError) {
        console.error("Error fetching consumer data:", consumerError.message);
        setError("Failed to fetch user data.");
      } else {
        setUsername(consumer?.username ?? null);
        if (consumer?.avatar_url && SUPABASE_URL) {
          const fullUrl = `${SUPABASE_URL}/storage/v1/object/public/avatars/${consumer.avatar_url}`;
          setAvatarUrl(fullUrl);
        } else {
          setAvatarUrl(null);
        }
      }
      setLoading(false);
    }
    fetchUserProfile();
  }, [supabase, SUPABASE_URL]);

  // A helper function to render the avatar with consistent sizing
  const renderAvatar = (size: number) => (
    avatarUrl ? (
      <Image
        width={size}
        height={size}
        src={avatarUrl}
        alt="User Avatar"
        className="rounded-full object-cover"
      />
    ) : (
      <div
        className="bg-gray-200 rounded-full"
        style={{ width: size, height: size }}
      />
    )
  );

  return (
    <header className="p-4">
      <div className="navbar shadow-sm flex-wrap">
          <div className="flex-1">
          <Link href="/">
              <Image
              src={logo}
              alt="Chop N Go Logo"
              width={120}
              height={120}
              />
          </Link>
          </div>

          <div className="flex-none flex items-center gap-4">
          {loading ? (
              <span className="loading loading-spinner text-info"></span>
          ) : error ? (
              <p className="text-red-500 text-sm">{error}</p>
          ) : (
              <>
              {/* Cart dropdown */}
              <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                  <div className="indicator">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {/* Dynamically display the total number of items */}
                      <span className="badge badge-sm indicator-item">{totalItems}</span>
                  </div>
                  </div>
                  <div tabIndex={0} className="card card-compact dropdown-content bg-[#F36B2F] z-1 mt-3 w-52 shadow">
                  <div className="card-body">
                      {/* Dynamically display the total number of items */}
                      <span className="text-lg text-white font-bold">{totalItems} Items</span>
                      {/* Dynamically display the subtotal, formatted as a currency */}
                      <span className="text-white">Subtotal: ₦{subtotal.toFixed(2)}</span>
                      <ul className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {cart.map((item) => (
                          <li key={item.id} className="text-white flex items-center justify-between">
                            <div className="flex items-center">
                              {item.photo_url && (
                                <Image
                                  src={item.photo_url}
                                  alt={item.title}
                                  width={32}
                                  height={32}
                                  className="rounded-full mr-2 object-cover"
                                />
                              )}
                              <span>{item.quantity} x {item.title}</span>
                            </div>
                            <span className="text-sm">₦{(item.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="card-actions mt-4">
                      <Link href='/cart' className="btn btn-base btn-block">View cart</Link>
                      </div>
                  </div>
                  </div>
              </div>

              {/* Profile dropdown with a unified avatar and menu */}
              <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                      {renderAvatar(40)} {/* Consistent sizing */}
                  </div>
                  </div>
                  <ul tabIndex={0} className="menu menu-sm dropdown-content bg-[#F36B2F] rounded-box z-1 mt-3 w-52 p-2 shadow">
                  <li>
                      <Link href='/updateProfile' className="justify-between">
                      Profile
                      <span className="badge">New</span>
                      </Link>
                  </li>
                  <li><Link href="#">Settings</Link></li>
                  <li className='flex flex-row'>
                      <p className='flex'>Unread messages</p> 
                      <div className="status status-info animate-bounce"></div>.
                  </li>
                  <li>
                      <form action="/signout" method="post">
                      <button type="submit" className="w-full text-left">Sign out</button>
                      </form>
                  </li>
                  </ul>
              </div>
              </>
          )}
          </div>
      </div>

      <div className='flex justify-between'>
        <div className="hidden sm:flex items-center gap-6 pt-5">
          {renderAvatar(50)}
          <div>
          <p className="text-lg font-semibold">Hi {username || 'there'}!</p>
          <p>What would you love to eat?</p>
          </div>
        </div>

        <div className='mt-2 md:p-0 text-xs align-middle p-5 text-white mask mask-heart bg-[#F36B2F]'>
          <Link href='/favorites'>Favorites</Link>
        </div>
      </div>
      
    </header>
  );
}
