import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(
    request,
    context
  );
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (user == null) {
    return redirect("/sign-in", { headers });
  }

  return json(null, { headers });
};

export default function Dashboard() {
  return <div></div>;
}
