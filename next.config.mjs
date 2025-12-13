/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: false, // Use 'false' if this is temporary (e.g., during development)
      },
    ];
  },
};

export default nextConfig;
