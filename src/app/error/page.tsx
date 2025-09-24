// src/app/error/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'Something went wrong.'

  return (
    <div className="grid min-h-screen place-items-center p-8 sm:p-20 font-[var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 items-center text-center">
        <h1 className="text-2xl font-semibold text-red-500">Error</h1>
        <p className="text-base text-gray-700">{message}</p>
      </main>
    </div>
  )
}
