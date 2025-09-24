'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import type { Vendor } from '@/types/index';
import Link from 'next/link';

// The types for props
interface HomeClientContentProps {
  restaurants: Vendor[];
}

export default function HomeClientContent({ restaurants }: HomeClientContentProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="p-4">
      <label htmlFor="search" className="sr-only">Search meals</label>
      <input
        type="search"
        name="search"
        id="search"
        className="mt-4 p-2 border border-gray-300 rounded"
        placeholder="Search meals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <p className='text-4xl'>Vendors around me</p>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Official website / Email (Cuisine tags)</th>
              <th>Contact information</th>
            </tr>
          </thead>
          <tbody>
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map(restaurant => (
                <tr key={restaurant.id} className="cursor-pointer hover:bg-gray-100">
                  <td>
                    <Link href={`/vendors/${restaurant.id}`} className="block">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            {/* Check for a valid URL before rendering the Image */}
                            {typeof restaurant.logo_url === 'string' && restaurant.logo_url.length > 0 && restaurant.logo_url.startsWith('http') ? (
                              <Image
                                src={restaurant.logo_url}
                                alt={restaurant.name + ' logo'}
                                width={48}
                                height={48}
                              />
                            ) : (
                              // Render a placeholder if the URL is invalid or missing
                              <div className="h-12 w-12 bg-gray-200"></div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{restaurant.name}</div>
                          <div className="text-sm opacity-50">{restaurant.location}</div>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td>
                    {/* Use optional chaining and check for a valid URL */}
                    {restaurant.contact_info?.website && restaurant.contact_info.website.startsWith('http') && (
                      <a href={restaurant.contact_info.website} target="_blank">
                        {restaurant.contact_info.website.split('//')[1] || restaurant.contact_info.website}
                      </a>
                    )}
                    <br />
                    <span className="badge bg-[#F36B2F] p-2 badge-sm">{restaurant.cuisine_tags.join(', ')}</span>
                  </td>
                  <th>
                    <div className="dropdown dropdown-left dropdown-hover">
                      <div tabIndex={0} role="button" className="btn bg-[#F36B2F] m-1 text-white">Contact</div>
                      <ul tabIndex={0} className="dropdown-content menu bg-[#F36B2F] text-white w-52 rounded-box p-2 shadow-sm">
                        <li>
                          <a href={`tel:${restaurant.contact_info.phone}`}>Call: {restaurant.contact_info.phone}</a>
                        </li>
                        <li><a href={`mailto:${restaurant.email}`}>send them a mail</a></li>
                      </ul>
                    </div>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center text-gray-500">No restaurants found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
