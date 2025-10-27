import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Compiler options for better transpilation
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  // Ensure proper transpilation for older browsers
  transpilePackages: [],
};

// Export without PWA wrapper to avoid transpilation issues
// We'll use manual service worker registration instead
export default nextConfig;
