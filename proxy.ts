import { NextResponse, type NextRequest } from "next/server";

const HTTP_FORWARDED_PROTOCOL = "http";
const HTTPS_PROTOCOL = "https:";

export function proxy(request: NextRequest): NextResponse {
  const forwardedProtocol = request.headers.get("x-forwarded-proto");

  if (process.env.NODE_ENV === "production" && forwardedProtocol === HTTP_FORWARDED_PROTOCOL) {
    const secureUrl = request.nextUrl.clone();
    secureUrl.protocol = HTTPS_PROTOCOL;
    return NextResponse.redirect(secureUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*"
};
