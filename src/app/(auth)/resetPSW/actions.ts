// app/reset-password/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';

export async function resetPassword(code: string, newPassword: string) {
  const supabase = await createClient();

  // The code from the URL is used to set the new password for the current user session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Exchange code for session error:', error.message);
    return { error: 'Invalid or expired reset link. Please try again.' };
  }

  // Once the session is updated, update the user's password
  const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });

  if (passwordError) {
    console.error('Password update error:', passwordError.message);
    return { error: 'Failed to update password. Please try again.' };
  }

  return { error: null };
}