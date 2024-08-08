import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "~/supabase.server";
import { useLoaderData } from "@remix-run/react";

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

  const { data, error } = await supabaseClient.from("tasks").select();
  if (error) {
    throw new Response("failed to fetch data", { headers, status: 500 });
  }

  return json({ data }, { headers });
};

export default function Dashboard() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <div>
      {data.map((d) => (
        <div key={d.id}>
          <p>{d.id}</p>
          <p>{d.title}</p>
          <p>{d.description}</p>
          <p>{d.status}</p>
          <p>{d.deadline}</p>
          <p>{d.created_at}</p>
        </div>
      ))}
    </div>
  );
}
