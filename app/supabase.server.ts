import type { AppLoadContext } from "@remix-run/cloudflare";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export const createSupabaseServerClient = (
  request: Request,
  context: AppLoadContext
) => {
  const headers = new Headers();

  const supabaseClient = createServerClient(
    context.cloudflare.env.SUPABASE_URL!,
    context.cloudflare.env.SUPABASE_ANON_KEY!,
    {
      auth: {
        detectSessionInUrl: true,
        flowType: "pkce",
      },
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );

  return { supabaseClient, headers };
};
