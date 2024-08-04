import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

import { createSupabaseServerClient } from "~/supabase.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const { supabaseClient, headers } = createSupabaseServerClient(
    request,
    context
  );

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  return json({ user }, { headers });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      {user == null ? (
        <div className="flex flex-col">
          <Link to="/sign-in">Sign in</Link>
        </div>
      ) : (
        <p>Welcome, {user.id}</p>
      )}
      <div>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}
