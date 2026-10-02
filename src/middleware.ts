import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Single source of truth: Explicitly define ONLY public routes (Deny-by-Default)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/search(.*)",
  "/doctor(.*)",
  "/api/webhooks(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/profile-setup(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = auth();

  // 2. Forward current pathname & query to Server Components via request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-current-path", req.nextUrl.pathname);

  // 3. Unauthenticated users: Block access to any non-public route
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // 4. Authenticated users: Enforce onboarding flow (skip for API routes)
  if (userId && !isApiRoute(req)) {
    const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;

    // Force incomplete users to /profile-setup
    if (!onboardingComplete && !isOnboardingRoute(req)) {
      return NextResponse.redirect(new URL("/profile-setup", req.url));
    }

    // Prevent onboarded users from visiting /profile-setup again
    if (onboardingComplete && isOnboardingRoute(req)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};