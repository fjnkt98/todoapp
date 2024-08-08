import { redirect } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

import { createSupabaseServerClient } from "~/supabase.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/";

  const { supabaseClient, headers } = createSupabaseServerClient(
    request,
    context
  );
  if (code) {
    const { error } = await supabaseClient.auth.exchangeCodeForSession(code);

    if (!error) {
      throw redirect(next, { headers, status: 500 });
    }
  }

  // return the user to an error page with instructions
  return redirect("/auth/auth-code-error", { headers });
}
