// This is now a Server Component
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpecialNav from '@/components/Navigation';
import HomeClientContent from '../home/clientContent';
import { vendorsSupabaseClient } from '@/utils/supabase/vendorsSupabaseClient';
import type { Vendor } from '@/types/index'; // Import the type directly from the component file

export default async function Home() {
  const { data: vendors, error } = await vendorsSupabaseClient.from('vendors').select('*');

  if (error) {
    console.error('Error fetching vendors:', error.message);
    // You can handle errors gracefully here
    return <div>Error loading data. Please try again later.</div>;
  }

  // Cast the data to the Vendor[] type to ensure type safety
  const typedVendors = vendors as Vendor[];

  return (
    <main className="p-4">
      <Header />
      <SpecialNav />
      
      {/* Pass the typed data to the client component */}
      <HomeClientContent restaurants={typedVendors} />
      
      <Footer />
    </main>
  );
}