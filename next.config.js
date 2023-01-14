/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["phonedb.net", "themoviedb.org"],
  },
};

module.exports = nextConfig;
