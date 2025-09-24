import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, NextRequest } from "next/server";


export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Create a Supabase client using the request and response objects
  const supabase = createMiddlewareClient({
    req: request,
    res: response,
  });

  // Refresh the session and extract the session object with type annotation
  const {
    data: { session },
  }: { data: { session: any } } = await supabase.auth.getSession();

  console.log("Session:", session);

  if (!session) {
    // If no session exists, redirect to the login page
    const loginUrl = new URL("/auth/signIn", request.url);
    return NextResponse.rewrite(loginUrl);
  }
    // If session exists, continue with the request 
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}