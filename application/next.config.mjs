/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Ensure static files are handled properly for GitHub Pages
  images: {
    unoptimized: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Configure the base path if your site is hosted in a sub-directory
  // Only needed if not using a custom domain
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

export default nextConfig;
