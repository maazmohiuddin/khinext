import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client.
 *
 * Workaround for new opaque API keys (sb_publishable_* / sb_secret_*):
 * supabase-js by default puts the apikey into BOTH the `apikey` header
 * AND `Authorization: Bearer …` when no user session exists. The Supabase
 * REST gateway tries to JWT-decode the Authorization value — which fails
 * for opaque keys and returns 401, even when RLS would have allowed the
 * request. We override `fetch` to strip the Authorization header in that
 * exact case (opaque key being used as a bearer token, no real session).
 *
 * This is a no-op for legacy `eyJ…` JWT anon keys and for authenticated
 * requests that carry a real user JWT.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          const auth = headers.get("Authorization") ?? headers.get("authorization");
          // Only strip when the bearer value IS an opaque Supabase key
          // (sb_publishable_* / sb_secret_*). Real user JWTs start with `eyJ`.
          if (auth) {
            const token = auth.replace(/^Bearer\s+/i, "");
            if (/^sb_(publishable|secret)_/.test(token)) {
              headers.delete("Authorization");
              headers.delete("authorization");
            }
          }
          return fetch(input, { ...init, headers });
        },
      },
    },
  );
}
