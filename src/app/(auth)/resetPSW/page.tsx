// src/app/(auth)/resetpsw/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo.png';
import ResetPasswordForm from './ResetPasswordForm'; // Import the new client component

export default function ResetPasswordPage() {
  return (
    <div className='bg-amber-50 min-h-screen flex flex-col justify-center items-center p-6'>
      <div className='flex justify-center mb-10'>
        <Link href="/">
          <Image src={logo} alt="Chop N Go Logo" width={120} height={120} />
        </Link>
      </div>
      {/* Wrap the client-side component in a Suspense boundary */}
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}