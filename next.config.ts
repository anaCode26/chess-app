import path from "node:path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /** A lockfile in the home directory otherwise wins the workspace-root inference. */
  turbopack: { root: path.resolve(import.meta.dirname) },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "9000" },
      { protocol: "http", hostname: "localhost", port: "9000" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.r2.dev" },
    ],
  },
};

export default withNextIntl(nextConfig);
