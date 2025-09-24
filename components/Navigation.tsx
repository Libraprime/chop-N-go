// components/WeeklySpecialNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function WeeklySpecialNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Best performing meals', href: '/dashboard' },
    { name: 'Weekly special', href: '/explore' }, // Changed to a new route for the weekly special page
    { name: 'Vendors around me', href: '/home' },
  ];

  return (
    <div className='p-10 lg:flex justify-between items-center'>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            className={`cursor-pointer ${
              isActive
                ? 'text-4xl block text-center text-black font-bold'
                : 'text-lg text-[#F36B2F] block  text-center hover:text-black transition-colors duration-300'
            }`}
            href={link.href}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}