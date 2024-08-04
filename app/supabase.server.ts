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
        // storage: {
        //   getItem: (key: string) => {
        //     const cookies = parseCookieHeader(
        //       request.headers.get("Cookie") ?? ""
        //     );
        //     const cookie = cookies.find((e) => e.name == key);
        //     return cookie?.value ?? null;
        //   },
        //   setItem: (key: string, value: string) => {
        //     headers.append("Set-Cookie", serializeCookieHeader(key, value, {}));
        //   },
        //   removeItem: (key: string) => {
        //     const cookies = parseCookieHeader(
        //       request.headers.get("Cookie") ?? ""
        //     );
        //     cookies
        //       .filter((c) => c.name !== key)
        //       .forEach(({ name, value }) =>
        //         headers.append(
        //           "Set-Cookie",
        //           serializeCookieHeader(name, value, {})
        //         )
        //       );
        //   },
        // },
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
