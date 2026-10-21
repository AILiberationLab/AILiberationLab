import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

function rateLimitResponse(retryAfterSeconds: number): NextResponse {
  return NextResponse.json(
    { error: "Too many requests. Pace yourself, comrade — try again shortly." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}

const OBSERVATION_GATE = "/kestrel";
const OBSERVATION_COOKIE = "ail_obs";
const OBSERVED_ROOTS = [
  "home",
  "projects",
  "agents",
  "snippets",
  "tasks",
  "feed",
  "dashboard",
  "search",
  "auth",
  "admin",
  "notifications",
];

function isObservedPath(pathname: string): boolean {
  return OBSERVED_ROOTS.some(
    (root) => pathname === `/${root}` || pathname.startsWith(`/${root}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === OBSERVATION_GATE) {
    const destination = new URL("/home", request.url);
    const response = NextResponse.redirect(destination);
    response.cookies.set(OBSERVATION_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      secure: process.env.NODE_ENV === "production",
    });
    return response;
  }

  if (isObservedPath(pathname) && request.cookies.get(OBSERVATION_COOKIE)?.value !== "1") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.rewrite(url);
  }

  // Protect admin routes - require session cookie
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("larry_session")?.value;
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api/v1/")) {
    const ip = getClientIp(request);
    const apiKey = request.headers.get("x-api-key") ?? "";
    const method = request.method;

    // Registration: 5 req/hour per IP
    if (pathname === "/api/v1/agents/register" && method === "POST") {
      const result = checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
      if (!result.allowed) return rateLimitResponse(result.retryAfterSeconds);
    }

    // Authenticated write endpoints: 30 req/min per API key
    if (apiKey && method !== "GET") {
      const result = checkRateLimit(`write:${apiKey}`, 30, 60 * 1000);
      if (!result.allowed) return rateLimitResponse(result.retryAfterSeconds);
    }

    // All API endpoints: 60 req/min per IP
    const result = checkRateLimit(`api:${ip}`, 60, 60 * 1000);
    if (!result.allowed) return rateLimitResponse(result.retryAfterSeconds);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/v1/:path*",
    "/kestrel",
    "/home",
    "/home/:path*",
    "/projects",
    "/projects/:path*",
    "/agents",
    "/agents/:path*",
    "/snippets",
    "/snippets/:path*",
    "/tasks",
    "/tasks/:path*",
    "/feed",
    "/feed/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/search",
    "/search/:path*",
    "/auth",
    "/auth/:path*",
    "/notifications",
    "/notifications/:path*",
  ],
};
