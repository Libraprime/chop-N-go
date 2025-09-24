// app/favorites/page.tsx
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialNav from '@/components/Navigation';
import FavoriteList from './favorite-list';
import { createClient } from '@/utils/supabase/server';
import { vendorsSupabaseClient } from '@/utils/supabase/vendorsSupabaseClient';
import { Meal } from '@/types';

export default async function FavoritesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold">Please Log In</h2>
                <p>You need to be logged in to view your favorite meals.</p>
            </div>
        );
    }

    // Step 1: Fetch the list of favorited meal IDs from the consumer database
    const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('meal_id') // We only need the meal_id here
        .eq('user_id', user.id);

    if (favoritesError) {
        console.error('Error fetching favorite IDs:', favoritesError);
        return <div className="text-center text-red-500 p-10">Failed to load favorites.</div>;
    }

    // Extract the meal_ids into a simple array
    const mealIds = favorites?.map(fav => fav.meal_id) || [];
    
    // Handle case where there are no favorites
    if (mealIds.length === 0) {
        return (
            <main className="p-4">
                <Header />
                <SpecialNav />
                <h1 className="text-2xl font-bold text-center my-6">Your Favorite Meals</h1>
                <FavoriteList meals={[]} />
                <Footer />
            </main>
        );
    }

    // Step 2: Use the IDs to fetch the full meal details from the vendor database
    const { data: meals, error: mealsError } = await vendorsSupabaseClient
        .from('meals')
        .select(`
            id,
            title,
            description,
            photo_url,
            price,
            total_orders,
            vendors (
                name,
                logo_url,
                rating
            )
        `)
        .in('id', mealIds); // Fetch all meals whose IDs are in our list

    if (mealsError) {
        console.error('Error fetching meal details:', mealsError);
        return <div className="text-center text-red-500 p-10">Failed to load meal details.</div>;
    }

    const favoriteMeals: Meal[] = (meals || []).map(meal => {
        // Ensure the vendors property is an array as expected by the Meal type
        const vendors = Array.isArray(meal.vendors) ? meal.vendors : (meal.vendors ? [meal.vendors] : null);
        return {
            ...meal,
            vendors: vendors
        };
    });

    return (
        <main className="p-4">
            <Header />
            <SpecialNav />
            <h1 className="text-2xl font-bold text-center my-6">Your Favorite Meals</h1>
            <FavoriteList meals={favoriteMeals} />
            <Footer />
        </main>
    );
}