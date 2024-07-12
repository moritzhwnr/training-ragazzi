import { auth } from "@/auth"

// Export a default function that checks authentication status
export default auth((req) => {
  // Check if the request has authentication information
  if (!req.auth) {
    // If not authenticated, redirect to the signin page
    const newUrl = new URL("/api/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

// Specify endpoint path that middleware should secure 
export const config = {
  matcher: ['/analysis'],
};