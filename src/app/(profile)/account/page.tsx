// app/account/page.tsx
import { redirect } from 'next/navigation'
import AccountForm from './profile-form'
import { createClient } from '@/utils/supabase/server'

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/signIn') // redirect if not signed in
  }

  const { data: profile } = await supabase
    .from('consumers') // or 'vendors' depending on your app
    .select('full_name, contact_info, location')
    .eq('id', user.id)
    .single()

  // If the user already has full profile, send them to dashboard
  if (
    profile?.full_name &&
    profile?.contact_info &&
    profile?.location
  ) {
    redirect('/')
  }

  // Otherwise show the form to complete account
  return <AccountForm user={user} />
}
