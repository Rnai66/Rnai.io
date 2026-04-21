import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

type CookieEntry = { name: string; value: string; options?: Record<string, unknown> };

function cookieHandlers(cookieStore: ReadonlyRequestCookies) {
  return {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet: CookieEntry[]) {
      try {
        for (const { name, value, options } of cookiesToSet) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cookieStore.set(name, value, options as any);
        }
      } catch {
        // Called from Server Component — safe to ignore
      }
    },
  };
}

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieHandlers(cookieStore) }
  );
}
