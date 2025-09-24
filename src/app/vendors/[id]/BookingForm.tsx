'use client';

import { vendorsSupabaseClient } from '@/utils/supabase/vendorsSupabaseClient';
import { useState, FormEvent } from 'react';

// Define the props for the BookingForm component
interface BookingFormProps {
  vendorId: string;
}

export default function BookingForm({ vendorId }: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_date: '',
    guests: 1,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'guests' ? Number(value) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Log the payload to ensure it's what we expect
      console.log('Booking payload:', {
        vendor_id: vendorId,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        event_date: formData.event_date,
        number_of_guests: formData.guests,
        notes: formData.notes,
      });

      // Insert the new booking into the 'bookings' table
      const { error } = await vendorsSupabaseClient
        .from('bookings')
        .insert({
          vendor_id: vendorId,
          booking_type: 'table', // <--- Updated to 'table'
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          event_date: formData.event_date,
          number_of_guests: formData.guests,
          notes: formData.notes,
        });

      if (error) {
        // Log the full error object for better debugging
        console.error('Supabase insert error:', JSON.stringify(error, null, 2));
        throw new Error(error.message || 'Supabase insert failed with no message.');
      }

      setMessage('Booking submitted successfully! We will contact you soon.');
      // Reset the form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        event_date: '',
        guests: 1,
        notes: ''
      });
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        console.error('Error submitting booking:', (error as { message: string }).message);
      } else {
        console.error('Error submitting booking:', error);
      }
      setMessage('There was an error submitting your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Book an Event</h2>
      {message && (
        <div className={`p-4 mb-4 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F36B2F] focus:ring-[#F36B2F]"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F36B2F] focus:ring-[#F36B2F]"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F36B2F] focus:ring-[#F36B2F]"
          />
        </div>
        <div>
          <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">Event Date</label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F36B2F] focus:ring-[#F36B2F]"
          />
        </div>
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Number of Guests</label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F36B2F] focus:ring-[#F36B2F]"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#F36B2F] focus:ring-[#F36B2F]"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F36B2F] hover:bg-[#E25C21] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F36B2F] disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Booking'}
        </button>
      </form>
    </div>
  );
}
