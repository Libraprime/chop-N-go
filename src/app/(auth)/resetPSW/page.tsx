'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo.png';
import { resetPassword } from './actions';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Read the code and type from the URL
  const code = searchParams.get('code');
  const type = searchParams.get('type');

  useEffect(() => {
    if (!code || !type) {
      setMessage('Invalid or expired password reset link.');
    }
  }, [code, type]);

  const handleSubmit = async (formData: FormData) => {
    setMessage('');
    if (!code || !type) {
      setMessage('Invalid request.');
      return;
    }

    const newPassword = formData.get('password') as string;

    const result = await resetPassword(code, newPassword);

    if (result.error) {
      setMessage(result.error);
      setIsSuccess(false);
    } else {
      setMessage('Password reset successful! You can now log in with your new password.');
      setIsSuccess(true);
    }
  };

  return (
    <div className='bg-amber-50 min-h-screen flex flex-col justify-center items-center p-6'>
      <div className='flex justify-center mb-10'>
        <Link href="/">
          <Image src={logo} alt="Chop N Go Logo" width={120} height={120} />
        </Link>
      </div>

      <div className='w-full max-w-sm py-16 px-5 bg-white text-black text-center'>
        <h2 className='text-xl font-bold mb-2'>Set a New Password</h2>
        <p className='mb-6 text-sm text-gray-600'>
          Enter your new password below.
        </p>
        
        {(!code || !type) ? (
          <p className="text-red-600">{message}</p>
        ) : (
          <form action={handleSubmit} className="space-y-4">
            <input
              type="password"
              name="password"
              id="password"
              required
              className="border p-2 w-full"
              placeholder="Enter your new password"
            />
            <button
              type="submit"
              className="bg-[#F36B2F] w-full text-white px-4 py-2 rounded"
            >
              Reset Password
            </button>
          </form>
        )}

        {message && (
          <p className={`mt-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        {isSuccess && (
          <div className="mt-6 text-sm">
            Proceed to{' '}
            <Link className='text-[#F36B2F] font-semibold' href="/signIn">Log In</Link>
          </div>
        )}
      </div>
    </div>
  );
}