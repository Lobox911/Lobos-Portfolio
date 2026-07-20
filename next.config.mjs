/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    allowedDevOrigins: [
      'ais-dev-knruzsqakpohayrbx5dftn-35148143062.europe-west2.run.app',
      'ais-pre-knruzsqakpohayrbx5dftn-35148143062.europe-west2.run.app',
      'localhost:3000',
    ],
  },
};

export default nextConfig;
