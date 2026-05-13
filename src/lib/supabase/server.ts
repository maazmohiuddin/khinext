import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Strips the `Authorization` header when its bearer value is an opaque
 * Supabase API key (sb_publishable_* / sb_secret_*). The REST gateway
 * 401s when those are sent as a bearer JWT — see lib/supabase/client.ts
 * for the full explanation. Wraps a fetch impl; pass-through otherwise.
 */
const stripOpaqueBearerFetch: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers);
  const auth = headers.get("Authorization") ?? headers.get("authorization");
  if (auth) {
    const token = auth.replace(/^Bearer\s+/i, "");
    if (/^sb_(publishable|secret)_/.test(token)) {
      headers.delete("Authorization");
      headers.delete("authorization");
    }
  }
  return fetch(input, { ...init, headers });
};

/**
 * Server-side Supabase client bound to the request's cookies.
 * Use this in Server Components, Server Actions and Route Handlers
 * that need the *user* session (admin auth, RLS-protected reads).
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — Next.js disallows write here.
            // Safe to ignore: middleware refreshes the session on the next request.
          }
        },
      },
      global: { fetch: stripOpaqueBearerFetch },
    },
  );
}

/**
 * Service-role client. Bypasses RLS. NEVER expose to the browser.
 * Use sparingly: admin API routes only.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: stripOpaqueBearerFetch },
    },
  );
}
