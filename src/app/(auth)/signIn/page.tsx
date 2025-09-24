// app/signIn/page.tsx
'use client'

import Link from 'next/link'
import { login } from './actions' // Import the server action
import Image from 'next/image'
import logo from '@/public/logo.png'

const SignIn = () => {
  return (
    <div className='bg-amber-50 p-10 lg:p-20'>
      <div className='flex justify-between'>
        <Link href="/">
            <Image
            src={logo}
            alt="Chop N Go Logo"
            width={120}
            height={120}
            />
        </Link>
        <Link className='text-[#F36B2F] p-10' href="/signUp">Sign Up</Link>
      </div>

      <div className='justify-center items-center w-72 lg:w-96 my-5 m-auto py-16 px-5 bg-white text-black'>
        <div className='m-5'>
          <div className='text-xl'>Welcome Back</div>
          <div>Login to your account</div>

          {/* Connect the form to the server action */}
          <form action={login} className="space-y-4 mt-4">
            <input
              type="email"
              name="email"
              id="email"
              required
              className="border p-2 w-full"
              placeholder="Enter your email"
            />
            <input
              type="password"
              name="password"
              id="password"
              required
              className="border p-2 w-full"
              placeholder="Enter your password"
            />
            <div className='flex justify-between items-center space-x-2'>
              <button
                type="submit"
                className="bg-[#F36B2F] btn text-white px-4 py-2 rounded"
              >
                Submit
              </button>

              <Link className='text-sm text-[#F36B2F]' href="/forgot-password">Forgot Password?</Link>
            </div>
            
          </form>

          <div className="mt-4">
            Don&apos;t have an account?{' '}
            <Link className='text-[#F36B2F]' href="/signUp">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn