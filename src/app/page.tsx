import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/logo.png'

// This is the main page component for the root URL (/).
const HomePage = () => {
  return (
    <div className='h-screen flex flex-col items-center justify-center p-5'>
      {/* Centered welcome message */}
      <p className='text-center text-5xl text-[#F36B2F] font-bold mb-8'>
        Welcome
      </p>

      {/* Link around the logo for navigation */}
      <Link href="/">
        <Image
          src={logo}
          alt="Chop N Go Logo"
          width={500}
          height={500}
          className='m-auto mb-8'
        />
      </Link>

      {/* DaisyUI dropdown menu for authentication options */}
      <div className="dropdown dropdown-top dropdown-hover dropdown-center">
        <div tabIndex={0} role="button" className="btn bg-[#F36B2F] m-1 text-white">Start</div>
        <ul tabIndex={0} className="dropdown-content menu bg-[#F36B2F] rounded-box z-1 w-52 p-2 shadow-sm">
          <li>
            {/* Link styled as a button for the "Create an account" option */}
            <Link href='/signUp' className='btn text-white w-full'>
              Create an account
            </Link>
          </li>
          <li>
            {/* Link styled as a button for the "Log in" option */}
            <Link href='/signIn' className='btn text-white w-full'>
              Log in
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default HomePage
