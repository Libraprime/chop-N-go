'use client';

import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo.png';
import { forgotPassword } from './actions';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setMessage('');
    const result = await forgotPassword(formData);
    if (result.error) {
      setMessage(result.error);
      setIsSuccess(false);
    } else {
      setMessage('If your email is in our system, you’ll receive a password reset link shortly.');
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
        <h2 className='text-xl font-bold mb-2'>Forgot Password?</h2>
        <p className='mb-6 text-sm text-gray-600'>
          No worries, we'll send you a password reset link.
        </p>

        <form action={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            id="email"
            required
            className="border p-2 w-full"
            placeholder="Enter your email"
          />
          <button
            type="submit"
            className="bg-[#F36B2F] w-full text-white px-4 py-2 rounded"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className={`mt-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}

        <div className="mt-6 text-sm">
          Remember your password?{' '}
          <Link className='text-[#F36B2F] font-semibold' href="/signIn">Log In</Link>
        </div>

        <div className="mt-6 text-sm">
          Gotten the password reset link?{' '}
          <Link className='text-[#F36B2F] font-semibold' href="/resetPSW">Reset Password</Link>
        </div>
      </div>
    </div>
  );
}