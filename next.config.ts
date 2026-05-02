import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Avoid bundling Prisma into the Next server graph; a bundled copy can lag
  // behind `prisma generate` and reject new fields until `.next` is cleared.
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
