import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();

  const headers = new Headers(req.headers);
  headers.set("x-current-path", req.nextUrl.searchParams.toString());
  return NextResponse.next({headers})
});

const isProtectedRoute = createRouteMatcher(["/profile-setup","/u/dashboard(.*)"]);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
