import { vendorsSupabaseClient } from '@/utils/supabase/vendorsSupabaseClient';
import type { Vendor } from '@/types';
import Image from 'next/image';
import BookingForm from './BookingForm';

// Explicitly define the PageProps type
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VendorPage({ params }: PageProps) {
  const { id: vendorId } = await params;

  // Fetch a single vendor from the database based on the UUID
  const { data: vendor, error } = await vendorsSupabaseClient
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .single();

  if (error) {
    console.error('Error fetching vendor:', error.message);
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">
          Error loading vendor data. Please try again later.
        </p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-500">Vendor not found.</p>
      </div>
    );
  }

  const typedVendor: Vendor = vendor as Vendor;

  return (
    <main className="container mx-auto p-4">
      {/* Vendor Header Section */}
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center">
        {typedVendor.logo_url?.startsWith('http') && (
          <Image
            src={typedVendor.logo_url}
            alt={`${typedVendor.name} logo`}
            width={128}
            height={128}
            className="rounded-full mx-auto mb-4"
          />
        )}
        <h1 className="text-5xl font-bold text-gray-800 mb-2">
          {typedVendor.name}
        </h1>
        <p className="text-lg text-gray-600 mb-4">{typedVendor.location}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {typedVendor.cuisine_tags.map((tag, index) => (
            <span
              key={index}
              className="badge bg-[#F36B2F] p-2 text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Vendor Details Section */}
      <section className="mt-8 grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Contact Information
          </h2>
          {typedVendor.contact_info.website && (
            <p className="text-gray-600 mb-2">
              <strong>Website:</strong>{' '}
              <a
                href={typedVendor.contact_info.website}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                {typedVendor.contact_info.website}
              </a>
            </p>
          )}
          <p className="text-gray-600 mb-2">
            <strong>Phone:</strong>{' '}
            <a
              href={`tel:${typedVendor.contact_info.phone}`}
              className="text-blue-500 hover:underline"
            >
              {typedVendor.contact_info.phone}
            </a>
          </p>
          <p className="text-gray-600">
            <strong>Email:</strong>{' '}
            <a
              href={`mailto:${typedVendor.email}`}
              className="text-blue-500 hover:underline"
            >
              {typedVendor.email}
            </a>
          </p>
        </div>

        {/* Booking Form */}
        <BookingForm vendorId={String(typedVendor.id)} />
      </section>
    </main>
  );
}
