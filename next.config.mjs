const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "img-src 'self' https: data: blob:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "connect-src 'self'",
      "worker-src 'self' blob:",
      "manifest-src 'self'"
    ].join("; ")
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  }
];

const isStaticExport = process.env.WORLD_CUP_DESK_STATIC_EXPORT === "1";
const siteBasePath = process.env.WORLD_CUP_DESK_SITE_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isStaticExport ? "export" : "standalone",
  basePath: isStaticExport ? siteBasePath : undefined,
  assetPrefix: isStaticExport && siteBasePath ? `${siteBasePath}/` : undefined,
  images: {
    unoptimized: isStaticExport
  },
  trailingSlash: isStaticExport,
  poweredByHeader: false,
  reactStrictMode: true
};

if (!isStaticExport) {
  nextConfig.headers = async () => [
    {
      source: "/:path*",
      headers: securityHeaders
    }
  ];
}

export default nextConfig;
