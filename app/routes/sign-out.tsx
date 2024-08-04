import { redirect } from "@remix-run/cloudflare";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";

import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(
    request,
    context
  );

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) {
    return redirect("/", { headers });
  }

  await supabaseClient.auth.signOut();
  return redirect("/", { headers });
};
