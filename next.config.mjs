/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GOOGLE_SHEETS_API_KEY: 'AIzaSyDndYQEWM2xXKs85sSgrQYSG-L4GrraUcQ',
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

export default nextConfig;
