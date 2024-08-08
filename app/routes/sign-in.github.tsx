import { json, redirect } from "@remix-run/cloudflare";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(
    request,
    context
  );

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (user != null) {
    redirect("/", { headers });
  }

  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${context.cloudflare.env.SITE_DOMAIN}/auth/callback`,
    },
  });

  if (error) {
    throw json({ error }, { headers, status: 500 });
  }

  return redirect(data.url, { headers });
};

export default function SignIn() {
  return <div>Log in with GitHub</div>;
}
