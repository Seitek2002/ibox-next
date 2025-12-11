import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ibox.kg',
        pathname: '/media/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Route react-router-dom imports to our Next.js compatibility layer
      "react-router-dom": path.resolve(__dirname, "src/router/compat.tsx"),
    };

    // Allow importing SVGs (and get back a URL string) so we can do `import icon from "@/assets/.../icon.svg"`
    config.module ??= { rules: [] };
    (config.module.rules = config.module.rules || []).push({
      test: /\.(svg|png|jpe?g|gif|webp)$/i,
      type: 'asset/resource',
      issuer: /\.[jt]sx?$/,
    });

    return config;
  },
};

export default nextConfig;
