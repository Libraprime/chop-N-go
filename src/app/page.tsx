import React from 'react'
import Image from 'next/image'
import logo from '@/public/logo.png'
import Link from 'next/link'

const page = () => {
  return (
    <div className='h-screen'>
      <p className='text-center p-5 text-5xl text-[#F36B2F]'>Welcome</p>

      <div className='items-center text-center justify-center'>
        <Link  href="/">
          <Image
          src={logo}
          alt="Chop N Go Logo"
          width={500}
          height={500}
          className='m-auto'
          />
        </Link>
        <div className="dropdown dropdown-top dropdown-hover dropdown-center">
          <div tabIndex={0} role="button" className="btn bg-[#F36B2F] m-1">Start</div>
          <ul tabIndex={0} className="dropdown-content menu bg-[#F36B2F] rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <button className='btn text-white'>
                <Link href='/signUp'>Create an account</Link>
              </button>
            </li>
            <li>
              <button className='btn text-white'>
                <Link href='/signIn'>Log in</Link>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
    </div>

  )
}

export default page