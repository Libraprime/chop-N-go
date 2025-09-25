import { Suspense } from 'react';
import ErrorMessage from './ErrorMessage';



export default function ErrorPage() {
  return (
    <div className="grid min-h-screen place-items-center p-8 sm:p-20 font-[var(--font-geist-sans)]">
      {/* We wrap the client component in <Suspense> so the server knows to skip
          this part and wait for the client to render it. */}
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorMessage />
      </Suspense>
    </div>
  );
}