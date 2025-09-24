/** @type {import('next').NextConfig} */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const VENDORS_DB_URL = process.env.VENDORS_DB_URL || '';

// A list of hardcoded image hostnames.
// You can add more here as needed.
const staticHostnames = [
  'www.greenspringsschool.com',
  'lists.ng',
  'www.allnigerianrecipes.com',
  'www.simplyrecipes.com',
  'i.ytimg.com',
  'tse3.mm.bing.net',
  'scontent-los2-1.xx.fbcdn.net',
  'th.bing.com',
  'mir-s3-cdn-cf.behance.net',
  'crunchiesonline.com',
  'tse1.mm.bing.net',
  'hsvespdbsyqxorgehmqw.supabase.co',
  "tse2.mm.bing.net",
];

// Dynamically get hostnames from environment variables.
// These will be empty strings if the environment variables are not set.
const dynamicHostnames = [
  SUPABASE_URL ? new URL(SUPABASE_URL).hostname : '',
  VENDORS_DB_URL ? new URL(VENDORS_DB_URL).hostname : '',
];

// Combine all hostnames and filter out any invalid or empty entries.
const allHostnames = [...staticHostnames, ...dynamicHostnames].filter(
  (hostname) => typeof hostname === 'string' && hostname.length > 0
);

// Map the valid hostnames to the remotePatterns format required by Next.js.
const remotePatterns = allHostnames.map((hostname) => ({
  protocol: 'https',
  hostname,
}));

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
