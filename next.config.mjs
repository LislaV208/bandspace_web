import packageJson from './package.json' with { type: "json" };

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    APP_VERSION: packageJson.version,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
