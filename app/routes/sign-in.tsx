import { json, redirect } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
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

  const isSignedIn = user != null;

  if (isSignedIn) {
    redirect("/tasks", { headers });
  }
  return json({ isSignedIn }, { headers });
};

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Link
        to="/sign-in/github"
        className="px-3 py-2 bg-blue-500 rounded-lg text-white my-10"
      >
        GitHubでサインイン
      </Link>
    </div>
  );
}
