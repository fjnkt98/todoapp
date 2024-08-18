import { redirect } from "@remix-run/cloudflare";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "~/supabase.server";
import { Form, Link } from "@remix-run/react";

export const action = async ({ request, context }: ActionFunctionArgs) => {
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

  const formData = await request.formData();
  const title = formData.get("title")?.toString();

  if (title == null) {
    throw new Response("title is required", { headers, status: 400 });
  }

  const description = formData.get("description")?.toString();
  const status = formData.get("status")?.toString();
  const deadline = formData.get("deadline")?.toString();

  const { error } = await supabaseClient.from("tasks").insert({
    title,
    description,
    status,
    deadline,
    user_id: user.id,
  });

  if (error) {
    console.log(error);
    throw new Response("failed to insert task", { headers, status: 500 });
  }

  return redirect(`/tasks`, { headers });
};

export default function NewTask() {
  return (
    <Form method="post">
      <p>
        <span>タイトル</span>
        <input
          placeholder="タイトル"
          aria-label="title"
          name="title"
          type="text"
        />
      </p>
      <p>
        <span>説明</span>
        <textarea name="description" rows={6} />
      </p>
      <p>
        <span>状態</span>
        <select name="status" defaultValue={"not started"}>
          <option value="not started">未対応</option>
          <option value="wip">対応中</option>
          <option value="done">対応済</option>
        </select>
      </p>
      <p>
        <span>締切</span>
        <input type="datetime-local" name="deadline" />
      </p>
      <p>
        <Link to="/tasks">キャンセル</Link>
        <button type="submit">作成</button>
      </p>
    </Form>
  );
}
