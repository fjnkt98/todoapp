import { Link } from "@remix-run/react";
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
    // 未ログインユーザにはトップページを表示する
    return json(null, { headers });
  } else {
    // ログイン済みなら直接tasksに飛ばす
    return redirect("/tasks", { headers });
  }
};

export default function Index() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-xl font-sans my-10 text-balance px-4 text-center">
          Todo App powered by Remix + supabase
        </p>
        <Link
          to="/sign-in"
          className="px-3 py-2 bg-blue-500 rounded-lg text-white"
        >
          サインイン
        </Link>
      </div>
    </div>
  );
}
