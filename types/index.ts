// types/index.ts
// A new type that only includes the properties you need for the Favorites page.
export interface LeanVendor {
    name: string;
    logo_url: string;
    rating: number | null;
}

// Update the Meal interface to use the new type
export interface Meal {
    id: string;
    title: string;
    description: string | null;
    photo_url: string | null;
    price: number;
    total_orders: number;
    vendors: LeanVendor[] | null; // <-- Use the new type here
}

// Keep your full Vendor type for other pages that need it
export interface Vendor {
    id: number;
    uuid: string;
    name: string;
    email: string;
    logo_url: string;
    location: string;
    cuisine_tags: string[];
    contact_info: {
        website: string;
        phone: string;
    };
    created_at: string;
    rating: number | null;
}