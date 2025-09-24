import Link from "next/link";

export default function SignUpSuccess() {
  return (
    <div className="bg-amber-50 min-h-screen flex items-center justify-center p-6 text-center text-black">
      <div className="">
        <h2 className="text-2xl font-bold mb-2">You&apos;re Almost In!</h2>
        <p className="mb-4">We&apos;ve sent a confirmation email to your inbox.</p>
        <p className="text-sm text-gray-600">Please verify your email before logging in.</p>
        <p className="m-10 text-2xl">Verified your mail? proceed to <Link className="text-[#F36B2F]" href='/signIn'>log in </Link></p>
      </div>
    </div>
  )
}
