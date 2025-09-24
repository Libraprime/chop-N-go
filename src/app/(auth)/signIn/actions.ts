'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  const user = authData?.user
  if (!user?.id) {
    // This case should be rare but good to handle
    redirect(`/error?message=Session error. No user ID.`)
  }

  // Use upsert to create or fetch the user profile
  const { data: profile, error: profileError } = await supabase
    .from('consumers')
    .upsert({
      id: user.id,
      email: user.email,
      updated_at: new Date().toISOString()
    })
    .select('full_name, location, contact_info')
    .single()

  if (profileError) {
    redirect(`/error?message=${encodeURIComponent('Error checking user profile: ' + profileError.message)}`)
  }

  // Check if profile is complete and redirect accordingly
  const isProfileComplete = profile.full_name && profile.location && profile.contact_info

  revalidatePath('/', 'layout')
  redirect(isProfileComplete ? '/explore' : '/account')
}
