import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define your route matchers
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)" , "/"]);
const isSetupRoute = createRouteMatcher(["/profile-setup"]);

// Cast sessionClaims so TypeScript knows about metadata

export default clerkMiddleware((auth, req) => {
  try {
    if (isProtectedRoute(req)) auth().protect();

    const { userId, sessionClaims } = auth();

    const headers = new Headers(req.headers);
    headers.set("x-current-path", req.nextUrl.searchParams.toString());

    // 1. If the user is logged in
    // if (userId) {
    //   // Read onboarding status from sessionClaims
    //   const claims = sessionClaims as unknown as {
    //     metadata?: {
    //       onboardingComplete?: boolean;
    //     };
    //   };

      // Now you can safely access it without any TS error:
      // const onboardingComplete = claims?.metadata?.onboardingComplete;
      // console.log("Onboarding Complete:", onboardingComplete);

      // // 2. If onboarding is NOT complete, force them to /setup-profile
      // if (!onboardingComplete && !isSetupRoute(req)) {
      //   const setupUrl = new URL("/profile-setup", req.url);
      //   return NextResponse.redirect(setupUrl);
      // }

      // // 3. Optional: If onboarding IS complete, prevent them from accessing /setup-profile manually
      // if (onboardingComplete && isSetupRoute(req)) {
      //   const homeUrl = new URL("/", req.url);
      //   return NextResponse.redirect(homeUrl);
      // }
    // }

    return NextResponse.next({ headers });
  } catch (err) {
    console.error(err);
    return new NextResponse("Authentication error", { status: 404 });
  }
});

const isProtectedRoute = createRouteMatcher([
  "/profile-setup",
  "/u/dashboard(.*)",
]);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
