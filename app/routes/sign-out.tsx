import { redirect } from "@remix-run/cloudflare";
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

  // 未サインインユーザのアクセスならそのままトップページに飛ばす
  if (!user) {
    return redirect("/", { headers });
  }

  // サインアウトしてトップページに飛ばす
  await supabaseClient.auth.signOut();
  return redirect("/", { headers });
};

export default function SignOut() {
  return (
    <div>
      <h1>Signing out...</h1>
    </div>
  );
}
