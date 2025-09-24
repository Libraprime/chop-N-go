// app/dashboard/actions.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleFavorite(mealId: string) {
  const supabase = await createClient();

  // Get the current authenticated user's ID
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Redirect or handle unauthenticated user trying to favorite
    throw new Error('User not authenticated.');
  }

  // Check if the meal is already favorited by the user
  const { data: favorite, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('meal_id', mealId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means 'no rows found'
    // Handle other errors
    throw new Error('Failed to check favorite status.');
  }

  if (favorite) {
    // If it exists, remove it (unfavorite)
    const { error: deleteError } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favorite.id);

    if (deleteError) throw new Error('Failed to remove from favorites.');

  } else {
    // If it doesn't exist, add it
    const { error: insertError } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, meal_id: mealId });

    if (insertError) throw new Error('Failed to add to favorites.');
  }

  // Revalidate the favorites page to show the updated state
  revalidatePath('/favorites');
}