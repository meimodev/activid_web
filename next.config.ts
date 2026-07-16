import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Keep sharp external so its native libvips binary is traced into the
  // serverless bundle instead of being (mis)bundled by Turbopack — otherwise
  // it fails to dlopen at runtime on Vercel's linux-x64.
  serverExternalPackages: ["sharp"],
  // serverExternalPackages alone isn't enough on Vercel: sharp's native
  // binding is require()d (traced), but libvips-cpp.so is loaded via ELF
  // RPATH from @img/sharp-libvips-linux-x64 — invisible to require-tracing,
  // so force-include it wherever the enhance path can run.
  outputFileTracingIncludes: {
    "/api/kenangan/**": [
      "./node_modules/.pnpm/@img+sharp-libvips-linux-x64@*/**",
    ],
  },
  // Let a cloudflared tunnel host reach dev assets/HMR for real-device testing (dev-only).
  allowedDevOrigins: ["*.trycloudflare.com"],
  experimental: {
    optimizePackageImports: ["framer-motion", "luxon", "firebase/firestore"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
