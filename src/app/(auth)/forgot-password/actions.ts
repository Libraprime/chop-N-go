// app/forgot-password/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/resetPSW`,
  });

  if (error) {
    console.error('Password reset request error:', error.message);
    return { error: 'Failed to send reset link. Please try again.' };
  }

  return { error: null };
}