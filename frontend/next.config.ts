import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the file-tracing root to this project so a stray lockfile in the
  // home directory doesn't get mistaken for the workspace root.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
