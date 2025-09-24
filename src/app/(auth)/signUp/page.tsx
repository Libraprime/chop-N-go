'use client'

import Link from 'next/link'
import React from 'react'
import { signup } from './actions'
import Image from 'next/image'
import logo from '@/public/logo.png'

const SignUp = () => {
  return (
    <div>
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
          
          <Link href="/signIn" className='text-[#F36B2F] p-10'>Sign In</Link>
        </div>

        <div className='justify-center items-center w-72 lg:w-96 my-5 m-auto py-16 px-5 bg-white text-black'>
          {/* <div className='m-10'>
            <div className='m-5'>
              <span className='p-1 px-2 m-1 rounded-3xl bg-[#F36B2F]'>1</span>
              <span>Get started</span>
            </div>
            <div className='m-5'>
              <span className='p-1 px-2 m-1 rounded-3xl bg-[#F36B2F]'>2</span>
              <span>Client Information</span>
            </div>
            <div className='m-5'>
              <span className='p-1 px-2 m-1 rounded-3xl bg-[#F36B2F]'>3</span>
              <span>Client's Address</span>
            </div>
          </div> */}

          <div className='m-10'>
            <div className='text-xl'>Get started</div>
            <div>Get your email verified</div>

            {/* Here's the form! */}
            <form action={signup} className="space-y-4 mt-4">
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="border p-2 w-full"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="border p-2 w-full"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className="bg-[#F36B2F] btn text-white px-4 py-2 rounded"
              >
                Sign Up
              </button>
            </form>

            <div className="mt-4">
              Already have an account?{' '}
              <Link className='text-[#F36B2F]' href="/signIn">Log In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp