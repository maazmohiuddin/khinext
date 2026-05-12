import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the auth cookie on every request so server components see a
 * fresh session. Also enforces admin gate on /admin routes.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: "", ...options });
          supabaseResponse = NextResponse.next({ request });
          supabaseResponse.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Refresh expired session token if needed.
  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl;

  // /admin gate: redirect unauthenticated visitors to /admin/login.
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    if (!user) {
      const redirect = url.clone();
      redirect.pathname = "/admin/login";
      redirect.searchParams.set("next", url.pathname);
      return NextResponse.redirect(redirect);
    }
  }

  return supabaseResponse;
}
