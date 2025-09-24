// app/account/page.tsx
import { redirect } from 'next/navigation'
import AccountForm from '../account/profile-form'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    // Redirect to sign in if the user is not authenticated
    redirect('/signIn')
  }

  // The AccountForm component will handle fetching and populating the profile
  // whether it's complete or not.
  // We no longer redirect if the profile is complete.
  return <AccountForm user={user} />
}