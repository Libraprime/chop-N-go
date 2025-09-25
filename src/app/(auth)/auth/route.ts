import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null

  const redirectTo = request.nextUrl.clone()
  const successPath = '/account'
  const errorPath = '/error'

  // Clean up sensitive query parameters
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')

  if (!token_hash || !type) {
    redirectTo.pathname = errorPath
    redirectTo.searchParams.set('message', 'Missing token or type.')
    return NextResponse.redirect(redirectTo)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (error) {
    redirectTo.pathname = errorPath
    redirectTo.searchParams.set('message', error.message || 'OTP verification failed.')
    return NextResponse.redirect(redirectTo)
  }

  redirectTo.pathname = successPath
  redirectTo.searchParams.delete('next') // if present
  return NextResponse.redirect(redirectTo)
}
