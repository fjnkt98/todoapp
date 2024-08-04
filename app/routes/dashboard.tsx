import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";
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

  return json({ user }, { headers });
};

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.id}</p>
      <Form action="/sign-out" method="post">
        <button type="submit">Sign Out</button>
      </Form>
      <Link to="/">return to top</Link>
    </div>
  );
}
